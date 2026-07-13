import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
const AuthContext = createContext({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);
    const signOut = async () => {
        await supabase.auth.signOut();
    };
    return (_jsx(AuthContext.Provider, { value: { session, user, loading, signOut }, children: children }));
}
export function useAuth() {
    return useContext(AuthContext);
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { supabase } from "../lib/supabase";
export default function SignupPage({ onSwitch }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setError(error.message);
        }
        else {
            setError("Check your email for the confirmation link.");
        }
        setLoading(false);
    };
    return (_jsxs("form", { onSubmit: handleSignup, className: "bg-surface border border-line rounded-[10px] p-6", children: [_jsx("h2", { className: "text-lg font-['Oswald'] text-bone mb-4", children: "Create Account" }), error && _jsx("div", { className: "text-sm text-bone-dim mb-3", children: error }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e] disabled:opacity-40", children: loading ? "Creating account..." : "Create Account" }), _jsxs("p", { className: "text-xs text-bone-dim text-center mt-3", children: ["Already have an account?", " ", _jsx("button", { type: "button", onClick: onSwitch, className: "text-brass underline", children: "Sign In" })] })] }));
}

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupPage({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setError("Check your email for the confirmation link.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="bg-surface border border-line rounded-[10px] p-6">
      <h2 className="text-lg font-['Oswald'] text-bone mb-4">Create Account</h2>
      {error && <div className="text-sm text-bone-dim mb-3">{error}</div>}
      <div className="mb-3">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="text-[11px] uppercase tracking-[0.05em] text-bone-dim block mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-bg border border-line text-bone px-2.5 py-2 rounded-md text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brass text-[#1a1408] border-none px-4 py-2.5 rounded-md font-semibold text-xs uppercase tracking-[0.03em] hover:bg-[#d69a4e] disabled:opacity-40"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
      <p className="text-xs text-bone-dim text-center mt-3">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-brass underline">
          Sign In
        </button>
      </p>
    </form>
  );
}

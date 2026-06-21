import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Container } from "@/components/site/common";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Welcome back");
      nav("/admin");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-24 lg:py-32">
      <div className="max-w-md mx-auto">
        <div className="overline">Restricted</div>
        <h1 className="font-serif-display text-4xl sm:text-5xl mt-3" style={{ color: "var(--ink)" }}>Admin Sign-in</h1>
        <p className="mt-3" style={{ color: "var(--ink-soft)" }}>Only authorised members can edit site content.</p>

        <form onSubmit={submit} className="mt-10 space-y-5" data-testid="login-form">
          <label className="block">
            <span className="overline">Username</span>
            <input value={username} onChange={(e) => setU(e.target.value)} className="mt-2 w-full px-4 py-3 bg-transparent" style={{ border: "1px solid var(--line)", color: "var(--ink)" }} data-testid="login-username" autoComplete="username" required />
          </label>
          <label className="block">
            <span className="overline">Password</span>
            <input type="password" value={password} onChange={(e) => setP(e.target.value)} className="mt-2 w-full px-4 py-3 bg-transparent" style={{ border: "1px solid var(--line)", color: "var(--ink)" }} data-testid="login-password" autoComplete="current-password" required />
          </label>
          <button disabled={loading} type="submit" className="btn-primary w-full justify-center" data-testid="login-submit">
            <Lock size={14} /> {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-xs" style={{ color: "var(--ink-soft)" }}>
          <Link to="/">← Back to public site</Link>
        </p>
      </div>
    </Container>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormField from "./components/FormField";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Unable to sign in.");

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("goodies_access_token", result.access_token);
      storage.setItem("goodies_refresh_token", result.refresh_token);
      router.push("/");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <Link className="brand-mark" href="/" aria-label="Goodies home">G</Link>
        <p className="eyebrow">Welcome back</p>
        <h1 id="login-title">Sign in to Goodies</h1>
        <p className="subtitle">Enter your details to continue.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <FormField id="email" label="Email address">
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </FormField>
          <div className="field-group">
            <div className="field-header">
              <label htmlFor="password">Password</label>
              <a href="#" className="text-link">Forgot password?</a>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <label className="checkbox-label">
            <input type="checkbox" name="remember" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            <span>Remember me</span>
          </label>
          {status.message && <p className={`form-status ${status.type}`} role="status">{status.message}</p>}
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="signup-prompt">
          Don’t have an account? <Link href="/create-account" className="text-link">Create one</Link>
        </p>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <Link className="brand-mark" href="/" aria-label="Goodies home">G</Link>
        <p className="eyebrow">Welcome back</p>
        <h1 id="login-title">Sign in to Goodies</h1>
        <p className="subtitle">Enter your details to continue.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
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
          <button className="button" type="submit">Sign in</button>
        </form>

        <p className="signup-prompt">
          Don’t have an account? <Link href="/create-account" className="text-link">Create one</Link>
        </p>
      </section>
    </main>
  );
}

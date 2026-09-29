import Link from "next/link";

export default function AuthConfirmedPage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="auth-confirmed-title">
        <Link className="brand-mark" href="/" aria-label="Goodies home">G</Link>
        <p className="eyebrow">Authentication complete</p>
        <h1 id="auth-confirmed-title">Your email has been verified</h1>
        <p className="subtitle">
          Your Goodies account is ready. Sign in to continue to the marketplace.
        </p>
        <Link className="button" href="/login">Return to sign in</Link>
      </section>
    </main>
  );
}

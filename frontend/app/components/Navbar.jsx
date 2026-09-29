import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link className="brand" href="/">Goodies</Link>
      <div className="nav-actions">
        <Link className="text-link" href="/login">Sign in</Link>
        <Link className="button button-small" href="/create-account">Join Goodies</Link>
      </div>
    </nav>
  );
}

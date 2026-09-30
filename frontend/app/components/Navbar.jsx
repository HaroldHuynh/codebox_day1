"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SellModal from "./SellModal";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSellOpen, setIsSellOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const accessToken =
      localStorage.getItem("goodies_access_token") ||
      sessionStorage.getItem("goodies_access_token");

    if (!accessToken) {
      setIsCheckingAuth(false);
      return undefined;
    }

    fetch("/api/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Session expired");
        if (!cancelled) setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("goodies_access_token");
        localStorage.removeItem("goodies_refresh_token");
        sessionStorage.removeItem("goodies_access_token");
        sessionStorage.removeItem("goodies_refresh_token");
        if (!cancelled) setIsAuthenticated(false);
      })
      .finally(() => {
        if (!cancelled) setIsCheckingAuth(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function signOut() {
    localStorage.removeItem("goodies_access_token");
    localStorage.removeItem("goodies_refresh_token");
    sessionStorage.removeItem("goodies_access_token");
    sessionStorage.removeItem("goodies_refresh_token");
    setIsAuthenticated(false);
  }

  function handleSellClick() {
    if (isCheckingAuth) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsSellOpen(true);
  }

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link className="brand" href="/">Goodies</Link>
      <div className="nav-actions">
        {!isCheckingAuth && (isAuthenticated ? (
          <button className="text-link nav-button" type="button" onClick={signOut}>Sign out</button>
        ) : (
          <Link className="text-link" href="/login">Sign in</Link>
        ))}
        <button
          className="button button-small"
          type="button"
          onClick={handleSellClick}
          disabled={isCheckingAuth}
          aria-busy={isCheckingAuth}
        >
          Sell
        </button>
      </div>
      {isSellOpen && <SellModal onClose={() => setIsSellOpen(false)} />}
    </nav>
  );
}

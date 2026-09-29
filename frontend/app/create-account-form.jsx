"use client";

import Link from "next/link";
import { useState } from "react";
import FormField from "./components/FormField";

const initialForm = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

export default function CreateAccountForm() {
  const [form, setForm] = useState(initialForm);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <main className="login-page">
      <section className="login-card create-account-card" aria-labelledby="create-account-title">
        <Link className="brand-mark" href="/" aria-label="Goodies home">G</Link>
        <p className="eyebrow">Get started</p>
        <h1 id="create-account-title">Create your Goodies account</h1>
        <p className="subtitle">Set up your account to get started.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="name-fields">
            <FormField id="first-name" label="First name"><input id="first-name" name="firstName" type="text" autoComplete="given-name" value={form.firstName} onChange={updateField} required /></FormField>
            <FormField id="last-name" label="Last name"><input id="last-name" name="lastName" type="text" autoComplete="family-name" value={form.lastName} onChange={updateField} required /></FormField>
          </div>
          <FormField id="account-email" label="Email address"><input id="account-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={updateField} required /></FormField>
          <FormField id="account-password" label="Password"><input id="account-password" name="password" type="password" autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={updateField} required /></FormField>
          <FormField id="confirm-password" label="Confirm password"><input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={updateField} required /></FormField>
          <button className="button" type="submit">Create account</button>
        </form>

        <p className="signup-prompt">Already have an account? <Link href="/login" className="text-link">Sign in</Link></p>
      </section>
    </main>
  );
}

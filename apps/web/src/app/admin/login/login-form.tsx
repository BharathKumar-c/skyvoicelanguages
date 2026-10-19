"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import { useActionState } from "react";

import { loginAction, type LoginState } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {
    error: null,
  });

  return (
    <form action={formAction} className="admin-form-stack">
      <label className="admin-field">
        <span>Username</span>
        <input autoComplete="username" name="username" required />
      </label>
      <label className="admin-field">
        <span>Password</span>
        <input autoComplete="current-password" name="password" required type="password" />
      </label>
      {state.error ? (
        <div className="admin-notice is-error" role="alert">
          {state.error}
        </div>
      ) : null}
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? <LoaderCircle aria-hidden="true" className="spin" /> : <LogIn aria-hidden="true" />}
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}

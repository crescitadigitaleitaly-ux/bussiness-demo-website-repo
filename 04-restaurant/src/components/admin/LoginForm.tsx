"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginAction } from "@/lib/cms/actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(loginAction, null);
  const [show, setShow] = useState(false);

  if (!configured) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 text-sm leading-relaxed">
        <h1 className="text-lg font-semibold">Admin panel not set up yet</h1>
        <p className="mt-2 text-muted">Add ADMIN_EMAIL, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET to the environment (see the README), then reload this page.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5 rounded-xl border border-line bg-surface p-6 shadow-[0_30px_60px_-45px_rgb(15_42_58/0.6)] sm:p-7">
      <h1 className="text-xl font-semibold">Log in</h1>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <input name="email" type="email" required autoComplete="username" className="admin-input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Password</span>
        <span className="relative block">
          <input name="password" type={show ? "text" : "password"} required autoComplete="current-password" className="admin-input pr-12" />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink"
          >
            {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </span>
      </label>
      {state?.error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className="admin-btn-primary w-full">
        <LogIn className="size-4" aria-hidden />
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}

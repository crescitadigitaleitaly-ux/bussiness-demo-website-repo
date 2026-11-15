import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { adminConfigured, getAdmin } from "@/lib/cms/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo />
          <p className="text-sm text-muted">Website admin</p>
        </div>
        <Suspense fallback={<div className="h-72 rounded-xl border border-line bg-surface" />}>
          <Login />
        </Suspense>
      </div>
    </main>
  );
}

async function Login() {
  const configured = adminConfigured();
  if (!configured && process.env.NODE_ENV === "production") notFound();
  if (await getAdmin()) redirect("/admin");
  return <LoginForm configured={configured} />;
}

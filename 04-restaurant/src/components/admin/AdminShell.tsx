import Link from "next/link";
import { Clock, ExternalLink, Fish, Home, LayoutDashboard, LogOut, UtensilsCrossed } from "lucide-react";
import { logoutAction } from "@/lib/cms/actions";
import { Logo } from "@/components/Logo";

export const NAV = [
  { href: "/admin", key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/catch", key: "catch", label: "Today's catch", icon: Fish },
  { href: "/admin/menu", key: "menu", label: "Menu & prices", icon: UtensilsCrossed },
  { href: "/admin/hours", key: "hours", label: "Opening hours", icon: Clock },
  { href: "/admin/homepage", key: "homepage", label: "Homepage", icon: Home },
] as const;

type Key = (typeof NAV)[number]["key"];

export function AdminShell({ active, email, title, intro, children }: { active: Key; email: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-7">
          <Link href="/admin" aria-label="Dashboard"><Logo /></Link>
          <p className="hidden text-xs text-muted lg:mt-2 lg:block">Website admin</p>
          <form action={logoutAction} className="lg:hidden">
            <button type="submit" className="admin-btn min-h-9 px-3"><LogOut className="size-4" aria-hidden />Log out</button>
          </form>
        </div>
        <nav aria-label="Admin" className="overflow-x-auto px-3 pb-3 lg:px-3">
          <ul className="flex gap-1 lg:flex-col">
            {NAV.map(({ href, key, label, icon: Icon }) => (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={active === key ? "page" : undefined}
                  className="flex min-h-11 items-center gap-3 whitespace-nowrap rounded-md px-3 text-[0.95rem] font-medium text-muted transition-colors hover:bg-mist hover:text-ink aria-[current=page]:bg-ink aria-[current=page]:text-mist"
                >
                  <Icon className="size-[1.1rem] shrink-0" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden space-y-3 border-t border-line px-6 py-5 text-sm lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <a href="/en" target="_blank" rel="noopener" className="flex items-center gap-2 font-medium text-ink hover:underline">
            View website <ExternalLink className="size-3.5" aria-hidden />
          </a>
          <p className="truncate text-xs text-muted" title={email}>Signed in as {email}</p>
          <form action={logoutAction}>
            <button type="submit" className="admin-btn w-full"><LogOut className="size-4" aria-hidden />Log out</button>
          </form>
        </div>
      </aside>

      <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)] leading-tight">{title}</h1>
            {intro && <p className="mt-2 max-w-[60ch] text-muted">{intro}</p>}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="grid min-h-dvh place-items-center text-sm text-muted" role="status">
      Loading…
    </div>
  );
}

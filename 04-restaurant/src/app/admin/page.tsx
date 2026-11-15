import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireAdmin } from "@/lib/cms/auth";
import { readContent, storageMode } from "@/lib/cms/storage";
import type { CatchData, HomeData, HoursData, MenuData } from "@/lib/cms/schema";
import { AdminLoading, AdminShell, NAV } from "@/components/admin/AdminShell";

export default function DashboardPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const admin = await requireAdmin();
  const [c, m, h, home] = (await Promise.all([readContent("catch"), readContent("menu"), readContent("hours"), readContent("home")])) as [CatchData, MenuData, HoursData, HomeData];
  const dishes = m.sections.reduce((n, s) => n + s.items.length, 0);
  const shown = Object.values(home.sections).filter(Boolean).length;

  const summary: Record<string, { text: string; detail: string }> = {
    catch: { text: "Update the fish and prices of the day.", detail: `${c.items.length} items · updated at ${c.updatedAt}` },
    menu: { text: "Change dishes, prices, allergens and sections.", detail: `${m.sections.length} sections · ${dishes} dishes` },
    hours: { text: "Set open days and lunch or dinner times.", detail: `Open ${h.days.length} ${h.days.length === 1 ? "day" : "days"} a week` },
    homepage: { text: "Edit the main headline and show or hide sections.", detail: `${shown} of ${Object.keys(home.sections).length} sections shown` },
  };

  return (
    <AdminShell active="dashboard" email={admin.email} title="Welcome back" intro="Choose what you want to update. Your changes go live when you press “Save changes”.">
      <ul className="grid gap-4 sm:grid-cols-2">
        {NAV.filter((n) => n.key !== "dashboard").map(({ href, key, label, icon: Icon }) => (
          <li key={key}>
            <Link href={href} className="admin-card group flex h-full flex-col gap-3 transition-colors hover:border-ink/40">
              <span className="grid size-11 place-items-center rounded-lg bg-mist text-ink"><Icon className="size-5" aria-hidden /></span>
              <span className="text-lg font-semibold">{label}</span>
              <span className="text-muted">{summary[key].text}</span>
              <span className="mt-auto flex items-center justify-between pt-2 text-sm">
                <span className="text-muted">{summary[key].detail}</span>
                <span className="inline-flex items-center gap-1 font-semibold">Edit <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {storageMode() === "github" && (
        <p className="mt-6 text-sm text-muted">After you save, the website takes about 2 minutes to show the change.</p>
      )}
    </AdminShell>
  );
}

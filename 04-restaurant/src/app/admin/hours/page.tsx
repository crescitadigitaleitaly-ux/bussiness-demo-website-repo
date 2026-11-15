import { Suspense } from "react";
import { requireAdmin } from "@/lib/cms/auth";
import { readContent } from "@/lib/cms/storage";
import type { HoursData } from "@/lib/cms/schema";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { HoursEditor } from "@/components/admin/HoursEditor";

export default function Page() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Editor />
    </Suspense>
  );
}

async function Editor() {
  const admin = await requireAdmin();
  const data = (await readContent("hours")) as HoursData;
  return (
    <AdminShell active="hours" email={admin.email} title="Opening hours" intro="Used on every page, in the footer and in the live “Open now” badge.">
      <HoursEditor initial={data} />
    </AdminShell>
  );
}

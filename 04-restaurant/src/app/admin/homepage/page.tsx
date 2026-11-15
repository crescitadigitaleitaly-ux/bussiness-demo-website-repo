import { Suspense } from "react";
import { requireAdmin } from "@/lib/cms/auth";
import { readContent } from "@/lib/cms/storage";
import type { HomeData } from "@/lib/cms/schema";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { HomeEditor } from "@/components/admin/HomeEditor";

export default function Page() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Editor />
    </Suspense>
  );
}

async function Editor() {
  const admin = await requireAdmin();
  const data = (await readContent("home")) as HomeData;
  return (
    <AdminShell active="homepage" email={admin.email} title="Homepage" intro="The first thing visitors see.">
      <HomeEditor initial={data} />
    </AdminShell>
  );
}

import { Suspense } from "react";
import { requireAdmin } from "@/lib/cms/auth";
import { readContent } from "@/lib/cms/storage";
import type { MenuData } from "@/lib/cms/schema";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { MenuEditor } from "@/components/admin/MenuEditor";

export default function Page() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Editor />
    </Suspense>
  );
}

async function Editor() {
  const admin = await requireAdmin();
  const data = (await readContent("menu")) as MenuData;
  return (
    <AdminShell active="menu" email={admin.email} title="Menu & prices" intro="Every dish on the menu page. Open a section to change its dishes.">
      <MenuEditor initial={data} />
    </AdminShell>
  );
}

import { Suspense } from "react";
import { requireAdmin } from "@/lib/cms/auth";
import { readContent } from "@/lib/cms/storage";
import type { CatchData } from "@/lib/cms/schema";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { CatchEditor } from "@/components/admin/CatchEditor";

export default function Page() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Editor />
    </Suspense>
  );
}

async function Editor() {
  const admin = await requireAdmin();
  const data = (await readContent("catch")) as CatchData;
  return (
    <AdminShell active="catch" email={admin.email} title="Today's catch" intro="The fish and seafood shown on the homepage, with today's prices.">
      <CatchEditor initial={data} />
    </AdminShell>
  );
}

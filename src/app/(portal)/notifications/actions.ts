"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/rbac";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function markReadAction(formData: FormData) {
  const profile = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createSupabaseServer();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", profile.id);
  revalidatePath("/notifications");
}

export async function markAllReadAction() {
  const profile = await requireUser();
  const supabase = await createSupabaseServer();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", profile.id)
    .is("read_at", null);
  revalidatePath("/notifications");
  redirect("/notifications");
}

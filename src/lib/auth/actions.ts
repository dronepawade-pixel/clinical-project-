"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { setSession, clearSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DEMO_PASSWORD = "demo12345";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  // Confirm the account exists on Supabase; password is the shared demo secret.
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error || !data || password !== DEMO_PASSWORD) {
    redirect("/login?error=invalid");
  }

  await setSession({ email });
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  revalidatePath("/");
  redirect("/login");
}

// Demo build: accounts are pre-seeded. Direct visitors to the demo logins.
export async function signupAction() {
  redirect("/login?created=1");
}

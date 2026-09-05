import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth/session";
import { createSupabaseServer } from "@/lib/supabase/server";

const DEMO_PASSWORD = "demo12345";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    const redirectUrl = new URL("/login", request.url);
    if (!email || !password) {
      redirectUrl.searchParams.set("error", "missing");
      return NextResponse.redirect(redirectUrl, 303);
    }

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error || !data || password !== DEMO_PASSWORD) {
      redirectUrl.searchParams.set("error", "invalid");
      return NextResponse.redirect(redirectUrl, 303);
    }

    await setSession({ email });
    return NextResponse.redirect(new URL("/dashboard", request.url), 303);
  } catch {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("error", "other");
    return NextResponse.redirect(redirectUrl, 303);
  }
}

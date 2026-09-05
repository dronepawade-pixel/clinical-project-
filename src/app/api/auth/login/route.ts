import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

const DEMO_PASSWORD = "demo12345";
const PENDING_COOKIE = "ct_pending";

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

    // Credentials valid — stash the email in a short-lived pending cookie
    // and route to the OTP step instead of creating the session yet.
    const redirect = NextResponse.redirect(new URL("/verify-otp", request.url), 303);
    redirect.cookies.set(PENDING_COOKIE, Buffer.from(email).toString("base64"), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 300, // 5 minutes to enter OTP
    });
    return redirect;
  } catch {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("error", "other");
    return NextResponse.redirect(redirectUrl, 303);
  }
}

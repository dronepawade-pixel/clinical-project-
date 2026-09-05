import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth/session";

const PENDING_COOKIE = "ct_pending";
const DEMO_OTP = "482913";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = String(formData.get("token") ?? "").trim();

    // Recover the email stashed by the login step.
    const pendingRaw = request.cookies.get(PENDING_COOKIE)?.value;
    if (!pendingRaw) {
      return NextResponse.redirect(new URL("/login?error=expired", request.url), 303);
    }
    const email = Buffer.from(pendingRaw, "base64").toString("utf8");

    if (token !== DEMO_OTP) {
      const redirectUrl = new URL("/verify-otp", request.url);
      redirectUrl.searchParams.set("error", "invalid");
      return NextResponse.redirect(redirectUrl, 303);
    }

    // OTP valid — establish the session and clear the pending cookie.
    await setSession({ email });
    const redirect = NextResponse.redirect(new URL("/dashboard", request.url), 303);
    redirect.cookies.delete(PENDING_COOKIE);
    return redirect;
  } catch {
    return NextResponse.redirect(new URL("/login?error=other", request.url), 303);
  }
}

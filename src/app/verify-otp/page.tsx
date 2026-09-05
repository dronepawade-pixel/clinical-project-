import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function VerifyOtpPage() {
  const session = await getSession();
  redirect(session ? "/dashboard" : "/login");
}

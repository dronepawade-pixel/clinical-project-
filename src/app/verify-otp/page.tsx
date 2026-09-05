import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell>
      <Card className="glass w-full max-w-sm border-white/10 bg-white/[0.04] ring-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl text-white">Two-factor verification</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter the 6-digit demo code to continue.
          </CardDescription>
        </CardHeader>
        <form action="/api/auth/otp" method="POST">
          <CardContent className="space-y-4">
            {error === "invalid" && (
              <p className="text-sm text-destructive">
                Invalid code. Please try again.
              </p>
            )}
            {error === "missing" && (
              <p className="text-sm text-destructive">
                Please enter your verification code.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="token">Verification code</Label>
              <Input
                id="token"
                name="token"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                maxLength={6}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full bg-white text-black hover:bg-white/85">
              Verify &amp; continue
            </Button>
            <Link
              href="/login"
              className="text-sm text-zinc-400 underline-offset-2 hover:underline"
            >
              Back to sign in
            </Link>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  );
}

import { redirect } from "next/navigation";

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="dark relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] text-zinc-100">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
        <h1 className="text-xl font-semibold text-white">Two-factor verification</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter the 6-digit demo code to continue.
        </p>

        {error === "invalid" && (
          <p className="mt-3 text-sm text-red-400">Invalid code. Use 482913.</p>
        )}
        {error === "missing" && (
          <p className="mt-3 text-sm text-red-400">Please enter the code.</p>
        )}

        <form action="/api/auth/otp" method="POST" className="mt-6 space-y-4">
          <input
            id="token"
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            maxLength={6}
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-white/30"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-white/85"
          >
            Verify &amp; continue
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Demo code: <span className="font-mono text-zinc-300">482913</span>
        </p>

        <p className="mt-2 text-center text-xs">
          <a href="/login" className="text-zinc-400 underline-offset-2 hover:underline">
            Back to sign in
          </a>
        </p>
      </div>
    </main>
  );
}

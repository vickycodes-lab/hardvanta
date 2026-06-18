"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("password"); // "password" | "otp"
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: verify password and request an OTP by email.
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Invalid email or password.");
      return;
    }
    setStep("otp");
    setInfo(`We've emailed a 6-digit code to ${email}.`);
  }

  // Step 2: complete sign-in with email + password + OTP.
  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      otp,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setError("Invalid or expired code. Please try again.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  async function resendOtp() {
    setError("");
    setInfo("");
    setLoading(true);
    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    setInfo(res.ok ? `A new code was sent to ${email}.` : "");
    if (!res.ok) setError("Could not resend the code.");
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
        <p className="mt-1 text-sm text-silver-dark">
          Log in to your hardvanta account.
        </p>

        {step === "password" ? (
          <>
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-silver-dark bg-white py-2.5 text-sm font-semibold text-navy hover:border-royal hover:text-royal"
            >
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-silver">
              <span className="h-px flex-1 bg-silver-light" />
              OR
              <span className="h-px flex-1 bg-silver-light" />
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-navy">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-navy">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-silver-dark px-3 py-2.5 pr-10 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-dark hover:text-royal"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending code…" : "Continue"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-silver-dark">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-royal">
                Create one
              </Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
            {info && (
              <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                {info}
              </p>
            )}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                Enter 6-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-center text-lg font-semibold tracking-[0.5em] outline-none focus:border-royal focus:ring-2 focus:ring-royal/30"
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading || otp.length < 6}>
              {loading ? "Verifying…" : "Verify & Sign in"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => { setStep("password"); setOtp(""); setError(""); setInfo(""); }}
                className="text-silver-dark hover:text-royal"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={resendOtp}
                disabled={loading}
                className="font-semibold text-royal hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
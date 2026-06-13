"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
        <p className="mt-1 text-sm text-silver-dark">
          Log in to your hardvanta account.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-silver-dark bg-white py-2.5 text-sm font-semibold text-navy hover:border-royal hover:text-royal"
        >
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-silver">
          <span className="h-px flex-1 bg-silver-light" /> OR{" "}
          <span className="h-px flex-1 bg-silver-light" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-silver-dark">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-royal">
            Create one
          </Link>
        </p>
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

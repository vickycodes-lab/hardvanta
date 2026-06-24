// POST /api/auth/otp/request  { email, password }
// Step 1 of two-factor login: verify the password, then email a 6-digit code.
// Always returns a generic success to avoid leaking which emails exist.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { sendOtpEmail } from "@/lib/email";

export async function POST(request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { email: normalized } });

  // Verify credentials. On any failure, return a clear (but non-enumerating) error.
  const valid = user?.password && (await bcrypt.compare(password, user.password));
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  // Generate a 6-digit code valid for 10 minutes.
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  // Replace any previous codes for this email.
  await prisma.loginOtp.deleteMany({ where: { email: normalized } });
  await prisma.loginOtp.create({ data: { email: normalized, code, expires } });

  const result = await sendOtpEmail(normalized, code);

  // Demo mode: when no email provider is configured, return the code so the
  // login screen can display it. Real email sending takes over once
  // RESEND_API_KEY is set.
  const demo = !result.sent && !process.env.RESEND_API_KEY;

  return NextResponse.json({ ok: true, demo, ...(demo ? { devCode: code } : {}) });
}

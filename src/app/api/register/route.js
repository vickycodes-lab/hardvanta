// POST /api/register — create a new email/password user.
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    // Indian mobile number: 10 digits starting 6-9.
    const phoneDigits = String(phone || "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9][0-9]{9}$/.test(phoneDigits)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const { prisma } = await import("@/lib/prisma");
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: normalizedEmail,
        phone: phoneDigits,
        password: hashed,
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

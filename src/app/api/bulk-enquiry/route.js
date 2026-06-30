// POST /api/bulk-enquiry — saves a B2B / bulk order enquiry to the database.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, organization, email, phone, enquiryType, products, quantity, message } = body;

    if (!name || !email || !phone || !products || !quantity) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const enquiry = await prisma.bulkEnquiry.create({
      data: {
        name,
        organization: organization || null,
        email,
        phone,
        enquiryType: enquiryType || "Other",
        products,
        quantity,
        message: message || null,
      },
    });

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (err) {
    return NextResponse.json(
      { error: `Could not submit enquiry: ${err?.message || "unknown error"}` },
      { status: 500 }
    );
  }
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/utils/formatPrice";
import Button from "@/components/ui/Button";

export default function CheckoutPage() {
  const router = useRouter();
  const { status } = useSession();
  const { items, total, count } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payMethod, setPayMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Require login to check out (orders are created from the server-side cart).
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  const shipping = total > 999 ? 0 : 49;
  const grandTotal = total + shipping;

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Loads the Razorpay checkout widget script once, on demand.
  function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleCOD() {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: form }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not place order.");
    router.push("/orders?placed=1");
    router.refresh();
  }

  async function handleOnlinePayment() {
    const ok = await loadRazorpayScript();
    if (!ok) throw new Error("Could not load payment gateway. Check your connection.");

    // 1. Create a Razorpay order on the server.
    const res = await fetch("/api/payment/create-order", { method: "POST" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not start payment.");

    // 2. Open the Razorpay checkout widget.
    await new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "hardvanta",
        description: "Order payment",
        order_id: data.orderId,
        prefill: { name: form.fullName, contact: form.phone },
        theme: { color: "#2545d3" },
        handler: async (response) => {
          // 3. Verify the signature on the server, then create the DB order.
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, address: form }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            reject(new Error(verifyData.error || "Payment verification failed."));
            return;
          }
          router.push("/orders?placed=1");
          router.refresh();
          resolve();
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled.")),
        },
      });
      rzp.on("payment.failed", (resp) =>
        reject(new Error(resp.error?.description || "Payment failed."))
      );
      rzp.open();
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (payMethod === "ONLINE") {
        await handleOnlinePayment();
      } else {
        await handleCOD();
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="container-page py-24 text-center text-silver-dark">
        Loading…
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Your cart is empty</h1>
        <Link
          href="/products"
          className="mt-6 rounded-lg bg-royal px-6 py-3 font-semibold text-white hover:bg-royal-dark"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-navy">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Address form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-silver-light bg-white p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-bold text-navy">Shipping Address</h2>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={form.fullName} onChange={(v) => update("fullName", v)} required />
            <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} required />
          </div>
          <Field label="Address" value={form.line1} onChange={(v) => update("line1", v)} required />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
            <Field label="State" value={form.state} onChange={(v) => update("state", v)} required />
            <Field label="Pincode" value={form.pincode} onChange={(v) => update("pincode", v)} required />
          </div>

          {/* Payment method */}
          <div className="pt-2">
            <h3 className="mb-2 text-sm font-semibold text-navy">Payment Method</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <PayOption
                active={payMethod === "ONLINE"}
                onClick={() => setPayMethod("ONLINE")}
                title="Pay Online"
                desc="UPI, Cards, Netbanking"
              />
              <PayOption
                active={payMethod === "COD"}
                onClick={() => setPayMethod("COD")}
                title="Cash on Delivery"
                desc="Pay when it arrives"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading
              ? "Processing…"
              : payMethod === "ONLINE"
                ? `Pay ${formatPrice(grandTotal)}`
                : `Place Order · ${formatPrice(grandTotal)}`}
          </Button>
          <p className="text-center text-xs text-silver-dark">
            {payMethod === "ONLINE"
              ? "Secured by Razorpay. Test mode — use a test card/UPI."
              : "No payment now — pay in cash on delivery."}
          </p>
        </form>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-silver-light bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-navy">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="mr-2 line-clamp-1 text-silver-dark">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-semibold">
                  {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-silver-light" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-silver-dark">Subtotal</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver-dark">Shipping</span>
              <span className="font-semibold text-green-600">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
          </div>
          <div className="my-4 border-t border-silver-light" />
          <div className="flex justify-between text-base font-bold text-navy">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayOption({ active, onClick, title, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
        active
          ? "border-royal bg-royal/5 ring-1 ring-royal"
          : "border-silver-dark hover:border-royal"
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          active ? "border-royal" : "border-silver-dark"
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-royal" />}
      </span>
      <span>
        <span className="block text-sm font-semibold text-navy">{title}</span>
        <span className="block text-xs text-silver-dark">{desc}</span>
      </span>
    </button>
  );
}

function Field({ label, value, onChange, required }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-navy">{label}</label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-silver-dark px-3 py-2.5 text-sm outline-none focus:border-royal focus:ring-2 focus:ring-royal/30"
      />
    </div>
  );
}

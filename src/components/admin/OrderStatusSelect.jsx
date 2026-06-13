"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusSelect({ id, status }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  async function handleChange(e) {
    const next = e.target.value;
    const prev = value;
    setValue(next);
    setBusy(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      setValue(prev); // revert on failure
      alert("Could not update status.");
    }
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={busy}
      className="rounded-lg border border-silver-dark px-3 py-1.5 text-sm font-semibold text-navy outline-none focus:border-royal disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

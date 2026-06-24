"use client";
import { useEffect, useRef } from "react";

/* ── Row component ── */
function Row({ label, value, color }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #f0f0f0",
    }}>
      <span style={{ fontSize: 14, color: "#6b7280" }}>{label}</span>
      <span style={{
        fontSize: 14,
        fontWeight: 600,
        color: color === "green" ? "#16a34a" : color === "red" ? "#dc2626" : "#111827",
      }}>
        {value}
      </span>
    </div>
  );
}

/* ── Checklist component ── */
function Checklist({ items }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#374151" }}>
          <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 15, flexShrink: 0, marginTop: 1 }}>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Note component ── */
function Note({ children }) {
  return (
    <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 10, lineHeight: 1.6 }}>
      {children}
    </p>
  );
}

/* ── Section component ── */
function Section({ heading, children }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      gap: "2rem",
      alignItems: "start",
      padding: "2.25rem 0",
      borderBottom: "1px solid #f3f4f6",
    }}>
      <p style={{
        fontSize: 15,
        fontWeight: 700,
        color: "#111827",
        margin: 0,
        paddingTop: 2,
      }}>
        {heading}
      </p>
      <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ShippingRefundPage() {
  const plusRef = useRef(null);

  useEffect(() => {
    const el = plusRef.current;
    if (!el) return;
    const cols = Math.ceil(window.innerWidth / 40) + 3;
    const rows = 10;
    let html = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        html += `<span style="position:absolute;left:${c * 40 - 2}px;top:${r * 40 - 2}px;font-size:13px;color:rgba(120,160,255,0.13);user-select:none;line-height:1">+</span>`;
      }
    }
    el.innerHTML = html;
  }, []);

  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", margin: 0, padding: 0 }}>

      {/* ── HERO — dark blue ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0b1629 0%, #0e2050 55%, #1840a0 100%)",
        padding: "clamp(2.5rem,5vw,5rem) clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5.5rem)",
      }}>
        {/* + grid */}
        <div ref={plusRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(160,190,255,0.6)", marginBottom: "1.5rem" }}>
            <a href="/" style={{ color: "rgba(160,190,255,0.6)", textDecoration: "none" }}>Home</a>
            <span style={{ opacity: 0.4 }}>›</span>
            <span style={{ color: "rgba(200,220,255,0.9)" }}>Shipping &amp; Refund Policy</span>
          </nav>

          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(210,230,255,0.95)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: 999,
            marginBottom: "1.5rem",
          }}>
            🛡 Buyer Protected
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(36px,6vw,62px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            color: "#ffffff",
            margin: "0 0 1rem 0",
          }}>
            Shipping &amp;<br />Refund Policy
          </h1>

          {/* Intro */}
          <p style={{
            fontSize: 16,
            color: "rgba(170,200,255,0.68)",
            lineHeight: 1.7,
            maxWidth: 500,
            margin: 0,
          }}>
            Everything you need to know about delivery, returns, and refunds —
            Hardvanta Technologies LLP.
          </p>
        </div>
      </div>

      {/* ── BODY — white ── */}
      <div style={{ background: "#ffffff", minHeight: "60vh" }}>
        <div style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "0 clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)",
        }}>

          <Section heading="Shipping charges">
            <Row label="Orders above ₹999" value="Free" color="green" />
            <Row label="Orders below ₹999" value="₹49 flat fee" />
          </Section>

          <Section heading="Delivery time">
            <Row label="Dispatch" value="1–2 business days" />
            <Row label="Delivery" value="3–7 business days" />
            <Note>Actual delivery time may vary depending on your location.</Note>
          </Section>

          <Section heading="Returns">
            <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.75 }}>
              Due to the nature of electronic products, we do{" "}
              <strong style={{ color: "#111827", fontWeight: 700 }}>not accept returns</strong>{" "}
              once an order has been delivered. Please review product specifications
              carefully before placing your order.
            </p>
          </Section>

          <Section heading="Refunds">
            <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.75 }}>
              Refunds are{" "}
              <strong style={{ color: "#111827", fontWeight: 700 }}>not applicable</strong>{" "}
              for delivered electronic items. Exceptions are considered only where:
            </p>
            <Checklist
              items={[
                "Product was damaged in transit",
                "Item was defective upon arrival",
                "An incorrect item was shipped",
              ]}
            />
            <Note>All claims are subject to verification by our support team.</Note>
          </Section>

          <Section heading="Cancellations">
            <Row label="Before shipping" value="Allowed" color="green" />
            <Row label="After shipping" value="Not allowed" color="red" />
            <Note>Once shipped, the standard return policy applies.</Note>
          </Section>

        </div>
      </div>

    </main>
  );
}
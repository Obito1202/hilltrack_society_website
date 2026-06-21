import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Container, SectionHeading } from "@/components/site/common";
import { HeartHandshake } from "lucide-react";

export default function Donate() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/settings").then((r) => setS(r.data)); }, []);

  return (
    <Container className="py-24 lg:py-32">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <SectionHeading overline="Support our work" title="Your contribution lights a street, fills a backpack, prints a book." lead="Every rupee donated to Hilltrack Society goes directly into education, environment or energy programs in the hills. We keep overheads to the minimum." />
          <div className="mt-12 p-10" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
            <HeartHandshake style={{ color: "var(--accent)" }} size={28} />
            <div className="overline mt-6">Bank Transfer</div>
            <pre className="mt-3 whitespace-pre-wrap font-sans-app text-base" style={{ color: "var(--ink)" }} data-testid="donate-bank">
{s?.bank_details || "Bank details will be updated soon. Please contact the Secretary at vaibhavjoshi1202@gmail.com for donation instructions."}
            </pre>
            {s?.upi_id && (
              <>
                <div className="overline mt-8">UPI</div>
                <p className="mt-3 font-serif-display text-2xl" style={{ color: "var(--ink)" }} data-testid="donate-upi">{s.upi_id}</p>
              </>
            )}
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="p-10" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            <div className="overline" style={{ color: "#E8B79A" }}>What your donation can do</div>
            <ul className="mt-6 space-y-5 font-serif-display text-2xl leading-snug">
              <li>₹500 — Stationery kit for one student</li>
              <li>₹2,500 — A small library in a village school</li>
              <li>₹15,000 — One solar street light installed</li>
              <li>₹50,000 — Biogas pilot for a hamlet</li>
            </ul>
          </div>
        </aside>
      </div>
    </Container>
  );
}

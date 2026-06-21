import { useEffect, useState } from "react";
import { loadData } from "../lib/data";
import { Container, SectionHeading } from "../components/PublicLayout.jsx";

export default function Donate() {
  const [s, setS] = useState(null);
  useEffect(() => { loadData("settings").then(setS); }, []);
  return (
    <Container className="py-24 lg:py-32">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <SectionHeading overline="Support our work" title="Your contribution lights a street, fills a backpack, prints a book." lead="Every rupee donated to Hilltrack Society goes directly into education, environment or energy programs in the hills." />
          <div className="mt-12 p-10" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
            <div className="overline mt-2">Bank Transfer</div>
            <pre className="mt-3 whitespace-pre-wrap text-base" style={{ fontFamily: "'Outfit', sans-serif" }}>
{s?.bank_details || "Bank details will be updated soon. Please contact the Secretary at vaibhavjoshi1202@gmail.com for donation instructions."}
            </pre>
            {s?.upi_id && (<><div className="overline mt-8">UPI</div><p className="mt-3 font-serif-display text-2xl">{s.upi_id}</p></>)}
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="p-10" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            <div className="overline" style={{ color: "#E8B79A" }}>What your donation can do</div>
            <ul className="mt-6 space-y-5 font-serif-display text-2xl leading-snug">
              {(s?.donation_tiers || []).map((t, i) => (
                <li key={i}><strong style={{ fontWeight: 600 }}>{t.amount}</strong> — {t.description}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Container>
  );
}

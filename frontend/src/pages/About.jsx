import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Container, SectionHeading, useReveal } from "@/components/site/common";

export default function About() {
  useReveal();
  const [settings, setSettings] = useState(null);
  useEffect(() => { api.get("/settings").then((r) => setSettings(r.data)); }, []);

  return (
    <div>
      <Container className="py-24 lg:py-32">
        <SectionHeading
          overline="About the Society"
          title="A society of educators, engineers and elders — working where the road thins out."
          lead={settings?.about}
        />

        <div className="mt-20 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="sticky top-10">
              <div className="overline">Registered Office</div>
              <p className="mt-3 font-serif-display text-2xl" style={{ color: "var(--ink)" }}>
                Joshi Niwas, Malla Krishnapur,<br/>Tallital, Nainital,<br/>Uttarakhand
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="overline mb-6">Aims & Objectives</div>
            <ol className="space-y-6">
              {(settings?.aims || []).map((a, i) => (
                <li key={i} className="reveal flex gap-6 border-b pb-6" style={{ borderColor: "var(--line)" }} data-testid={`aim-item-${i}`}>
                  <span className="font-serif-display text-3xl shrink-0 w-12" style={{ color: "var(--accent)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ color: "var(--ink-soft)" }} className="text-lg leading-relaxed">{a}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </div>
  );
}

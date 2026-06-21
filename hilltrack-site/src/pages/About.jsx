import { useEffect, useState } from "react";
import { loadData } from "../lib/data";
import { Container, SectionHeading } from "../components/PublicLayout.jsx";

export default function About() {
  const [s, setS] = useState(null);
  useEffect(() => { loadData("settings").then(setS); }, []);
  return (
    <Container className="py-24 lg:py-32">
      <SectionHeading overline="About the Society" title="A society of educators, engineers and elders — working where the road thins out." lead={s?.about} />
      <div className="mt-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="sticky top-10">
            <div className="overline">Registered Office</div>
            <p className="mt-3 font-serif-display text-2xl">Joshi Niwas, Malla Krishnapur,<br/>Tallital, Nainital, Uttarakhand</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="overline mb-6">Aims & Objectives</div>
          <ol className="space-y-6">
            {(s?.aims || []).map((a,i) => (
              <li key={i} className="flex gap-6 border-b pb-6" style={{ borderColor: "var(--line)" }}>
                <span className="font-serif-display text-3xl shrink-0 w-12" style={{ color: "var(--accent)" }}>{String(i+1).padStart(2,"0")}</span>
                <p style={{ color: "var(--ink-soft)" }} className="text-lg leading-relaxed">{a}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Container>
  );
}

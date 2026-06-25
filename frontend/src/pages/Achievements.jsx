import { useEffect, useState } from "react";
import { api, assetUrl } from "@/lib/api";
import { Container, SectionHeading, useReveal } from "@/components/site/common";

export default function Achievements() {
  useReveal();
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/achievements").then((r) => setItems(r.data)); }, []);

  return (
    <Container className="py-24 lg:py-32">
      <SectionHeading overline="Achievements" title="Milestones we are proud of." />
      {items.length === 0 ? (
        <p className="mt-16 text-lg" style={{ color: "var(--ink-soft)" }}>Achievements will appear here.</p>
      ) : (
        <div className="mt-16 grid md:grid-cols-2 gap-12">
          {items.map((a) => (
            <article key={a.id} className="reveal border-l-2 pl-8" style={{ borderColor: "var(--accent)" }} data-testid={`achievement-card-${a.id}`}>
              <div className="overline">{a.year}</div>
              <h3 className="font-serif-display text-3xl mt-2" style={{ color: "var(--ink)" }}>{a.title}</h3>
              {a.description && <p className="mt-3" style={{ color: "var(--ink-soft)" }}>{a.description}</p>}
              {a.image_url && (
                <div className="mt-6 aspect-[16/10] overflow-hidden">
                  <img src={assetUrl(a.image_url)} alt={a.title} className="w-full h-full object-contain" />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </Container>
  );
}

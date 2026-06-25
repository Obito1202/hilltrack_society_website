import { useEffect, useState } from "react";
import { loadData, assetUrl } from "../lib/data";
import { Container, SectionHeading } from "../components/PublicLayout.jsx";

export default function Schools() {
  const [items, setItems] = useState([]);
  useEffect(() => { loadData("schools").then(setItems); }, []);
  return (
    <Container className="py-24 lg:py-32">
      <SectionHeading overline="Schools Visited" title="Classrooms we've walked into." lead="Every visit means books delivered, conversations started and futures nudged forward." />
      {items.length === 0 ? <p className="mt-16 text-lg" style={{ color: "var(--ink-soft)" }}>No school visits recorded yet.</p> : (
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(s => (
            <article key={s.id}>
              {s.image_url ? <div className="aspect-[4/3] overflow-hidden"><img src={assetUrl(s.image_url)} alt={s.name} className="w-full h-full object-contain" /></div> : <div className="aspect-[4/3]" style={{ background: "var(--surface)" }} />}
              <h3 className="font-serif-display text-2xl mt-5">{s.name}</h3>
              <div className="mt-2 flex flex-wrap gap-4 text-xs" style={{ color: "var(--ink-soft)" }}>
                <span>{s.location}</span>{s.visit_date && <span>· {s.visit_date}</span>}
              </div>
              {s.description && <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>{s.description}</p>}
            </article>
          ))}
        </div>
      )}
    </Container>
  );
}

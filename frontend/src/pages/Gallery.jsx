import { useEffect, useState } from "react";
import { api, assetUrl } from "@/lib/api";
import { Container, SectionHeading, useReveal } from "@/components/site/common";

export default function Gallery() {
  useReveal();
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/gallery").then((r) => setItems(r.data)); }, []);

  return (
    <Container className="py-24 lg:py-32">
      <SectionHeading overline="Gallery" title="Frames from the field." />
      {items.length === 0 ? (
        <p className="mt-16 text-lg" style={{ color: "var(--ink-soft)" }}>The gallery is empty — photos coming soon.</p>
      ) : (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {items.map((g) => (
            <figure key={g.id} className="reveal group" data-testid={`gallery-item-${g.id}`}>
              <div className="aspect-square overflow-hidden">
                <img src={assetUrl(g.image_url)} alt={g.caption || "Gallery"} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
              {g.caption && <figcaption className="mt-2 text-xs" style={{ color: "var(--ink-soft)" }}>{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </Container>
  );
}

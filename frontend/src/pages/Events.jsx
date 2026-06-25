import { useEffect, useState } from "react";
import { api, assetUrl } from "@/lib/api";
import { Container, SectionHeading, useReveal } from "@/components/site/common";
import { Calendar, MapPin } from "lucide-react";

export default function Events() {
  useReveal();
  const [events, setEvents] = useState([]);
  useEffect(() => { api.get("/events").then((r) => setEvents(r.data)); }, []);

  return (
    <Container className="py-24 lg:py-32">
      <SectionHeading overline="Events" title="What we've been up to, in the hills and beyond." />
      {events.length === 0 ? (
        <p className="mt-16 text-lg" style={{ color: "var(--ink-soft)" }}>No events posted yet — check back soon.</p>
      ) : (
        <div className="mt-16 space-y-px" style={{ background: "var(--line)" }}>
          {events.map((e) => (
            <article key={e.id} className="grid lg:grid-cols-12 gap-8 p-8 reveal" style={{ background: "var(--bg)" }} data-testid={`event-card-${e.id}`}>
              <div className="lg:col-span-4">
                {e.image_url ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={assetUrl(e.image_url)} alt={e.title} className="w-full h-full object-contain" />
                  </div>
                ) : <div className="aspect-[4/3]" style={{ background: "var(--surface)" }} />}
              </div>
              <div className="lg:col-span-8">
                <div className="flex flex-wrap gap-6 text-sm" style={{ color: "var(--ink-soft)" }}>
                  <span className="flex items-center gap-2"><Calendar size={14} /> {e.date}</span>
                  {e.location && <span className="flex items-center gap-2"><MapPin size={14} /> {e.location}</span>}
                </div>
                <h3 className="font-serif-display text-3xl sm:text-4xl mt-3" style={{ color: "var(--ink)" }}>{e.title}</h3>
                {e.description && <p className="mt-4 text-lg" style={{ color: "var(--ink-soft)" }}>{e.description}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </Container>
  );
}

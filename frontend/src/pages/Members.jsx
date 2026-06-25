import { useEffect, useState } from "react";
import { api, assetUrl } from "@/lib/api";
import { Container, SectionHeading, useReveal } from "@/components/site/common";
import { Mail } from "lucide-react";

export default function Members() {
  useReveal();
  const [members, setMembers] = useState([]);
  useEffect(() => { api.get("/members").then((r) => setMembers(r.data)); }, []);

  return (
    <Container className="py-24 lg:py-32">
      <SectionHeading overline="Governing Body" title="The people steering Hilltrack Society." lead="A blend of veterans, scholars, professionals and students — united by the hills they grew up in." />
      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--line)" }}>
        {members.map((m) => (
          <article key={m.id} className="p-8 reveal" style={{ background: "var(--bg)" }} data-testid={`member-card-${m.id}`}>
            {m.image_url ? (
              <div className="aspect-square overflow-hidden mb-6">
                <img src={assetUrl(m.image_url)} alt={m.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="aspect-square mb-6 flex items-center justify-center font-serif-display text-6xl" style={{ background: "var(--surface)", color: "var(--ink-soft)" }}>
                {m.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
            )}
            <div className="overline">{m.role}</div>
            <h3 className="font-serif-display text-2xl mt-2" style={{ color: "var(--ink)" }}>{m.name}</h3>
            {m.description && <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>{m.description}</p>}
            {m.email && (
              <a href={`mailto:${m.email}`} className="mt-4 inline-flex items-center gap-2 text-sm" style={{ color: "var(--accent)" }}>
                <Mail size={14} /> {m.email}
              </a>
            )}
          </article>
        ))}
      </div>
    </Container>
  );
}

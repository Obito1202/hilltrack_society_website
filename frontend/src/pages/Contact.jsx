import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Container, SectionHeading } from "@/components/site/common";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get("/settings").then((r) => setS(r.data)); }, []);

  return (
    <Container className="py-24 lg:py-32">
      <SectionHeading overline="Contact" title="Get in touch with Hilltrack Society." />
      <div className="mt-16 grid md:grid-cols-3 gap-px" style={{ background: "var(--line)" }}>
        <div className="p-10" style={{ background: "var(--bg)" }} data-testid="contact-address">
          <MapPin style={{ color: "var(--accent)" }} />
          <div className="overline mt-6">Address</div>
          <p className="mt-3 font-serif-display text-xl" style={{ color: "var(--ink)" }}>{s?.contact_address || "Joshi Niwas, Malla Krishnapur, Tallital, Nainital, Uttarakhand"}</p>
        </div>
        <div className="p-10" style={{ background: "var(--bg)" }} data-testid="contact-email">
          <Mail style={{ color: "var(--accent)" }} />
          <div className="overline mt-6">Email</div>
          {s?.contact_email ? (
            <a href={`mailto:${s.contact_email}`} className="mt-3 font-serif-display text-xl block" style={{ color: "var(--ink)" }}>{s.contact_email}</a>
          ) : <p className="mt-3 font-serif-display text-xl" style={{ color: "var(--ink)" }}>vaibhavjoshi1202@gmail.com</p>}
        </div>
        <div className="p-10" style={{ background: "var(--bg)" }} data-testid="contact-phone">
          <Phone style={{ color: "var(--accent)" }} />
          <div className="overline mt-6">Phone</div>
          <p className="mt-3 font-serif-display text-xl" style={{ color: "var(--ink)" }}>{s?.contact_phone || "Add your phone via admin"}</p>
        </div>
      </div>
    </Container>
  );
}

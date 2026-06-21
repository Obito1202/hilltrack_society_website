import { useEffect, useState } from "react";
import { loadData } from "../lib/data";
import { Container, SectionHeading } from "../components/PublicLayout.jsx";

export default function Contact() {
  const [s, setS] = useState(null);
  useEffect(() => { loadData("settings").then(setS); }, []);
  return (
    <Container className="py-24 lg:py-32">
      <SectionHeading overline="Contact" title="Get in touch with Hilltrack Society." />
      <div className="mt-16 grid md:grid-cols-3 gap-px" style={{ background: "var(--line)" }}>
        <div className="p-10" style={{ background: "var(--bg)" }}>
          <div className="overline mt-2">Address</div>
          <p className="mt-3 font-serif-display text-xl">{s?.contact_address || "Joshi Niwas, Malla Krishnapur, Tallital, Nainital, Uttarakhand"}</p>
        </div>
        <div className="p-10" style={{ background: "var(--bg)" }}>
          <div className="overline mt-2">Email</div>
          {s?.contact_email
            ? <a href={`mailto:${s.contact_email}`} className="mt-3 font-serif-display text-xl block">{s.contact_email}</a>
            : <p className="mt-3 font-serif-display text-xl">vaibhavjoshi1202@gmail.com</p>}
        </div>
        <div className="p-10" style={{ background: "var(--bg)" }}>
          <div className="overline mt-2">Phone</div>
          <p className="mt-3 font-serif-display text-xl">{s?.contact_phone || "Add your phone via the admin tool"}</p>
        </div>
      </div>
    </Container>
  );
}

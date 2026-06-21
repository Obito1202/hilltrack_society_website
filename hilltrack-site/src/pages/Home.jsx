import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadData } from "../lib/data";
import { Container, SectionHeading } from "../components/PublicLayout.jsx";

const HERO = "https://images.unsplash.com/photo-1688991057964-75b1e35211ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwzfHxuYWluaXRhbCUyMG1vdW50YWlucyUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODIwNDgyMjV8MA&ixlib=rb-4.1.0&q=85";

export default function Home() {
  const [stats, setStats] = useState({ schools: 0, events: 0, members: 0 });
  useEffect(() => {
    Promise.all([loadData("events"), loadData("schools"), loadData("members")])
      .then(([e, s, m]) => setStats({ events: e.length, schools: s.length, members: m.length }));
  }, []);
  return (
    <div>
      <section className="relative" data-testid="home-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(28,51,37,.35), rgba(28,51,37,.55)), url(${HERO}) center/cover` }} />
        <Container className="relative py-32 lg:py-48">
          <div className="max-w-3xl" style={{ color: "#F9F6F0" }}>
            <div className="overline" style={{ color: "#E8B79A" }}>Registered NGO · Nainital, Uttarakhand</div>
            <h1 className="font-serif-display mt-6 text-5xl sm:text-6xl lg:text-7xl leading-[1.02]">
              Lighting up the hills with <em className="italic">learning, energy</em> and a greener tomorrow.
            </h1>
            <p className="mt-8 text-lg max-w-2xl" style={{ color: "rgba(249,246,240,.85)" }}>
              Hilltrack Society works across the Himalayan foothills — funding scholarships, building libraries, installing solar street lights and turning agricultural waste into clean bioenergy.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/donate" className="btn-primary">Support our work →</Link>
              <Link to="/about" className="btn-outline" style={{ color: "#F9F6F0", borderColor: "#F9F6F0" }}>Read our story</Link>
            </div>
          </div>
        </Container>
      </section>
      <section className="border-b" style={{ borderColor: "var(--line)" }}>
        <Container className="py-10 grid grid-cols-3 gap-6 text-center">
          {[{k:stats.schools,l:"Schools reached"},{k:stats.events,l:"Events organised"},{k:stats.members+"+",l:"Governing members"}].map((s,i)=>(
            <div key={i}><div className="font-serif-display text-5xl sm:text-6xl">{s.k}</div><div className="overline mt-2">{s.l}</div></div>
          ))}
        </Container>
      </section>
      <section>
        <Container className="py-24 lg:py-32">
          <SectionHeading overline="Three pillars" title="Education, environment and clean energy — woven into one mission." lead="From scholarships in rural government schools to solar street lights in remote villages and biogas research labs, our work is rooted in the soil of the hills we call home." />
          <div className="mt-12"><Link to="/about" className="btn-outline">Read our objectives →</Link></div>
        </Container>
      </section>
      <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
        <Container className="py-20 flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
          <div><div className="overline" style={{ color: "#E8B79A" }}>Join the journey</div><h2 className="font-serif-display text-4xl sm:text-5xl mt-4">A small donation. A long climb. A whole village lit.</h2></div>
          <Link to="/donate" className="btn-primary shrink-0">Donate now →</Link>
        </Container>
      </section>
    </div>
  );
}

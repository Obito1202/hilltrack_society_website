import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Container, SectionHeading, useReveal } from "@/components/site/common";
import { ArrowUpRight, Leaf, BookOpen, Sun } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1688991057964-75b1e35211ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwzfHxuYWluaXRhbCUyMG1vdW50YWlucyUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3ODIwNDgyMjV8MA&ixlib=rb-4.1.0&q=85";
const EDU_IMG = "https://images.pexels.com/photos/15119089/pexels-photo-15119089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const ENERGY_IMG = "https://images.unsplash.com/photo-1749192901190-ea45a711b0e3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMHJ1cmFsJTIwbmF0dXJlfGVufDB8fHx8MTc4MjA0ODIyNXww&ixlib=rb-4.1.0&q=85";

export default function Home() {
  useReveal();
  const [stats, setStats] = useState({ events: 0, schools: 0, members: 0 });

  useEffect(() => {
    Promise.all([api.get("/events"), api.get("/schools"), api.get("/members")])
      .then(([e, s, m]) => setStats({ events: e.data.length, schools: s.data.length, members: m.data.length }))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative" data-testid="home-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(28,51,37,0.35), rgba(28,51,37,0.55)), url(${HERO_IMG}) center/contain` }} />
        <Container className="relative py-32 lg:py-48">
          <div className="max-w-3xl text-[#F9F6F0]">
            <div className="overline" style={{ color: "#E8B79A" }}>Registered NGO · Nainital, Uttarakhand</div>
            <h1 className="font-serif-display mt-6 text-5xl sm:text-6xl lg:text-7xl leading-[1.02]">
              Lighting up the hills with <em className="italic">learning, energy</em> and a greener tomorrow.
            </h1>
            <p className="mt-8 text-lg max-w-2xl" style={{ color: "rgba(249,246,240,0.85)" }}>
              Hilltrack Society works across the Himalayan foothills — funding scholarships, building libraries, installing solar street lights, and turning agricultural waste into clean bioenergy.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/donate" className="btn-primary" data-testid="hero-donate-btn">Support our work <ArrowUpRight size={16} /></Link>
              <Link to="/about" className="btn-outline" style={{ color: "#F9F6F0", borderColor: "#F9F6F0" }} data-testid="hero-about-btn">Read our story</Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats strip */}
      <section className="border-b" style={{ borderColor: "var(--line)" }}>
        <Container className="py-10 grid grid-cols-3 gap-6 text-center">
          {[
            { k: stats.schools, label: "Schools reached" },
            { k: stats.events, label: "Events organised" },
            { k: stats.members + "+", label: "Governing members" },
          ].map((s, i) => (
            <div key={i} className="reveal">
              <div className="font-serif-display text-5xl sm:text-6xl" style={{ color: "var(--ink)" }}>{s.k}</div>
              <div className="overline mt-2">{s.label}</div>
            </div>
          ))}
        </Container>
      </section>

      {/* Three pillars */}
      <section>
        <Container className="py-24 lg:py-32">
          <SectionHeading
            overline="Three pillars"
            title="Education, environment and clean energy — woven into one mission."
            lead="From scholarships in rural government schools to solar street lights in remote villages and biogas research labs, our work is rooted in the soil of the hills we call home."
          />

          <div className="mt-16 grid lg:grid-cols-12 gap-8 lg:gap-12">
            <article className="lg:col-span-7 reveal">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={EDU_IMG} alt="Education impact" className="w-full h-full object-contain" />
              </div>
              <div className="mt-6 flex items-start gap-4">
                <BookOpen size={20} style={{ color: "var(--accent)" }} className="mt-1" />
                <div>
                  <h3 className="font-serif-display text-3xl" style={{ color: "var(--ink)" }}>Education that travels uphill</h3>
                  <p className="mt-3" style={{ color: "var(--ink-soft)" }}>Books, stationery, scholarships, career counselling and small libraries — placed exactly where they unlock the most.</p>
                </div>
              </div>
            </article>
            <article className="lg:col-span-5 reveal">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={ENERGY_IMG} alt="Solar energy in rural India" className="w-full h-full object-contain" />
              </div>
              <div className="mt-6 flex items-start gap-4">
                <Sun size={20} style={{ color: "var(--accent)" }} className="mt-1" />
                <div>
                  <h3 className="font-serif-display text-3xl" style={{ color: "var(--ink)" }}>Solar after sunset</h3>
                  <p className="mt-3" style={{ color: "var(--ink-soft)" }}>Solar-powered street lighting designed for villages that the grid forgets — safer evenings, longer study hours.</p>
                </div>
              </div>
            </article>
            <article className="lg:col-span-12 reveal grid md:grid-cols-12 gap-8 items-center border-t pt-10" style={{ borderColor: "var(--line)" }}>
              <Leaf size={22} style={{ color: "var(--accent)" }} className="md:col-span-1" />
              <div className="md:col-span-7">
                <h3 className="font-serif-display text-3xl" style={{ color: "var(--ink)" }}>From farm waste to fuel</h3>
                <p className="mt-3" style={{ color: "var(--ink-soft)" }}>Research and pilot projects that convert agricultural residue, organic waste and bio-waste into biogas and biofuel — clean kitchens, cleaner air.</p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <Link to="/about" className="btn-outline" data-testid="pillars-readmore-btn">Read our objectives <ArrowUpRight size={16} /></Link>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section style={{ background: "var(--ink)", color: "var(--bg)" }}>
        <Container className="py-20 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="overline" style={{ color: "#E8B79A" }}>Join the journey</div>
            <h2 className="font-serif-display text-4xl sm:text-5xl mt-4">A small donation. A long climb. A whole village lit.</h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link to="/donate" className="btn-primary" data-testid="cta-band-donate">Donate now <ArrowUpRight size={16} /></Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

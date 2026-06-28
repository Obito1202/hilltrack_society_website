import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadData } from "../lib/data";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/members", label: "Governing Body" },
  { to: "/events", label: "Events" },
  { to: "/initiatives", label: "Initiatives" },
  { to: "/achievements", label: "Achievements" },
  { to: "/schools", label: "Schools" },
  { to: "/gallery", label: "Gallery" },
  { to: "/books", label: "Books" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); setMenuOpen(false); }, [loc.pathname]);
  useEffect(() => { loadData("settings").then(setSettings); }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="border-b sticky top-0 z-40" style={{ borderColor: "var(--line)", background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="w-9 h-9 flex items-center justify-center font-serif-display" style={{ background: "var(--ink)", color: "var(--bg)" }}>H</span>
            <div className="leading-tight">
              <div className="font-serif-display text-xl">Hilltrack Society</div>
              <div className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "var(--ink-soft)" }}>Education · Environment · Energy</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) => `nav-link text-sm ${isActive ? "active" : ""}`}
                style={{ color: "var(--ink)" }}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/donate" className="btn-primary text-sm hidden sm:inline-flex">Donate</Link>
            {/* Hamburger button */}
            <button
              className="lg:hidden p-2 -mr-2"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <line x1="3" y1="3" x2="19" y2="19" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="19" y1="3" x2="3" y2="19" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <line x1="3" y1="5" x2="19" y2="5" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="11" x2="19" y2="11" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="17" x2="19" y2="17" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="lg:hidden border-t" style={{ borderColor: "var(--line)", background: "var(--bg)" }}>
            <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col">
              {NAV.map(n => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  onClick={() => setMenuOpen(false)}
                  className="py-3.5 border-b text-sm font-medium"
                  style={({ isActive }) => ({
                    borderColor: "var(--line)",
                    color: isActive ? "var(--accent)" : "var(--ink)",
                  })}
                >
                  {n.label}
                </NavLink>
              ))}
              <Link
                to="/donate"
                className="btn-primary text-sm mt-5 mb-4 self-start"
                onClick={() => setMenuOpen(false)}
              >
                Donate
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mt-24 border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid md:grid-cols-3 gap-10">
          <div>
            <div className="font-serif-display text-2xl">Hilltrack Society for Education, Environment and Energy</div>
            <p className="mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
              Empowering Himalayan communities through education, sustainable energy, and environmental stewardship.
            </p>
          </div>
          <div>
            <div className="overline">Registered Office</div>
            <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>
              {settings?.contact_address || "Joshi Niwas, Malla Krishnapur, Tallital, Nainital, Uttarakhand"}
            </p>
            {settings?.contact_phone && (
              <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>{settings.contact_phone}</p>
            )}
          </div>
          <div>
            <div className="overline">Get Involved</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/donate" style={{ color: "var(--ink)" }}>Donate</Link></li>
              <li><Link to="/contact" style={{ color: "var(--ink)" }}>Volunteer</Link></li>
              {settings?.contact_email && (
                <li>
                  <a href={`mailto:${settings.contact_email}`} style={{ color: "var(--ink-soft)" }}>
                    {settings.contact_email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 text-xs" style={{ color: "var(--ink-soft)" }}>
            © {new Date().getFullYear()} Hilltrack Society. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Container({ children, className = "" }) {
  return <div className={`max-w-7xl mx-auto px-6 lg:px-12 ${className}`}>{children}</div>;
}

export function SectionHeading({ overline, title, lead }) {
  return (
    <div className="max-w-3xl">
      {overline && <div className="overline mb-4">{overline}</div>}
      <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05]">{title}</h2>
      {lead && <p className="mt-6 text-lg" style={{ color: "var(--ink-soft)" }}>{lead}</p>}
    </div>
  );
}

import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Mountain } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/members", label: "Governing Body" },
  { to: "/events", label: "Events" },
  { to: "/achievements", label: "Achievements" },
  { to: "/schools", label: "Schools" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="brand-link">
            <span className="w-9 h-9 flex items-center justify-center" style={{ background: "var(--ink)", color: "var(--bg)" }}>
              <Mountain size={18} />
            </span>
            <div className="leading-tight">
              <div className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>Hilltrack Society</div>
              <div className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "var(--ink-soft)" }}>Education · Environment · Energy</div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) => `nav-link text-sm ${isActive ? "active" : ""}`}
                style={{ color: "var(--ink)" }}
                data-testid={`nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/donate" className="btn-primary text-sm" data-testid="donate-cta-header">Donate</Link>
        </div>
        {/* Mobile nav */}
        <div className="lg:hidden border-t overflow-x-auto" style={{ borderColor: "var(--line)" }}>
          <div className="px-6 py-3 flex gap-5 whitespace-nowrap">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"} className="text-xs uppercase tracking-widest" style={{ color: "var(--ink-soft)" }}>{n.label}</NavLink>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 grid md:grid-cols-3 gap-10">
          <div>
            <div className="font-serif-display text-2xl" style={{ color: "var(--ink)" }}>Hilltrack Society for Education, Environment and Energy</div>
            <p className="mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
              A registered NGO empowering Himalayan communities through education, sustainable energy, and environmental stewardship.
            </p>
          </div>
          <div>
            <div className="overline">Registered Office</div>
            <p className="mt-3 text-sm" style={{ color: "var(--ink-soft)" }}>
              Joshi Niwas, Malla Krishnapur,<br/>Tallital, Nainital,<br/>Uttarakhand, India
            </p>
          </div>
          <div>
            <div className="overline">Get Involved</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/donate" style={{ color: "var(--ink)" }}>Donate</Link></li>
              <li><Link to="/contact" style={{ color: "var(--ink)" }}>Volunteer</Link></li>
              <li><Link to="/admin/login" style={{ color: "var(--ink-soft)" }} data-testid="admin-login-link">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs" style={{ color: "var(--ink-soft)" }}>
            <div>© {new Date().getFullYear()} Hilltrack Society. All rights reserved.</div>
            <div>Made with care in the hills of Uttarakhand</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function SectionHeading({ overline, title, lead }) {
  return (
    <div className="max-w-3xl reveal">
      {overline && <div className="overline mb-4">{overline}</div>}
      <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05]" style={{ color: "var(--ink)" }}>{title}</h2>
      {lead && <p className="mt-6 text-lg" style={{ color: "var(--ink-soft)" }}>{lead}</p>}
    </div>
  );
}

export function Container({ children, className = "" }) {
  return <div className={`max-w-7xl mx-auto px-6 lg:px-12 ${className}`}>{children}</div>;
}

"use client";

import { useEffect } from "react";

type SectionLink = {
  id: string;
  label: string;
  sectionTitle?: string;
};

export function ProjectSectionNavigation({ sections }: { sections: SectionLink[] }) {
  useEffect(() => {
    sections.forEach(({ id, sectionTitle }) => {
      if (document.getElementById(id) || !sectionTitle) return;

      const section = Array.from(document.querySelectorAll("section")).find((element) =>
        element.textContent?.includes(sectionTitle),
      );
      if (section) section.id = id;
    });
  }, [sections]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return <nav aria-label="On this page" className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12"><div className="flex gap-2 overflow-x-auto border-y border-white/10 py-3 [scrollbar-width:none]"><span className="shrink-0 py-1 pr-1 font-mono text-[10px] uppercase tracking-[.12em] text-slate-600">On this page</span>{sections.map((section) => <button key={section.id} type="button" onClick={() => scrollToSection(section.id)} className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:border-cyan-300/40 hover:text-cyan-100">{section.label}</button>)}</div></nav>;
}

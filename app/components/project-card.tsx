import Link from "next/link";
import { ArrowUpRight } from "./icons";
import type { Project } from "../lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="project-card group">
      <div className={`project-art ${project.artClass}`}><span>{project.artLabel}</span><i /><i /><i /></div>
      <div className="flex items-start justify-between gap-5 p-6 sm:p-7">
        <div>
          <p className="font-mono text-xs text-cyan-300">{project.number}</p>
          <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-white">{project.title}</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{project.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2">{project.tags.map((tag) => <li key={tag} className="tag">{tag}</li>)}</ul>
        </div>
        <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-slate-300 transition group-hover:border-cyan-300/70 group-hover:bg-cyan-300 group-hover:text-slate-950"><ArrowUpRight /></span>
      </div>
    </Link>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "../../components/icons";
import { getProject, projects } from "../../lib/projects";

export function generateStaticParams() {
  return projects.filter(({ slug }) => slug !== "customer-data-cleaning" && slug !== "marketing-campaign-analysis" && slug !== "document-processing").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return { title: project ? `${project.title} — LU.AI` : "Project — LU.AI" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const sections = [
    ["Problem", project.problem], ["Approach", project.approach], ["Result", project.result], ["AI Usage", project.aiUsage],
  ];
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between" aria-label="Project navigation">
        <Link href="/" className="font-mono text-sm font-medium text-white">LU.<span className="text-cyan-300">AI</span></Link>
        <Link href="/#projects" className="text-sm text-slate-300 transition hover:text-cyan-200">← All projects</Link>
      </nav>
      <article className="mx-auto max-w-6xl pb-16 pt-20 sm:pt-28">
        <p className="eyebrow">Case study · {project.number}</p>
        <h1 className="mt-7 max-w-4xl text-5xl font-medium tracking-[-0.065em] text-white sm:text-7xl">{project.title}</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">{project.summary}</p>
        <div className={`project-art ${project.artClass} mt-14 h-64 rounded-2xl sm:h-96`}><span>{project.artLabel}</span><i /><i /><i /></div>
        <div className="mt-16 grid gap-x-20 gap-y-14 lg:grid-cols-[1.5fr_.75fr]">
          <div className="space-y-14">
            {sections.map(([title, content]) => <section key={title} className="border-t border-white/10 pt-5"><h2 className="text-xl font-medium text-white">{title}</h2><p className="mt-4 max-w-2xl leading-7 text-slate-400">{content}</p></section>)}
            <section className="border-t border-white/10 pt-5"><h2 className="text-xl font-medium text-white">Demo</h2><p className="mt-4 leading-7 text-slate-400">A project demo and supporting materials will be added as this case study develops.</p></section>
          </div>
          <aside className="panel h-fit p-7"><p className="font-mono text-xs text-cyan-300">TECHNOLOGIES</p><ul className="mt-6 space-y-3 text-sm text-slate-300">{project.technologies.map((item) => <li key={item}>— {item}</li>)}</ul><Link href="/#contact" className="mt-10 inline-flex items-center gap-2 text-sm text-cyan-200 transition hover:text-white">Discuss this work <ArrowUpRight /></Link></aside>
        </div>
      </article>
    </main>
  );
}

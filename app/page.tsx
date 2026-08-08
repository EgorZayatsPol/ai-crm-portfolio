import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "./components/icons";
import { ProjectCard } from "./components/project-card";
import { projects } from "./lib/projects";

const workflow = [
  "Problem",
  "Research",
  "AI-assisted solution design",
  "Implementation",
  "Testing",
  "Validation",
  "Improvement",
];

const skills = [
  { title: "AI & LLM", items: ["LLM APIs", "Prompt Engineering", "AI Agents", "AI-assisted Development"] },
  { title: "Development", items: ["Python", "JavaScript / TypeScript", "Next.js", "APIs"] },
  { title: "Data", items: ["Data Cleaning", "Data Processing", "SQL", "Web Scraping", "Document Processing"] },
];

export default function Home() {
  return (
    <main>
      <section className="hero-shell grid-lines px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-6xl items-center justify-between" aria-label="Main navigation">
          <Link href="/" className="font-mono text-sm font-medium tracking-[-0.04em] text-white">
            LU.<span className="text-cyan-300">AI</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
            <a className="nav-link" href="#projects">Projects</a>
            <a className="nav-link" href="#approach">Approach</a>
            <a className="nav-link" href="#skills">Skills</a>
          </div>
          <a className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-cyan-300/60 hover:text-cyan-200" href="#contact">
            Get in touch
          </a>
        </nav>

        <div className="mx-auto flex min-h-[650px] max-w-6xl flex-col justify-center py-24 sm:py-32">
          <p className="eyebrow mb-7"><span className="status-dot" />AI-focused developer &amp; problem solver</p>
          <h1 className="max-w-4xl text-5xl font-medium tracking-[-0.065em] text-white sm:text-7xl lg:text-8xl">
            Building practical solutions with <span className="text-gradient">AI, automation</span> and code.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            I turn complex, manual workflows into considered software solutions—combining Python, data processing, APIs and AI-assisted development.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#projects" className="button-primary">View projects <ArrowUpRight /></a>
            <a href="#contact" className="button-secondary">Contact</a>
          </div>
        </div>
        <a href="#projects" className="mx-auto flex max-w-6xl items-center gap-2 text-xs text-slate-400 transition hover:text-white">
          Explore selected work <ChevronDown />
        </a>
      </section>

      <section id="projects" className="section-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="section-heading">
            <p className="eyebrow">Selected projects</p>
            <h2>Applied AI work,<br /><span className="text-slate-400">built to solve real problems.</span></h2>
            <p>Four focused case studies exploring data quality, language intelligence, document automation and agentic workflows.</p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </div>
      </section>

      <section id="approach" className="border-y border-white/8 bg-[#0c1220] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow">Approach</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.055em] text-white sm:text-5xl">AI is part of the process—<span className="text-slate-400">not a substitute for engineering.</span></h2>
          </div>
          <div>
            <p className="max-w-xl text-lg leading-8 text-slate-300">I use AI as a development and problem-solving partner: to explore options, accelerate iteration and help turn an unclear problem into a robust, testable solution.</p>
            <ol className="mt-10 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {workflow.map((step, index) => (
                <li key={step} className="flex items-center gap-4 border-t border-white/10 pt-4 text-sm text-slate-200">
                  <span className="font-mono text-xs text-cyan-300">0{index + 1}</span>{step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="skills" className="section-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="section-heading">
            <p className="eyebrow">Capabilities</p>
            <h2>Tools for turning ideas<br /><span className="text-slate-400">into working systems.</span></h2>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {skills.map((category, index) => (
              <article key={category.title} className="panel p-7 sm:p-8">
                <span className="font-mono text-xs text-cyan-300">0{index + 1}</span>
                <h3 className="mt-9 text-xl font-medium tracking-[-0.03em] text-white">{category.title}</h3>
                <ul className="mt-7 space-y-3 text-sm text-slate-400">
                  {category.items.map((item) => <li key={item}>— {item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 pb-5 sm:px-8 lg:px-12">
        <div className="contact-panel mx-auto max-w-6xl px-7 py-16 sm:px-12 sm:py-20">
          <p className="eyebrow">Contact</p>
          <div className="mt-6 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <h2 className="max-w-2xl text-4xl font-medium tracking-[-0.055em] text-white sm:text-6xl">Let&apos;s build something useful.</h2>
              <p className="mt-5 max-w-xl leading-7 text-slate-300">I&apos;m open to opportunities involving AI, automation, data processing, AI agents and software development.</p>
              <div className="mt-8"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-slate-500">Interested in</p><ul className="mt-3 flex max-w-2xl flex-wrap gap-2">{["AI Development", "AI Agents", "Automation", "Python", "Data Processing", "LLM Applications"].map((item) => <li key={item} className="tag">{item}</li>)}</ul></div>
            </div>
            <a href="mailto:yahorzayats@gmail.com" className="button-primary shrink-0">Get in touch <ArrowUpRight /></a>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-2">
            <a href="mailto:yahorzayats@gmail.com" className="panel group rounded-xl p-5 transition hover:border-cyan-300/40 hover:bg-white/[.04]"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-cyan-300">Email</p><p className="mt-4 flex items-center justify-between gap-3 text-sm text-white sm:text-base">yahorzayats@gmail.com <span className="text-slate-500 transition group-hover:text-cyan-200"><ArrowUpRight /></span></p></a>
            <a href="https://github.com/EgorZayatsPol" target="_blank" rel="noopener noreferrer" className="panel group rounded-xl p-5 transition hover:border-cyan-300/40 hover:bg-white/[.04]"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-cyan-300">GitHub</p><p className="mt-4 flex items-center justify-between gap-3 text-sm text-white sm:text-base">GitHub / EgorZayatsPol <span className="text-slate-500 transition group-hover:text-cyan-200"><ArrowUpRight /></span></p></a>
          </div>
        </div>
      </section>
      <footer className="px-5 py-7 text-center font-mono text-[11px] text-slate-600">© {new Date().getFullYear()} · Built with curiosity and code</footer>
    </main>
  );
}

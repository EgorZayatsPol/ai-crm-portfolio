import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "../../components/icons";
import { CodeExamples, type CodeExample } from "../../components/how-it-works";

export const metadata: Metadata = {
  title: "AI-assisted Marketing Campaign Analysis — LU.AI",
  description: "An illustrative Python workflow for comparing campaign performance and producing data-informed recommendations.",
};

const metrics = [
  ["12", "Illustrative campaigns compared"],
  ["3", "Performance patterns surfaced"],
  ["2", "Spend anomalies flagged for review"],
  ["4", "Recommendation areas produced"],
];

const workflow = [
  ["01", "Prepare data", "Bring campaign exports into one analysis-ready table and standardize key dimensions such as channel, period and objective."],
  ["02", "Compare performance", "Calculate and compare metrics including spend, reach, clicks, conversions, CTR, CPC and conversion rate."],
  ["03", "Investigate patterns", "Look for changes in performance, outliers and channel-level trade-offs worth validating with a marketing owner."],
  ["04", "Recommend next actions", "Turn validated findings into specific tests, budget-review questions and campaign optimization ideas."],
];

const campaignRows = [
  ["Search · Brand", "€3,480", "6.2%", "€0.58", "9.4%", "Stable / efficient"],
  ["Paid Social · Prospecting", "€5,120", "1.8%", "€1.14", "3.1%", "Review creative"],
  ["Email · Re-engagement", "€740", "4.7%", "€0.18", "11.2%", "Scale carefully"],
];

const codeExamples: CodeExample[] = [
  { number: "01", title: "Calculate campaign efficiency", tool: "Python / Pandas", source: "metrics.py", summary: "Calculates click-through rate and cost per acquisition from campaign-level spend, click and conversion columns.", snippet: `campaigns["ctr"] = (campaigns["clicks"] / campaigns["impressions"]) * 100
campaigns["cpa"] = campaigns["spend"] / campaigns["conversions"].replace(0, pd.NA)

campaigns[["campaign", "ctr", "cpa"]].round(2)` },
  { number: "02", title: "Compare channel performance", tool: "Python / Pandas", source: "analysis.py", summary: "Groups campaign data by channel to compare total spend, conversions and average efficiency in one view.", snippet: `channel_summary = campaigns.groupby("channel").agg(
    spend=("spend", "sum"),
    conversions=("conversions", "sum"),
    avg_ctr=("ctr", "mean"),
)

channel_summary["cpa"] = channel_summary["spend"] / channel_summary["conversions"]
channel_summary.sort_values("cpa")` },
  { number: "03", title: "Flag campaigns for review", tool: "Python / Pandas", source: "analysis.py", summary: "Identifies campaigns with high acquisition cost or unusually weak click-through rate so they can be reviewed by a marketer.", snippet: `median_cpa = campaigns["cpa"].median()
review_queue = campaigns[
    (campaigns["cpa"] > median_cpa * 1.25)
    | (campaigns["ctr"] < 1.5)
]

review_queue[["campaign", "cpa", "ctr", "spend"]]` },
];

export default function MarketingCampaignAnalysisPage() {
  return <main className="min-h-screen overflow-hidden">
    <section className="hero-shell grid-lines px-5 pb-20 pt-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between" aria-label="Project navigation"><Link href="/" className="font-mono text-sm font-medium text-white">LU.<span className="text-cyan-300">AI</span></Link><Link href="/#projects" className="text-sm text-slate-300 transition hover:text-cyan-200">← Back to projects</Link></nav>
      <div className="mx-auto max-w-6xl pb-8 pt-24 sm:pt-32">
        <p className="eyebrow"><span className="status-dot" />Illustrative case study</p>
        <h1 className="mt-7 max-w-5xl text-5xl font-medium tracking-[-.065em] text-white sm:text-7xl">Marketing Campaign <span className="text-gradient">Analysis</span></h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">An AI-assisted workflow for analyzing marketing campaign data, identifying performance patterns, comparing campaigns and generating data-driven recommendations.</p>
        <div className="mt-9 flex flex-wrap gap-2">{["Python", "Data Analysis", "Marketing Analytics", "AI-assisted Analysis"].map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
        <a href="#analysis" className="button-primary mt-10">Explore the workflow <ArrowUpRight /></a>
        <div className="project-art art-message mt-16 h-56 rounded-2xl sm:h-80"><span>CAMPAIGN / ANALYSIS 02</span><i /><i /><i /></div>
      </div>
    </section>

    <article className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-6xl space-y-28">
      <section className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Overview</p><h2 className="mt-5 text-4xl font-medium tracking-[-.055em] text-white sm:text-5xl">From campaign exports<br /><span className="text-slate-400">to clearer decisions.</span></h2></div><div className="max-w-2xl space-y-5 text-base leading-8 text-slate-300"><p>This illustrative case study models a workflow for examining campaign data across channels and objectives. It brings performance into one view so a marketing team can compare what is working, where efficiency is changing and which findings need closer review.</p><p>No external company data is used. The metrics shown on this page are realistic but illustrative examples designed to demonstrate how a repeatable analysis can support—not replace—marketing judgment.</p></div></section>

      <section><div className="flex items-end justify-between gap-6"><div><p className="eyebrow">Illustrative analysis</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Signals worth investigating.</h2></div><p className="hidden max-w-xs text-right text-sm leading-6 text-slate-500 sm:block">Example outputs from a simulated campaign review.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([value, label]) => <div key={label} className="panel rounded-xl p-6"><p className="text-4xl font-medium tracking-[-.06em] text-white">{value}</p><p className="mt-3 text-sm leading-5 text-slate-400">{label}</p></div>)}</div></section>

      <section id="analysis"><p className="eyebrow">Approach / workflow</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">A repeatable route from data to action.</h2><div className="mt-10 grid gap-3 md:grid-cols-4">{workflow.map(([number, title, description], index) => <article key={title} className="panel relative rounded-xl p-5"><span className="font-mono text-xs text-cyan-300">{number}</span>{index < workflow.length - 1 && <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#0d1421] text-slate-500 md:grid">→</span>}<h3 className="mt-7 text-lg font-medium text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p></article>)}</div></section>

      <section className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">Data analysis</p><h2 className="mt-5 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Compare the metrics<br /><span className="text-slate-400">in context.</span></h2><p className="mt-5 max-w-md leading-7 text-slate-400">The workflow uses Python and Pandas concepts to aggregate campaign performance, calculate efficiency metrics and keep comparisons grounded in the same reporting period.</p></div><div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0c1220]"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[.1em] text-slate-500"><tr>{["Campaign", "Spend", "CTR", "CPC", "Conv. rate", "Review"].map((heading) => <th key={heading} className="px-5 py-4 font-medium">{heading}</th>)}</tr></thead><tbody>{campaignRows.map((row) => <tr key={row[0]} className="border-b border-white/[.06] last:border-0"><td className="px-5 py-4 font-medium text-white">{row[0]}</td>{row.slice(1, -1).map((cell) => <td key={cell} className="px-5 py-4 text-slate-400">{cell}</td>)}<td className="px-5 py-4 text-cyan-200">{row[5]}</td></tr>)}</tbody></table><p className="border-t border-white/[.06] px-5 py-4 text-xs leading-5 text-slate-500">Illustrative data only — this table demonstrates the type of comparison the workflow supports.</p></div></section>

      <section className="grid gap-10 lg:grid-cols-2"><div><p className="eyebrow">Problem</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Campaign data is easy to collect, harder to interpret.</h2><p className="mt-5 leading-7 text-slate-400">Performance is often spread across platforms, periods and reporting formats. A headline metric can look strong in isolation while hiding a weak conversion rate, rising acquisition cost or a change in audience quality.</p></div><div><p className="eyebrow">Results / insights</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Findings become reviewable next steps.</h2><ul className="mt-5 space-y-4 text-sm leading-6 text-slate-400"><li><span className="mr-3 font-mono text-cyan-300">01</span>Compare efficient campaigns before moving incremental budget.</li><li><span className="mr-3 font-mono text-cyan-300">02</span>Investigate outliers such as high spend with declining conversion quality.</li><li><span className="mr-3 font-mono text-cyan-300">03</span>Separate channel performance from creative, audience and landing-page hypotheses.</li><li><span className="mr-3 font-mono text-cyan-300">04</span>Convert observations into small, measurable follow-up tests.</li></ul></div></section>

      <CodeExamples examples={codeExamples} />

      <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[.06] p-7 sm:p-10"><div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]"><div><p className="eyebrow">How AI was used</p><h2 className="mt-5 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">An analytical assistant,<br /><span className="text-slate-400">not the decision-maker.</span></h2></div><div><p className="leading-7 text-slate-300">AI supported the development and analysis workflow: it helped write and improve Python/Pandas analysis code, explore the dataset and identify useful metrics, suggest patterns or anomalies worth investigating, formulate hypotheses and recommendations, and assist with interpreting results.</p><p className="mt-5 leading-7 text-slate-300">AI did not make final business decisions. The analysis, hypotheses and conclusions were checked and validated by a human before they were treated as recommendations.</p><div className="mt-7 flex flex-wrap gap-2">{["Code assistance", "Metric exploration", "Pattern investigation", "Hypothesis building", "Human validation"].map((item) => <span key={item} className="rounded-full border border-cyan-300/20 bg-[#080b12]/40 px-3 py-2 font-mono text-[10px] text-cyan-100">{item}</span>)}</div></div></div></section>

      <section className="grid gap-10 border-t border-white/10 pt-16 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Conclusion</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Make analysis easier to act on.</h2></div><p className="max-w-2xl leading-8 text-slate-400">This project demonstrates a practical approach to campaign analysis: consolidate the data, compare performance fairly, flag questions that deserve investigation and turn evidence into testable recommendations. It is designed to support experienced marketing decision-making, not automate it.</p></section>
      <footer className="flex flex-col justify-between gap-5 border-t border-white/10 pt-10 text-sm sm:flex-row sm:items-center"><Link href="/#projects" className="text-slate-400 transition hover:text-cyan-200">← Back to Projects</Link><Link href="/projects/document-processing" className="text-cyan-200 transition hover:text-white">Next: Document Processing →</Link></footer>
    </div></article>
  </main>;
}

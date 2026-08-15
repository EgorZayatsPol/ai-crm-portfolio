import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "../../components/icons";
import { CodeExamples, type CodeExample } from "../../components/how-it-works";
import { ProjectSectionNavigation } from "../../components/project-section-navigation";

export const metadata: Metadata = {
  title: "AI-assisted Document Processing — LU.AI",
  description: "An illustrative workflow for turning digital documents into structured, reviewable information.",
};

const metrics = [
  ["24", "Illustrative documents reviewed"],
  ["4", "Document types represented"],
  ["8", "Structured fields extracted"],
  ["3", "Review flags surfaced"],
];

const workflow = [
  ["01", "Receive document", "Start with a digital PDF, scan or text-based document and retain the source as the reference record."],
  ["02", "Extract text", "Use direct text extraction where available, or OCR to make scanned content searchable and ready for review."],
  ["03", "Structure information", "Identify important fields, normalize values and organize unstructured content into a consistent record shape."],
  ["04", "Review the result", "Flag uncertain or inconsistent fields so a person can verify them before the information is treated as final."],
];

const extractedFields = [
  ["Document type", "Supplier invoice"],
  ["Reference", "INV-2025-0418"],
  ["Issue date", "2025-04-18"],
  ["Amount", "€2,840.00"],
  ["Currency", "EUR"],
  ["Supplier", "Northline Materials"],
  ["Payment terms", "Net 30"],
  ["Review status", "Check tax ID"],
];

const codeExamples: CodeExample[] = [
  { number: "01", title: "Extract document text", tool: "Python / PyMuPDF", source: "extract.py", summary: "Reads each PDF page and joins the extracted text into one string ready for downstream processing.", snippet: `import fitz

document = fitz.open(pdf_path)
text = "\n".join(page.get_text() for page in document)

if not text.strip():
    raise ValueError("No text extracted; OCR may be required.")` },
  { number: "02", title: "Structure key fields", tool: "Python / regex", source: "structure.py", summary: "Maps values from extracted text into a predictable record shape that can be validated and stored consistently.", snippet: `invoice = {
    "reference": find_value(text, r"Invoice\s+#?([A-Z0-9-]+)"),
    "issue_date": find_value(text, r"Date:\s*(\d{4}-\d{2}-\d{2})"),
    "amount": find_value(text, r"Total:\s*€?([\d,.]+)"),
}

invoice = {key: value.strip() if value else None for key, value in invoice.items()}` },
  { number: "03", title: "Assist classification and review", tool: "Python / AI-assisted processing", source: "classify.py", summary: "Uses an AI-assisted classification step to suggest a document type and summary, then sends the result to human review before final use.", snippet: `analysis = classify_document(text)
record = {
    **invoice,
    "document_type": analysis["document_type"],
    "summary": analysis["summary"],
    "review_required": True,
}

save_for_review(record)` },
];

export default function DocumentProcessingPage() {
  return <main className="min-h-screen overflow-hidden">
    <section className="hero-shell grid-lines px-5 pb-20 pt-6 sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between" aria-label="Project navigation"><Link href="/" className="font-mono text-sm font-medium text-white">LU.<span className="text-cyan-300">AI</span></Link><Link href="/#projects" className="text-sm text-slate-300 transition hover:text-cyan-200">← Back to projects</Link></nav>
      <div className="mx-auto max-w-6xl pb-8 pt-24 sm:pt-32">
        <p className="eyebrow"><span className="status-dot" />Illustrative case study</p>
        <h1 className="mt-7 max-w-5xl text-5xl font-medium tracking-[-.065em] text-white sm:text-7xl">Document <span className="text-gradient">Processing</span></h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">An AI-assisted workflow for extracting, structuring and analyzing useful information from digital documents.</p>
        <div className="mt-9 flex flex-wrap gap-2">{["Python", "PDF", "OCR", "AI-assisted Processing"].map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
        <a href="#processing" className="button-primary mt-10">Explore the workflow <ArrowUpRight /></a>
        <div className="project-art art-document mt-16 h-56 rounded-2xl sm:h-80"><span>DOCUMENT / EXTRACT 03</span><i /><i /><i /></div>
      </div>
    </section>

    <ProjectSectionNavigation sections={[{ id: "overview", label: "Overview", sectionTitle: "Overview" }, { id: "processing", label: "Workflow" }, { id: "document-processing", label: "Processing", sectionTitle: "Document processing" }, { id: "results", label: "Results", sectionTitle: "Results" }, { id: "code-examples", label: "Code Examples" }, { id: "how-ai-was-used", label: "How AI Was Used", sectionTitle: "How AI was used" }, { id: "conclusion", label: "Conclusion", sectionTitle: "Conclusion" }]} />

    <article className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-6xl space-y-28">
      <section className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Overview</p><h2 className="mt-5 text-4xl font-medium tracking-[-.055em] text-white sm:text-5xl">From document files<br /><span className="text-slate-400">to usable information.</span></h2></div><div className="max-w-2xl space-y-5 text-base leading-8 text-slate-300"><p>This illustrative case study models how digital documents can move through a clear processing path: PDF or document input, text extraction or OCR, AI-assisted structuring, and a final reviewable result.</p><p>No real or confidential documents are used. Examples and extracted fields are realistic but illustrative, designed to show how unstructured information can become easier to search, validate and reuse.</p></div></section>

      <section><div className="flex items-end justify-between gap-6"><div><p className="eyebrow">Illustrative processing</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Information, made reviewable.</h2></div><p className="hidden max-w-xs text-right text-sm leading-6 text-slate-500 sm:block">Example outputs from a simulated document-processing review.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(([value, label]) => <div key={label} className="panel rounded-xl p-6"><p className="text-4xl font-medium tracking-[-.06em] text-white">{value}</p><p className="mt-3 text-sm leading-5 text-slate-400">{label}</p></div>)}</div></section>

      <section id="processing"><p className="eyebrow">Approach / workflow</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">A deliberate path from source to structure.</h2><div className="mt-10 grid gap-3 md:grid-cols-4">{workflow.map(([number, title, description], index) => <article key={title} className="panel relative rounded-xl p-5"><span className="font-mono text-xs text-cyan-300">{number}</span>{index < workflow.length - 1 && <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-[#0d1421] text-slate-500 md:grid">→</span>}<h3 className="mt-7 text-lg font-medium text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p></article>)}</div></section>

      <section className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]"><div><p className="eyebrow">Document processing</p><h2 className="mt-5 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Extract the important parts<br /><span className="text-slate-400">without losing context.</span></h2><p className="mt-5 max-w-md leading-7 text-slate-400">The workflow combines PDF/text extraction and OCR concepts with a structured schema. Important values remain tied to the source document and uncertain values are kept visible for review.</p></div><div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c1220]"><div className="border-b border-white/10 px-5 py-4"><p className="font-mono text-[10px] uppercase tracking-[.12em] text-cyan-300">EXTRACTED RECORD · ILLUSTRATIVE</p><p className="mt-2 text-sm text-slate-500">A simulated invoice transformed into structured fields.</p></div><dl className="grid sm:grid-cols-2">{extractedFields.map(([label, value]) => <div key={label} className="border-b border-white/[.06] px-5 py-4 sm:[&:nth-last-child(-n+2)]:border-b-0"><dt className="font-mono text-[10px] uppercase tracking-[.1em] text-slate-500">{label}</dt><dd className={`mt-2 text-sm ${label === "Review status" ? "text-amber-200" : "text-slate-200"}`}>{value}</dd></div>)}</dl><p className="border-t border-white/[.06] px-5 py-4 text-xs leading-5 text-slate-500">Illustrative document data only — no confidential content is processed or displayed.</p></div></section>

      <section className="grid gap-10 lg:grid-cols-2"><div><p className="eyebrow">Problem</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Documents hold data that systems cannot always use.</h2><p className="mt-5 leading-7 text-slate-400">Operational information frequently arrives in PDFs, scans and inconsistent document templates. Reading it manually is slow, while copying it into systems introduces repetitive work and makes validation harder.</p></div><div><p className="eyebrow">Results</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Structured outputs make follow-up work clearer.</h2><ul className="mt-5 space-y-4 text-sm leading-6 text-slate-400"><li><span className="mr-3 font-mono text-cyan-300">01</span>Document text is made searchable through extraction or OCR.</li><li><span className="mr-3 font-mono text-cyan-300">02</span>Key facts are organized into consistent, reusable fields.</li><li><span className="mr-3 font-mono text-cyan-300">03</span>Missing, uncertain or inconsistent content can be flagged for verification.</li><li><span className="mr-3 font-mono text-cyan-300">04</span>Reviewed information becomes easier to route into downstream analysis or operations.</li></ul></div></section>

      <CodeExamples examples={codeExamples} />

      <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[.06] p-7 sm:p-10"><div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]"><div><p className="eyebrow">How AI was used</p><h2 className="mt-5 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Assistance with structure,<br /><span className="text-slate-400">not blind extraction.</span></h2></div><div><p className="leading-7 text-slate-300">AI helped identify and structure relevant information from documents, assist with extracting and organizing unstructured text, classify or summarize extracted information, write and improve parts of the processing code, and suggest ways to handle inconsistent document content.</p><p className="mt-5 leading-7 text-slate-300">Extracted information and AI-generated results were reviewed by a human before being treated as final. The workflow is designed to surface useful candidates and context—not replace validation or approval.</p><div className="mt-7 flex flex-wrap gap-2">{["Field identification", "Text organization", "Classification", "Code assistance", "Human review"].map((item) => <span key={item} className="rounded-full border border-cyan-300/20 bg-[#080b12]/40 px-3 py-2 font-mono text-[10px] text-cyan-100">{item}</span>)}</div></div></div></section>

      <section className="grid gap-10 border-t border-white/10 pt-16 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Conclusion</p><h2 className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Make document information easier to trust and use.</h2></div><p className="max-w-2xl leading-8 text-slate-400">This project demonstrates a practical document-processing approach: preserve the source, extract what can be read, organize important fields, make uncertainty visible and apply human review before downstream use. The outcome is structured information that supports operations without overstating automation.</p></section>
      <footer className="flex flex-col justify-between gap-5 border-t border-white/10 pt-10 text-sm sm:flex-row sm:items-center"><Link href="/projects/marketing-campaign-analysis" className="text-slate-400 transition hover:text-cyan-200">← Marketing Analysis</Link><Link href="/projects/travel-agent" className="text-cyan-200 transition hover:text-white">Next: Travel Agent →</Link></footer>
    </div></article>
  </main>;
}

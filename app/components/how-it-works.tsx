"use client";

import { useState } from "react";

type Step = {
  number: string;
  title: string;
  summary: string;
  detail: string;
  tool: string;
  source: string;
  snippet: string;
};

export type CodeExample = {
  number: string;
  title: string;
  summary: string;
  tool: string;
  source: string;
  snippet: string;
};

const steps: Step[] = [
  {
    number: "01", title: "Normalize customer data", tool: "Python / Pandas", source: "normalize.py",
    summary: "Contact fields are converted to a consistent representation before records are compared.",
    detail: "The phone helper removes formatting characters, recognizes Polish 0048 and +48 prefixes, and returns one international format while leaving missing values untouched.",
    snippet: `def normalize_phone(value: Any) -> str | None:
    """Return Polish numbers as +48XXXXXXXXX without changing missing values."""
    text = _text(value)
    if text is None:
        return None

    digits = re.sub(r"\\D", "", text)
    if digits.startswith("0048"):
        digits = digits[4:]
    elif digits.startswith("48") and len(digits) == 11:
        digits = digits[2:]
    elif len(digits) == 9:
        pass
    else:
        return f"+{digits}" if digits else None
    return f"+48{digits}"`,
  },
  {
    number: "02", title: "Validate", tool: "Python / Pandas / regex", source: "clean_data.py",
    summary: "Missing important fields and malformed values are flagged rather than removed from the dataset.",
    detail: "Each record accumulates validation flags for incomplete contact details, invalid emails, suspicious phone numbers, invalid dates, and duplicated customer IDs.",
    snippet: `for column in IMPORTANT_FIELDS:
    if pd.isna(row[column]) or not str(row[column]).strip():
        flags[row_position].append(f"missing_{column}")
if pd.notna(row["email"]) and not EMAIL_PATTERN.fullmatch(str(row["email"])):
    flags[row_position].append("malformed_email")
if pd.notna(row["phone"]) and not re.fullmatch(r"\\+48\\d{9}", str(row["phone"])):
    flags[row_position].append("suspicious_phone")
if pd.isna(row["created_at"]):
    flags[row_position].append("invalid_date")`,
  },
  {
    number: "03", title: "Detect duplicates", tool: "Python / RapidFuzz", source: "deduplicate.py",
    summary: "Exact normalized signals are combined with conservative fuzzy comparisons to create review candidates.",
    detail: "Exact email, phone, and name/address combinations add strong evidence. Fuzzy matching is only considered when city and address-number context align, reducing false-positive risk.",
    snippet: `for column, reason in (
    ("email", "same_email"),
    ("phone", "same_phone"),
    ("name_address_key", "same_name_address"),
):
    for left, right in _pairs_for_shared_value(frame, column):
        evidence[tuple(sorted((left, right)))].add(reason)

records = frame[["name", "address", "city"]].fillna("").to_dict("index")
indices = list(records)
for position, left in enumerate(indices):
    left_name, left_address, left_city = records[left]["name"], records[left]["address"], records[left]["city"]
    if not left_name or not left_address:
        continue
    for right in indices[position + 1 :]:
        right_name, right_address, right_city = records[right]["name"], records[right]["address"], records[right]["city"]
        shared_numbers = set(re.findall(r"\\d+", left_address)) & set(re.findall(r"\\d+", right_address))
        if not right_name or not right_address or left_city != right_city or not shared_numbers:
            continue
        name_score = fuzz.ratio(left_name, right_name)
        address_score = fuzz.ratio(left_address, right_address)
        if name_score >= FUZZY_NAME_THRESHOLD and address_score >= FUZZY_ADDRESS_THRESHOLD:
            pair = (left, right)
            evidence[pair].update(("similar_name", "similar_address"))`,
  },
  {
    number: "04", title: "Generate reports", tool: "Python / Pandas / JSON", source: "clean_data.py",
    summary: "The pipeline writes a normalized copy and transparent reports while preserving the source export.",
    detail: "Cleaned records, duplicate candidates, and summary metrics are saved separately. The raw CSV is never overwritten or used as an output path.",
    snippet: `duplicates = find_duplicate_candidates(cleaned)
duplicates.to_csv(DUPLICATE_REPORT_PATH, index=False)

output = cleaned.drop(columns=["name_address_key"])
output.to_csv(CLEANED_PATH, index=False)
high_confidence = int((duplicates["match_type"] == "high_confidence").sum())
possible = int((duplicates["match_type"] == "possible").sum())
involved_records = set(duplicates["record_a"]) | set(duplicates["record_b"])
report = {
    "input_records": len(raw),
    "output_records": len(output),
    "high_confidence_duplicates": high_confidence,
    "possible_duplicates": possible,
    "unique_records": len(output) - len(involved_records),
    "missing_values_before": {column: int((raw[column] == "").sum()) for column in raw.columns},
    "missing_values_after": {column: int(output[column].isna().sum()) for column in raw.columns},
    "normalization_changes": changes,
    "invalid_records": {"count": int((flags != "").sum()), "by_reason": invalid_by_reason},
}
CLEANING_REPORT_PATH.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\\n", encoding="utf-8")`,
  },
];

function CodeBlock({ snippet, expanded }: { snippet: string; expanded: boolean }) {
  const lines = snippet.split("\n");
  const visibleLines = expanded ? lines : lines.slice(0, 5);
  return <div className="overflow-hidden rounded-lg border border-white/10 bg-[#080d18]"><div className="flex items-center gap-1.5 border-b border-white/[.07] px-4 py-2"><i className="h-1.5 w-1.5 rounded-full bg-rose-300/70" /><i className="h-1.5 w-1.5 rounded-full bg-amber-200/70" /><i className="h-1.5 w-1.5 rounded-full bg-emerald-300/70" /><span className="ml-2 font-mono text-[10px] text-slate-600">Python</span></div><pre className="overflow-x-auto p-4 font-mono text-[11px] leading-5 text-slate-300 sm:text-xs"><code>{visibleLines.map((line, index) => <span className="block" key={`${line}-${index}`}><span className="mr-4 inline-block w-4 select-none text-right text-slate-700">{index + 1}</span><span className={line.trimStart().startsWith("def ") || line.trimStart().startsWith("for ") || line.trimStart().startsWith("if ") || line.trimStart().startsWith("elif ") || line.trimStart().startsWith("else:") ? "text-cyan-200" : line.includes("return") ? "text-violet-200" : ""}>{line || " "}</span></span>)}</code></pre>{!expanded && lines.length > visibleLines.length && <div className="border-t border-white/[.07] px-4 py-2 font-mono text-[10px] text-slate-600">+ {lines.length - visibleLines.length} more lines</div>}</div>;
}

export function HowItWorks() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return <section id="how-it-works" aria-labelledby="how-it-works-title"><div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">How it works</p><h2 id="how-it-works-title" className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Implementation,<br /><span className="text-slate-400">without the black box.</span></h2><p className="mt-5 max-w-md leading-7 text-slate-400">Four small steps turn a messy source export into a standardized dataset and review-ready reports.</p></div><div className="flex flex-wrap items-center gap-2 self-end font-mono text-[10px] uppercase tracking-[.1em] text-slate-500"><span>Raw data</span><span className="text-cyan-300">↓</span><span>Normalize</span><span className="text-cyan-300">↓</span><span>Validate</span><span className="text-cyan-300">↓</span><span>Detect duplicates</span><span className="text-cyan-300">↓</span><span>Generate reports</span><span className="text-cyan-300">↓</span><span className="text-slate-300">Cleaned data + review reports</span></div></div>
    <div className="mt-10 space-y-3">{steps.map((step) => { const isExpanded = expanded === step.number; return <article key={step.number} className={`panel overflow-hidden rounded-xl transition-colors ${isExpanded ? "border-cyan-300/30" : ""}`}><button type="button" onClick={() => setExpanded(isExpanded ? null : step.number)} className="flex w-full items-start gap-4 p-5 text-left sm:p-6"><span className="font-mono text-xs text-cyan-300">{step.number}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-4"><span className="text-lg font-medium text-white">{step.title}</span><span className="font-mono text-xs text-slate-500">{isExpanded ? "− Close" : "＋ View code"}</span></span><span className="mt-2 block max-w-2xl text-sm leading-6 text-slate-400">{step.summary}</span></span></button><div className="px-5 pb-5 sm:px-6 sm:pb-6"><div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[.1em]"><span className="text-slate-600">{step.source}</span><span className="text-cyan-300">{step.tool}</span></div><CodeBlock snippet={step.snippet} expanded={isExpanded} />{isExpanded && <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">{step.detail}</p>}</div></article>})}</div>
  </section>;
}

export function CodeExamples({ examples }: { examples: CodeExample[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return <section id="code-examples" aria-labelledby="code-examples-title"><div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">Code examples</p><h2 id="code-examples-title" className="mt-4 text-3xl font-medium tracking-[-.05em] text-white sm:text-4xl">Core analysis ideas,<br /><span className="text-slate-400">shown in code.</span></h2><p className="mt-5 max-w-md leading-7 text-slate-400">Short, illustrative Python examples show the logic behind the workflow without turning this page into a full codebase.</p></div><p className="self-end font-mono text-[10px] uppercase tracking-[.1em] text-slate-500">Illustrative implementation snippets</p></div><div className="mt-10 space-y-3">{examples.map((example) => { const isExpanded = expanded === example.number; return <article key={example.number} className={`panel overflow-hidden rounded-xl transition-colors ${isExpanded ? "border-cyan-300/30" : ""}`}><button type="button" onClick={() => setExpanded(isExpanded ? null : example.number)} className="flex w-full items-start gap-4 p-5 text-left sm:p-6"><span className="font-mono text-xs text-cyan-300">{example.number}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-4"><span className="text-lg font-medium text-white">{example.title}</span><span className="font-mono text-xs text-slate-500">{isExpanded ? "− Close" : "＋ View code"}</span></span><span className="mt-2 block max-w-2xl text-sm leading-6 text-slate-400">{example.summary}</span></span></button><div className="px-5 pb-5 sm:px-6 sm:pb-6"><div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[.1em]"><span className="text-slate-600">{example.source}</span><span className="text-cyan-300">{example.tool}</span></div><CodeBlock snippet={example.snippet} expanded={isExpanded} /><p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">{example.summary}</p></div></article>})}</div></section>;
}

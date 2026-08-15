"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "./language-switcher";

type Tab = "Raw Data" | "Cleaned Data" | "Duplicate Report";

const rawRows = [
  { id: "WS-0005", name: "ALEKSANDRA GRABOWSKA", contact: "+48 512 039 595", detail: "Białystok · 2021-12-02", flag: "" },
  { id: "WS-0017", name: "Beata Nowak", contact: "0048 512-134-623", detail: "Katowice · 2023-12-26", flag: "" },
  { id: "WS-0019", name: "Elżbieta Szymański", contact: "+48 512 150 461", detail: "Bydgoszcz · 21/02/2025", flag: "" },
  { id: "WS-0031", name: "Karolina Król", contact: "+48 512 245 489", detail: "Toruń · email missing", flag: "missing_email" },
];

const cleanedRows = [
  { id: "WS-0005", name: "Aleksandra Grabowska", contact: "+48512039595", detail: "Białystok · 2021-12-02", flag: "" },
  { id: "WS-0017", name: "Beata Nowak", contact: "+48512134623", detail: "Katowice · 2023-12-26", flag: "" },
  { id: "WS-0019", name: "Elżbieta Szymański", contact: "+48512150461", detail: "Bydgoszcz · 2025-02-21", flag: "" },
  { id: "WS-0031", name: "Karolina Król", contact: "+48512245489", detail: "Toruń · email missing", flag: "missing_email" },
];

const duplicateRows = [
  { id: "WS-0012 ↔ LEG-002", name: "Kamil Jankowska", contact: "0.99 · high confidence", detail: "same email · same phone · same name + address", flag: "high_confidence" },
  { id: "WS-0020 ↔ LEG-003", name: "Jan Kozłowski", contact: "0.99 · high confidence", detail: "same email · same name + address", flag: "high_confidence" },
  { id: "WS-0092 ↔ LEG-012", name: "Kamil Nowak", contact: "0.99 · high confidence", detail: "same phone · same name + address", flag: "high_confidence" },
  { id: "WS-0316 ↔ LEG-040", name: "Rafał Maciejewska", contact: "0.99 · high confidence", detail: "same email · same phone · same name + address", flag: "high_confidence" },
];

export function CustomerDataExplorer() {
  const { translate } = useLanguage();
  const [tab, setTab] = useState<Tab>("Raw Data");
  const [query, setQuery] = useState("");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const rows = tab === "Raw Data" ? rawRows : tab === "Cleaned Data" ? cleanedRows : duplicateRows;
  const visibleRows = useMemo(() => rows.filter((row) => {
    const matchesQuery = `${row.id} ${row.name} ${row.contact} ${row.detail}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!flaggedOnly || Boolean(row.flag));
  }), [rows, query, flaggedOnly]);

  return (
    <section id="explorer" className="panel overflow-hidden rounded-2xl">
      <div className="border-b border-white/10 p-5 sm:flex sm:items-center sm:justify-between sm:p-7">
        <div><p className="font-mono text-xs text-cyan-300">{translate("FRONTEND DEMO")}</p><h3 className="mt-2 text-xl font-medium text-white">{translate("Data explorer")}</h3></div>
        <p className="mt-3 text-xs leading-5 text-slate-500 sm:mt-0 sm:max-w-xs sm:text-right">{translate("Small synthetic samples only. No backend or customer data is exposed.")}</p>
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-4 pt-3 sm:px-6">
        {(["Raw Data", "Cleaned Data", "Duplicate Report"] as Tab[]).map((item) => <button key={item} onClick={() => setTab(item)} className={`whitespace-nowrap border-b px-3 py-3 text-sm transition ${tab === item ? "border-cyan-300 text-cyan-200" : "border-transparent text-slate-500 hover:text-slate-200"}`}>{translate(item)}</button>)}
      </div>
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={translate("Search sample records")} aria-label={translate("Search sample records")} className="w-full rounded-lg border border-white/10 bg-[#080d18] px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300/60 sm:max-w-xs" />
        <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400"><input checked={flaggedOnly} onChange={(event) => setFlaggedOnly(event.target.checked)} type="checkbox" className="accent-cyan-300" />{translate(tab === "Duplicate Report" ? "High-confidence only" : "Flagged records only")}</label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-white/[.02] font-mono text-[10px] uppercase tracking-[.12em] text-slate-500"><tr><th className="px-6 py-3 font-medium">{translate("Record")}</th><th className="px-6 py-3 font-medium">{translate("Name")}</th><th className="px-6 py-3 font-medium">{translate("Contact / confidence")}</th><th className="px-6 py-3 font-medium">{translate("Details")}</th></tr></thead>
          <tbody>{visibleRows.map((row) => <tr key={row.id} className="border-t border-white/[.06] text-slate-300"><td className="px-6 py-4 font-mono text-xs text-cyan-200">{row.id}</td><td className="px-6 py-4 text-white">{row.name}</td><td className="px-6 py-4 text-slate-400">{translate(row.contact)}</td><td className="px-6 py-4 text-slate-500">{translate(row.detail)}{row.flag === "missing_email" && <span className="ml-2 rounded-full bg-amber-300/10 px-2 py-1 font-mono text-[10px] text-amber-200">{translate("FLAGGED")}</span>}</td></tr>)}</tbody>
        </table>
        {visibleRows.length === 0 && <p className="p-8 text-center text-sm text-slate-500">{translate("No matching sample records.")}</p>}
      </div>
    </section>
  );
}

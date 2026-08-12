export type Project = {
  number: string;
  slug: "customer-data-cleaning" | "marketing-campaign-analysis" | "document-processing" | "travel-agent";
  title: string;
  summary: string;
  tags: string[];
  artClass: string;
  artLabel: string;
  problem: string;
  approach: string;
  technologies: string[];
  result: string;
  aiUsage: string;
};

export const projects: Project[] = [
  { number: "01", slug: "customer-data-cleaning", title: "Customer Database Cleaning", summary: "A structured data-cleaning workflow for inconsistent customer records in a manufacturing context.", tags: ["Python", "Data Processing", "SQL", "AI-assisted Development"], artClass: "art-data", artLabel: "DATA / 01", problem: "Customer information can arrive in varied formats, creating duplicates and making everyday data work less reliable.", approach: "A Python pipeline is designed to standardize fields, surface possible duplicates and produce clear structured outputs for review.", technologies: ["Python", "Pandas", "SQL", "Data validation"], result: "A repeatable foundation for transforming messy source data into reviewable, structured datasets and reports.", aiUsage: "AI supports exploration of edge cases, implementation options and clearer validation logic while the data workflow remains intentionally engineered and reviewable." },
  { number: "02", slug: "marketing-campaign-analysis", title: "AI-assisted Marketing Campaign Analysis", summary: "An AI-assisted workflow for analyzing marketing campaign data, identifying performance patterns, comparing campaigns and generating data-driven recommendations.", tags: ["Python", "Data Analysis", "Marketing Analytics", "AI-assisted Analysis"], artClass: "art-message", artLabel: "ANALYZE / 02", problem: "Marketing teams need a clear way to compare campaign performance and identify the patterns behind meaningful results.", approach: "A data-analysis workflow structures campaign metrics, compares performance and produces grounded recommendations for review.", technologies: ["Python", "Data analysis", "Marketing analytics", "AI-assisted analysis"], result: "A project foundation for surfacing campaign patterns and supporting more informed marketing decisions.", aiUsage: "AI assists analysis and recommendation generation while final decisions remain with the marketing team." },
  { number: "03", slug: "document-processing", title: "AI-assisted Document Processing", summary: "An AI-assisted workflow for extracting, structuring and analyzing useful information from digital documents.", tags: ["Python", "PDF", "OCR", "AI-assisted Processing"], artClass: "art-document", artLabel: "EXTRACT / 03", problem: "Important operational data is often locked in PDFs, scans and other document formats that are not immediately ready for analysis or reuse.", approach: "The workflow combines document reading, OCR where needed and AI-assisted extraction into consistent structured fields.", technologies: ["Python", "PDF processing", "OCR", "Information extraction"], result: "A scalable project pattern for making unstructured documents easier to search, validate and integrate into downstream work.", aiUsage: "AI assists with identifying and normalizing meaningful information, while outputs remain designed for validation." },
  { number: "04", slug: "travel-agent", title: "AI Travel & Entertainment Agent", summary: "A conversational agent that explores entertainment options for travelers through Telegram and voice.", tags: ["AI Agent", "Telegram", "Voice", "Web Search"], artClass: "art-agent", artLabel: "AGENT / 04", problem: "Travelers want recommendations that reflect their context, preferences and timing without needing to search across many sources.", approach: "A Telegram-based agent combines conversation, voice transcription, LLM reasoning and search-enabled recommendations.", technologies: ["Telegram", "Speech-to-text", "LLM", "Web search APIs"], result: "A real agent-style project concept that brings multiple AI capabilities into a practical conversational experience.", aiUsage: "AI enables natural-language interaction, voice handling and context-aware recommendation flows, with external information sources used to ground responses." },
];

export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }

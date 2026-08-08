export type Project = {
  number: string;
  slug: "customer-data-cleaning" | "message-classification" | "document-processing" | "travel-agent";
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
  { number: "02", slug: "message-classification", title: "Customer Message Classification", summary: "An AI-assisted workflow for organizing incoming messages by category, urgency and required action.", tags: ["Python", "LLM", "API", "Text Classification"], artClass: "art-message", artLabel: "SIGNAL / 02", problem: "High volumes of unstructured customer messages are difficult to triage consistently and can hide messages that need quick human attention.", approach: "A classification flow groups messages by category, urgency, sentiment and whether escalation should be considered.", technologies: ["Python", "LLM API", "Prompt design", "Structured outputs"], result: "A clear project foundation for transforming unstructured messages into usable queues and decision-support signals.", aiUsage: "AI is used for language understanding and classification, with explicit categories and human-review considerations built into the design." },
  { number: "03", slug: "document-processing", title: "Document Processing Pipeline", summary: "A document-to-data concept for extracting useful structured information from PDFs and scanned files.", tags: ["Python", "PDF", "OCR", "Information Extraction"], artClass: "art-document", artLabel: "EXTRACT / 03", problem: "Important operational data is often locked in PDFs, scans and other formats that are not immediately ready for analysis or reuse.", approach: "The pipeline combines document reading, OCR where needed and AI-assisted extraction into consistent structured fields.", technologies: ["Python", "PDF processing", "OCR", "Information extraction"], result: "A scalable project pattern for making unstructured documents easier to search, validate and integrate into downstream work.", aiUsage: "AI helps identify and normalize meaningful information, while extraction outputs are designed for validation instead of blind acceptance." },
  { number: "04", slug: "travel-agent", title: "AI Travel & Entertainment Agent", summary: "A conversational agent that explores entertainment options for travelers through Telegram and voice.", tags: ["AI Agent", "Telegram", "Voice", "Web Search"], artClass: "art-agent", artLabel: "AGENT / 04", problem: "Travelers want recommendations that reflect their context, preferences and timing without needing to search across many sources.", approach: "A Telegram-based agent combines conversation, voice transcription, LLM reasoning and search-enabled recommendations.", technologies: ["Telegram", "Speech-to-text", "LLM", "Web search APIs"], result: "A real agent-style project concept that brings multiple AI capabilities into a practical conversational experience.", aiUsage: "AI enables natural-language interaction, voice handling and context-aware recommendation flows, with external information sources used to ground responses." },
];

export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }

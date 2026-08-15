"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type Language = "en" | "pl";

type InterfaceCopy = {
  onThisPage: string;
  backToTop: string;
  send: string;
  travelRequest: string;
  writeMessage: string;
  understanding: string;
  searching: string;
  preparing: string;
};

const copy: Record<Language, InterfaceCopy> = {
  en: { onThisPage: "On this page", backToTop: "↑ Top", send: "Send", travelRequest: "Travel request", writeMessage: "Write a message…", understanding: "Understanding your request…", searching: "Searching for relevant options…", preparing: "Preparing recommendations…" },
  pl: { onThisPage: "Na tej stronie", backToTop: "↑ Góra", send: "Wyślij", travelRequest: "Prośba o podróż", writeMessage: "Napisz wiadomość…", understanding: "Rozumiem Twoją prośbę…", searching: "Szukam odpowiednich opcji…", preparing: "Przygotowuję rekomendacje…" },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: InterfaceCopy;
  translate: (english: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = "portfolio-language";
const originalText = new WeakMap<Text, string>();

const staticTranslations: Record<string, string> = {
  "AI-focused developer & problem solver": "Programista AI i rozwiązywanie problemów",
  "Building practical solutions with ": "Tworzę praktyczne rozwiązania z wykorzystaniem ",
  "AI, automation": "AI i automatyzacji",
  " and code.": " oraz kodu.",
  "I turn complex, manual workflows into considered software solutions—combining Python, data processing, APIs and AI-assisted development.": "Przekształcam złożone, ręczne procesy w przemyślane rozwiązania programistyczne — łącząc Python, przetwarzanie danych, API i rozwój wspierany przez AI.",
  "View projects": "Zobacz projekty",
  "Explore selected work": "Zobacz wybrane realizacje",
  "Selected projects": "Wybrane projekty",
  "Applied AI work,": "Praktyczne zastosowania AI,",
  "built to solve real problems.": "stworzone, by rozwiązywać realne problemy.",
  "Five focused case studies exploring data quality, sales intelligence, language workflows, document automation and agentic systems.": "Cztery praktyczne case studies dotyczące jakości danych, analityki marketingowej, automatyzacji dokumentów i systemów agentowych.",
  "Approach": "Podejście",
  "AI is part of the process—": "AI jest częścią procesu —",
  "not a substitute for engineering.": "nie zamiennikiem inżynierii.",
  "I use AI as a development and problem-solving partner: to explore options, accelerate iteration and help turn an unclear problem into a robust, testable solution.": "Korzystam z AI jako partnera w rozwoju i rozwiązywaniu problemów: aby badać możliwości, przyspieszać iteracje i przekształcać niejasny problem w solidne, testowalne rozwiązanie.",
  "Problem": "Problem",
  "Research": "Badanie",
  "AI-assisted solution design": "Projektowanie rozwiązania z pomocą AI",
  "Implementation": "Implementacja",
  "Testing": "Testowanie",
  "Validation": "Walidacja",
  "Improvement": "Ulepszanie",
  "Capabilities": "Kompetencje",
  "Tools for turning ideas": "Narzędzia do przekształcania pomysłów",
  "into working systems.": "w działające systemy.",
  "AI & LLM": "AI i LLM",
  "Development": "Rozwój oprogramowania",
  "Data": "Dane",
  "Contact": "Kontakt",
  "Let's build something useful.": "Zbudujmy coś użytecznego.",
  "I'm open to opportunities involving AI, automation, data processing, AI agents and software development.": "Jestem otwarty na możliwości związane z AI, automatyzacją, przetwarzaniem danych, agentami AI i rozwojem oprogramowania.",
  "Interested in": "Obszary zainteresowania",
  "Get in touch": "Kontakt",
  "Email": "E-mail",
  "Completed case study": "Ukończone case study",
  "Customer ": "Czyszczenie ",
  "Database Cleaning": "bazy klientów",
  "Customer Database Cleaning": "Czyszczenie bazy danych klientów",
  "Cleaning and deduplication of a legacy customer database using Python and AI-assisted development.": "Czyszczenie i deduplikacja starszej bazy klientów z użyciem Python i rozwoju wspieranego przez AI.",
  "Explore the result": "Zobacz wynik",
  "Project overview": "Przegląd projektu",
  "A legacy export,": "Starszy eksport,",
  "made reliable.": "który stał się wiarygodny.",
  "Verified results": "Zweryfikowane wyniki",
  "The project, in numbers.": "Projekt w liczbach.",
  "Pipeline visualization": "Wizualizacja pipeline'u",
  "From raw export to review-ready output.": "Od surowego eksportu do wyniku gotowego do przeglądu.",
  "Duplicate detection": "Wykrywanie duplikatów",
  "How AI was used": "Jak użyto AI",
  "AI-assisted development": "Rozwój wspierany przez AI",
  "Technical implementation": "Implementacja techniczna",
  "Demo / data explorer": "Demo / eksplorator danych",
  "Results": "Wyniki",
  "Marketing Campaign ": "Analiza kampanii ",
  "Analysis": "marketingowych",
  "AI-assisted Marketing Campaign Analysis": "Analiza kampanii marketingowych wspomagana przez AI",
  "An AI-assisted workflow for analyzing marketing campaign data, identifying performance patterns, comparing campaigns and generating data-driven recommendations.": "Workflow wspierany przez AI do analizy danych kampanii marketingowych, identyfikowania wzorców, porównywania kampanii i tworzenia rekomendacji opartych na danych.",
  "Explore the workflow": "Zobacz workflow",
  "From campaign exports": "Od eksportów kampanii",
  "to clearer decisions.": "do trafniejszych decyzji.",
  "Illustrative analysis": "Ilustracyjna analiza",
  "Signals worth investigating.": "Sygnały warte zbadania.",
  "Approach / workflow": "Podejście / workflow",
  "A repeatable route from data to action.": "Powtarzalna droga od danych do działania.",
  "Data analysis": "Analiza danych",
  "Compare the metrics": "Porównuj metryki",
  "in context.": "w kontekście.",
  "Results / insights": "Wyniki / wnioski",
  "Code examples": "Przykłady kodu",
  "Conclusion": "Podsumowanie",
  "Document ": "Przetwarzanie ",
  "Processing": "dokumentów",
  "AI-assisted Document Processing": "Przetwarzanie dokumentów wspomagane przez AI",
  "An AI-assisted workflow for extracting, structuring and analyzing useful information from digital documents.": "Workflow wspierany przez AI do ekstrakcji, strukturyzowania i analizy użytecznych informacji z dokumentów cyfrowych.",
  "From document files": "Od plików dokumentów",
  "to usable information.": "do użytecznych informacji.",
  "Illustrative processing": "Ilustracyjne przetwarzanie",
  "Information, made reviewable.": "Informacje gotowe do przeglądu.",
  "A deliberate path from source to structure.": "Przemyślana droga od źródła do struktury.",
  "Document processing": "Przetwarzanie dokumentów",
  "Extract the important parts": "Wyodrębnij ważne elementy",
  "without losing context.": "bez utraty kontekstu.",
  "Travel & Entertainment ": "Agent podróży i ",
  "Agent": "rozrywki",
  "AI Travel & Entertainment Agent": "Agent AI do podróży i rozrywki",
  "A conversational AI agent that helps travelers discover entertainment, activities and places through Telegram and natural language.": "Konwersacyjny agent AI, który pomaga podróżnym odkrywać rozrywkę, aktywności i miejsca przez Telegram oraz język naturalny.",
  "View Telegram demo": "Zobacz demo Telegram",
  "Travel ideas through": "Pomysły na podróże dzięki",
  "a natural conversation.": "naturalnej rozmowie.",
  "How the agent works": "Jak działa agent",
  "From a message to a useful shortlist.": "Od wiadomości do użytecznej listy propozycji.",
  "Telegram demo": "Demo Telegram",
  "A travel conversation,": "Rozmowa o podróży,",
  "inside the familiar interface.": "w znajomym interfejsie.",
  "The core of the agent,": "Rdzeń agenta,",
  "guided by traveler context.": "kierowany kontekstem podróżnego.",
  "A more conversational way to explore a city.": "Bardziej konwersacyjny sposób odkrywania miasta.",
  "Back to Projects →": "Powrót do projektów →",
  "← Back to Projects": "← Powrót do projektów",
  "Illustrative case study": "Ilustracyjne case study",
  "Agent concept · Telegram interface": "Koncepcja agenta · interfejs Telegram",
  "AI Agent": "Agent AI",
  "AI-assisted Development": "Rozwój wspierany przez AI",
  "AI-assisted Analysis": "Analiza wspierana przez AI",
  "AI-assisted Processing": "Przetwarzanie wspierane przez AI",
  "Data Analysis": "Analiza danych",
  "Marketing Analytics": "Analityka marketingowa",
  "Data Processing": "Przetwarzanie danych",
  "Web Search": "Wyszukiwanie w sieci",
  "Voice": "Głos",
  "Pandas": "Pandas",
  "RapidFuzz": "RapidFuzz",
  "Input records": "Rekordy wejściowe",
  "Output records": "Rekordy wyjściowe",
  "High-confidence duplicate pairs": "Pary duplikatów o wysokiej pewności",
  "Possible duplicate pairs": "Możliwe pary duplikatów",
  "Records not involved in candidate pairs": "Rekordy poza parami kandydatów",
  "Invalid / incomplete records flagged": "Oznaczone rekordy nieprawidłowe / niekompletne",
  "Metrics generated by the completed pipeline run.": "Metryki wygenerowane przez ukończone uruchomienie pipeline'u.",
  "Raw CSV": "Surowy CSV",
  "A deliberately inconsistent legacy export containing customer and staircase-enquiry data.": "Celowo niespójny starszy eksport zawierający dane klientów i zapytania o schody.",
  "Required fields, duplicate IDs, malformed contacts and invalid dates are flagged—not deleted.": "Wymagane pola, zduplikowane identyfikatory, nieprawidłowe dane kontaktowe i błędne daty są oznaczane — nie usuwane.",
  "Names, emails, Polish phone numbers, cities, addresses and dates are standardized.": "Nazwy, e-maile, polskie numery telefonów, miasta, adresy i daty są standaryzowane.",
  "Exact signals and conservative RapidFuzz comparisons create human-review candidates.": "Dokładne sygnały i ostrożne porównania RapidFuzz tworzą kandydatów do oceny przez człowieka.",
  "Cleaned data and transparent CSV/JSON reports preserve an auditable path back to source.": "Oczyszczone dane oraz przejrzyste raporty CSV/JSON zachowują audytowalną ścieżkę do źródła.",
  "Before / after": "Przed / po",
  "Normalization, made visible.": "Widoczna normalizacja.",
  "Examples use synthetic records from the completed WoodStep dataset. The raw export remains untouched; standardization is written to a separate cleaned file.": "Przykłady wykorzystują syntetyczne rekordy z ukończonego zbioru WoodStep. Surowy eksport pozostaje nietknięty; standaryzacja jest zapisywana w osobnym oczyszczonym pliku.",
  "Flagged for review,": "Oznaczone do przeglądu,",
  "never silently merged.": "nigdy po cichu nie scalane.",
  "Duplicates are detected from exact normalized emails, phones, and name/address combinations, with RapidFuzz name and address comparison as additional evidence. The output is a review-ready report—not an automatic deletion step.": "Duplikaty są wykrywane na podstawie dokładnie znormalizowanych e-maili, telefonów i kombinacji nazwy/adresu, a porównanie nazw i adresów przez RapidFuzz stanowi dodatkowy dowód. Wynikiem jest raport gotowy do przeglądu — nie automatyczne usuwanie.",
  "EXAMPLE FROM DUPLICATE REPORT": "PRZYKŁAD Z RAPORTU DUPLIKATÓW",
  "Record A": "Rekord A",
  "Record B": "Rekord B",
  "Match confidence:": "Pewność dopasowania:",
  "same normalized email · same normalized phone · same name + address": "ten sam znormalizowany e-mail · ten sam znormalizowany telefon · ta sama nazwa + adres",
  "Confidence is a rule-based heuristic, not a statistically calibrated probability.": "Pewność jest heurystyką opartą na regułach, a nie statystycznie skalibrowanym prawdopodobieństwem.",
  "A development and analysis assistant,": "Asystent rozwoju i analizy,",
  "not the final authority.": "nie ostateczny autorytet.",
  "This illustrative case study models a workflow for examining campaign data across channels and objectives. It brings performance into one view so a marketing team can compare what is working, where efficiency is changing and which findings need closer review.": "To ilustracyjne case study przedstawia workflow badania danych kampanii w różnych kanałach i celach. Łączy wyniki w jednym widoku, aby zespół marketingowy mógł porównać, co działa, gdzie zmienia się efektywność i które wnioski wymagają bliższego sprawdzenia.",
  "No external company data is used. The metrics shown on this page are realistic but illustrative examples designed to demonstrate how a repeatable analysis can support—not replace—marketing judgment.": "Nie wykorzystano danych zewnętrznej firmy. Metryki pokazane na tej stronie są realistyczne, ale ilustracyjne; mają pokazać, jak powtarzalna analiza może wspierać — a nie zastępować — osąd marketingowy.",
  "Example outputs from a simulated campaign review.": "Przykładowe wyniki z symulowanego przeglądu kampanii.",
  "Illustrative campaigns compared": "Porównane kampanie ilustracyjne",
  "Performance patterns surfaced": "Wykryte wzorce wydajności",
  "Spend anomalies flagged for review": "Anomalie wydatków oznaczone do przeglądu",
  "Recommendation areas produced": "Obszary rekomendacji",
  "Prepare data": "Przygotuj dane",
  "Bring campaign exports into one analysis-ready table and standardize key dimensions such as channel, period and objective.": "Połącz eksporty kampanii w jedną tabelę gotową do analizy i ustandaryzuj kluczowe wymiary, takie jak kanał, okres i cel.",
  "Compare performance": "Porównaj wyniki",
  "Calculate and compare metrics including spend, reach, clicks, conversions, CTR, CPC and conversion rate.": "Oblicz i porównaj metryki, w tym wydatki, zasięg, kliknięcia, konwersje, CTR, CPC i współczynnik konwersji.",
  "Investigate patterns": "Zbadaj wzorce",
  "Look for changes in performance, outliers and channel-level trade-offs worth validating with a marketing owner.": "Szukaj zmian wyników, wartości odstających i kompromisów na poziomie kanału, które warto zweryfikować z właścicielem marketingowym.",
  "Recommend next actions": "Zaproponuj kolejne działania",
  "Turn validated findings into specific tests, budget-review questions and campaign optimization ideas.": "Zamień zweryfikowane wnioski w konkretne testy, pytania dotyczące budżetu i pomysły na optymalizację kampanii.",
  "The workflow uses Python and Pandas concepts to aggregate campaign performance, calculate efficiency metrics and keep comparisons grounded in the same reporting period.": "Workflow wykorzystuje Python i Pandas do agregowania wyników kampanii, obliczania metryk efektywności i porównywania danych z tego samego okresu raportowania.",
  "Illustrative data only — this table demonstrates the type of comparison the workflow supports.": "Tylko dane ilustracyjne — tabela pokazuje rodzaj porównania obsługiwanego przez workflow.",
  "Campaign data is easy to collect, harder to interpret.": "Dane kampanii łatwo zebrać, trudniej je interpretować.",
  "Performance is often spread across platforms, periods and reporting formats. A headline metric can look strong in isolation while hiding a weak conversion rate, rising acquisition cost or a change in audience quality.": "Wyniki są często rozproszone między platformami, okresami i formatami raportowania. Główna metryka może wyglądać dobrze w izolacji, jednocześnie ukrywając niski współczynnik konwersji, rosnący koszt pozyskania lub zmianę jakości odbiorców.",
  "Findings become reviewable next steps.": "Wnioski stają się kolejnymi krokami do oceny.",
  "Compare efficient campaigns before moving incremental budget.": "Porównaj efektywne kampanie przed przesunięciem dodatkowego budżetu.",
  "Investigate outliers such as high spend with declining conversion quality.": "Zbadaj wartości odstające, np. wysokie wydatki przy spadającej jakości konwersji.",
  "Separate channel performance from creative, audience and landing-page hypotheses.": "Oddziel wyniki kanału od hipotez dotyczących kreacji, odbiorców i strony docelowej.",
  "Convert observations into small, measurable follow-up tests.": "Zamień obserwacje w małe, mierzalne testy kontrolne.",
  "An analytical assistant,": "Asystent analityczny,",
  "not the decision-maker.": "nie decydent.",
  "AI supported the development and analysis workflow: it helped write and improve Python/Pandas analysis code, explore the dataset and identify useful metrics, suggest patterns or anomalies worth investigating, formulate hypotheses and recommendations, and assist with interpreting results.": "AI wspierała workflow rozwoju i analizy: pomagała pisać i ulepszać kod analityczny Python/Pandas, badać zbiór danych i identyfikować przydatne metryki, sugerować warte sprawdzenia wzorce lub anomalie, formułować hipotezy i rekomendacje oraz interpretować wyniki.",
  "AI did not make final business decisions. The analysis, hypotheses and conclusions were checked and validated by a human before they were treated as recommendations.": "AI nie podejmowała ostatecznych decyzji biznesowych. Analiza, hipotezy i wnioski były sprawdzane i walidowane przez człowieka, zanim potraktowano je jako rekomendacje.",
  "Code assistance": "Pomoc w kodzie",
  "Metric exploration": "Badanie metryk",
  "Pattern investigation": "Badanie wzorców",
  "Hypothesis building": "Tworzenie hipotez",
  "Human validation": "Walidacja przez człowieka",
  "Make analysis easier to act on.": "Ułatw przekształcanie analizy w działanie.",
  "This project demonstrates a practical approach to campaign analysis: consolidate the data, compare performance fairly, flag questions that deserve investigation and turn evidence into testable recommendations. It is designed to support experienced marketing decision-making, not automate it.": "Projekt pokazuje praktyczne podejście do analizy kampanii: konsolidację danych, uczciwe porównywanie wyników, oznaczanie pytań wymagających zbadania i przekształcanie dowodów w testowalne rekomendacje. Ma wspierać doświadczone decyzje marketingowe, a nie je automatyzować.",
  "This illustrative case study models how digital documents can move through a clear processing path: PDF or document input, text extraction or OCR, AI-assisted structuring, and a final reviewable result.": "To ilustracyjne case study pokazuje, jak dokumenty cyfrowe mogą przejść przez jasną ścieżkę przetwarzania: wejście PDF lub dokumentu, ekstrakcję tekstu lub OCR, strukturyzowanie wspierane przez AI i końcowy wynik gotowy do oceny.",
  "No real or confidential documents are used. Examples and extracted fields are realistic but illustrative, designed to show how unstructured information can become easier to search, validate and reuse.": "Nie użyto prawdziwych ani poufnych dokumentów. Przykłady i wyodrębnione pola są realistyczne, ale ilustracyjne; pokazują, jak nieustrukturyzowane informacje mogą stać się łatwiejsze do wyszukania, walidacji i ponownego wykorzystania.",
  "Example outputs from a simulated document-processing review.": "Przykładowe wyniki z symulowanego przeglądu przetwarzania dokumentów.",
  "Illustrative documents reviewed": "Przejrzane dokumenty ilustracyjne",
  "Document types represented": "Reprezentowane typy dokumentów",
  "Structured fields extracted": "Wyodrębnione pola strukturalne",
  "Review flags surfaced": "Oznaczenia do przeglądu",
  "Receive document": "Odbierz dokument",
  "Start with a digital PDF, scan or text-based document and retain the source as the reference record.": "Zacznij od cyfrowego PDF, skanu lub dokumentu tekstowego i zachowaj źródło jako rekord referencyjny.",
  "Extract text": "Wyodrębnij tekst",
  "Use direct text extraction where available, or OCR to make scanned content searchable and ready for review.": "Użyj bezpośredniej ekstrakcji tekstu, gdy jest dostępna, albo OCR, aby zeskanowana treść była wyszukiwalna i gotowa do oceny.",
  "Structure information": "Ustrukturyzuj informacje",
  "Identify important fields, normalize values and organize unstructured content into a consistent record shape.": "Zidentyfikuj ważne pola, znormalizuj wartości i uporządkuj nieustrukturyzowaną treść w spójny rekord.",
  "Review the result": "Sprawdź wynik",
  "Flag uncertain or inconsistent fields so a person can verify them before the information is treated as final.": "Oznacz niepewne lub niespójne pola, aby człowiek mógł je zweryfikować, zanim informacja zostanie uznana za ostateczną.",
  "The workflow combines PDF/text extraction and OCR concepts with a structured schema. Important values remain tied to the source document and uncertain values are kept visible for review.": "Workflow łączy ekstrakcję PDF/tekstu i OCR ze strukturalnym schematem. Ważne wartości pozostają powiązane z dokumentem źródłowym, a niepewne wartości są widoczne do przeglądu.",
  "EXTRACTED RECORD · ILLUSTRATIVE": "WYODRĘBNIONY REKORD · ILUSTRACYJNY",
  "A simulated invoice transformed into structured fields.": "Symulowana faktura przekształcona w pola strukturalne.",
  "Document type": "Typ dokumentu",
  "Supplier invoice": "Faktura dostawcy",
  "Reference": "Numer referencyjny",
  "Issue date": "Data wystawienia",
  "Amount": "Kwota",
  "Currency": "Waluta",
  "Supplier": "Dostawca",
  "Payment terms": "Warunki płatności",
  "Review status": "Status przeglądu",
  "Check tax ID": "Sprawdź NIP",
  "Illustrative document data only — no confidential content is processed or displayed.": "Wyłącznie ilustracyjne dane dokumentu — żadna poufna treść nie jest przetwarzana ani wyświetlana.",
  "Documents hold data that systems cannot always use.": "Dokumenty zawierają dane, których systemy nie zawsze potrafią wykorzystać.",
  "Operational information frequently arrives in PDFs, scans and inconsistent document templates. Reading it manually is slow, while copying it into systems introduces repetitive work and makes validation harder.": "Informacje operacyjne często trafiają w PDF-ach, skanach i niespójnych szablonach dokumentów. Ręczne czytanie jest powolne, a przepisywanie do systemów wprowadza powtarzalną pracę i utrudnia walidację.",
  "Structured outputs make follow-up work clearer.": "Ustrukturyzowane wyniki ułatwiają dalszą pracę.",
  "Document text is made searchable through extraction or OCR.": "Tekst dokumentu staje się wyszukiwalny dzięki ekstrakcji lub OCR.",
  "Key facts are organized into consistent, reusable fields.": "Kluczowe fakty są organizowane w spójne pola nadające się do ponownego wykorzystania.",
  "Missing, uncertain or inconsistent content can be flagged for verification.": "Brakująca, niepewna lub niespójna treść może zostać oznaczona do weryfikacji.",
  "Reviewed information becomes easier to route into downstream analysis or operations.": "Sprawdzone informacje łatwiej przekazać do dalszej analizy lub operacji.",
  "Assistance with structure,": "Pomoc w strukturze,",
  "not blind extraction.": "nie ślepa ekstrakcja.",
  "AI helped identify and structure relevant information from documents, assist with extracting and organizing unstructured text, classify or summarize extracted information, write and improve parts of the processing code, and suggest ways to handle inconsistent document content.": "AI pomagała identyfikować i strukturyzować istotne informacje z dokumentów, wyodrębniać i organizować nieustrukturyzowany tekst, klasyfikować lub podsumowywać wyodrębnione informacje, pisać i ulepszać części kodu przetwarzania oraz proponować sposoby obsługi niespójnej treści dokumentów.",
  "Extracted information and AI-generated results were reviewed by a human before being treated as final. The workflow is designed to surface useful candidates and context—not replace validation or approval.": "Wyodrębnione informacje i wyniki wygenerowane przez AI były sprawdzane przez człowieka, zanim uznano je za ostateczne. Workflow ma uwidaczniać użyteczne propozycje i kontekst — nie zastępować walidacji ani zatwierdzenia.",
  "Field identification": "Identyfikacja pól",
  "Text organization": "Organizacja tekstu",
  "Classification": "Klasyfikacja",
  "Human review": "Ocena przez człowieka",
  "Make document information easier to trust and use.": "Ułatw zaufanie do informacji z dokumentów i ich wykorzystanie.",
  "This project demonstrates a practical document-processing approach: preserve the source, extract what can be read, organize important fields, make uncertainty visible and apply human review before downstream use. The outcome is structured information that supports operations without overstating automation.": "Projekt przedstawia praktyczne podejście do przetwarzania dokumentów: zachowaj źródło, wyodrębnij to, co można odczytać, uporządkuj ważne pola, uwidocznij niepewność i zastosuj kontrolę człowieka przed dalszym użyciem. Efektem są ustrukturyzowane informacje wspierające działania operacyjne bez przeceniania automatyzacji.",
  "Understand the request": "Zrozum prośbę",
  "Interpret natural language to identify destination, dates, interests, group context and practical constraints.": "Zinterpretuj język naturalny, aby określić cel podróży, daty, zainteresowania, kontekst grupy i praktyczne ograniczenia.",
  "Plan the search": "Zaplanuj wyszukiwanie",
  "Translate the request into targeted activity and entertainment queries that reflect the traveler’s preferences.": "Przekształć prośbę w ukierunkowane zapytania o aktywności i rozrywkę, odzwierciedlające preferencje podróżnego.",
  "Evaluate options": "Oceń opcje",
  "Compare returned places and events against relevance, timing, location and the details expressed in the conversation.": "Porównaj znalezione miejsca i wydarzenia pod kątem trafności, czasu, lokalizacji i szczegółów podanych w rozmowie.",
  "Respond in Telegram": "Odpowiedz w Telegramie",
  "Return a concise, personalized shortlist the traveler can continue refining through natural conversation.": "Zwróć zwięzłą, spersonalizowaną krótką listę, którą podróżny może dalej doprecyzować w naturalnej rozmowie.",
  "The agent is designed to make discovering activities feel less like navigating several search tabs and more like asking a well-informed local guide. A traveler can describe where they are going, when, and what they enjoy in their own words.": "Agent ma sprawić, że odkrywanie aktywności będzie mniej przypominać przeglądanie wielu kart wyszukiwania, a bardziej rozmowę z dobrze poinformowanym lokalnym przewodnikiem. Podróżny może własnymi słowami opisać, dokąd jedzie, kiedy i co lubi.",
  "This page demonstrates the product experience and workflow concept. The Telegram connection, web search and external AI services are not connected in this static portfolio demo.": "Ta strona prezentuje doświadczenie produktu i koncepcję workflow. Połączenie z Telegramem, wyszukiwanie w sieci i zewnętrzne usługi AI nie są podłączone w tym statycznym demo portfolio.",
  "Good plans need context, not just search results.": "Dobre plany potrzebują kontekstu, nie tylko wyników wyszukiwania.",
  "Travelers often need to combine dates, location, mood, budget and practical timing before an activity becomes a useful recommendation. General search can produce too many disconnected options and little help with choosing between them.": "Podróżni często muszą połączyć daty, lokalizację, nastrój, budżet i praktyczny czas, zanim aktywność stanie się użyteczną rekomendacją. Ogólne wyszukiwanie może dać zbyt wiele niepowiązanych opcji i niewielką pomoc w wyborze.",
  "Context flows through every step.": "Kontekst towarzyszy każdemu etapowi.",
  "The agent keeps the traveler’s request at the center: it extracts useful details, plans a targeted search, evaluates options, and responds with a short, personalized set of suggestions that can be refined in the same conversation.": "Agent stawia prośbę podróżnego w centrum: wyodrębnia użyteczne szczegóły, planuje ukierunkowane wyszukiwanie, ocenia opcje i odpowiada krótkim, spersonalizowanym zestawem propozycji, które można dopracować w tej samej rozmowie.",
  "Start with a city, country or trip idea. The AI assistant keeps the conversation context and turns a simple destination into a practical travel plan.": "Zacznij od miasta, kraju lub pomysłu na podróż. Asystent AI zachowuje kontekst rozmowy i zamienia prosty cel w praktyczny plan podróży.",
  "In the intended agent workflow, AI understands natural-language requests, identifies location, preferences and other relevant details, helps formulate focused search queries, analyzes search results, and generates a personalized response.": "W docelowym workflow agenta AI rozumie prośby w języku naturalnym, identyfikuje lokalizację, preferencje i inne istotne szczegóły, pomaga formułować precyzyjne zapytania, analizuje wyniki wyszukiwania i generuje spersonalizowaną odpowiedź.",
  "The agent is designed to support discovery rather than make decisions for the traveler. Recommendations should remain transparent, grounded in available information and easy for the user to refine.": "Agent ma wspierać odkrywanie, a nie podejmować decyzje za podróżnego. Rekomendacje powinny pozostać przejrzyste, oparte na dostępnych informacjach i łatwe do doprecyzowania przez użytkownika.",
  "Intent understanding": "Rozumienie intencji",
  "Location extraction": "Wyodrębnianie lokalizacji",
  "Search planning": "Planowanie wyszukiwania",
  "Result analysis": "Analiza wyników",
  "Personalized response": "Spersonalizowana odpowiedź",
  "This project demonstrates how an agent can connect natural-language interaction, search planning and personalized recommendations in a familiar messaging channel. The current page is a static demonstration; real Telegram, search and AI integrations are intentionally left for a later implementation phase.": "Projekt pokazuje, jak agent może połączyć interakcję w języku naturalnym, planowanie wyszukiwania i spersonalizowane rekomendacje w znanym kanale komunikacji. Obecna strona jest statyczną demonstracją; prawdziwe integracje Telegrama, wyszukiwania i AI celowo pozostawiono na późniejszy etap.",
  "How it works": "Jak to działa",
  "Implementation,": "Implementacja,",
  "without the black box.": "bez czarnej skrzynki.",
  "Four small steps turn a messy source export into a standardized dataset and review-ready reports.": "Cztery małe kroki zmieniają chaotyczny eksport źródłowy w ustandaryzowany zbiór danych i raporty gotowe do przeglądu.",
  "Raw data": "Surowe dane",
  "Normalize": "Normalizacja",
  "Validate": "Walidacja",
  "Detect duplicates": "Wykrywanie duplikatów",
  "Generate reports": "Generowanie raportów",
  "Cleaned data + review reports": "Oczyszczone dane + raporty do przeglądu",
  "Normalize customer data": "Normalizuj dane klientów",
  "Contact fields are converted to a consistent representation before records are compared.": "Pola kontaktowe są zamieniane na spójną reprezentację przed porównaniem rekordów.",
  "The phone helper removes formatting characters, recognizes Polish 0048 and +48 prefixes, and returns one international format while leaving missing values untouched.": "Pomocnik telefonu usuwa znaki formatowania, rozpoznaje polskie prefiksy 0048 i +48 oraz zwraca jeden format międzynarodowy, pozostawiając brakujące wartości bez zmian.",
  "Missing important fields and malformed values are flagged rather than removed from the dataset.": "Brakujące ważne pola i nieprawidłowe wartości są oznaczane zamiast usuwane ze zbioru danych.",
  "Each record accumulates validation flags for incomplete contact details, invalid emails, suspicious phone numbers, invalid dates, and duplicated customer IDs.": "Każdy rekord otrzymuje oznaczenia walidacyjne dla niekompletnych danych kontaktowych, błędnych e-maili, podejrzanych numerów telefonu, nieprawidłowych dat i zduplikowanych ID klienta.",
  "Exact normalized signals are combined with conservative fuzzy comparisons to create review candidates.": "Dokładne znormalizowane sygnały są łączone z ostrożnymi porównaniami rozmytymi, aby stworzyć kandydatów do przeglądu.",
  "Exact email, phone, and name/address combinations add strong evidence. Fuzzy matching is only considered when city and address-number context align, reducing false-positive risk.": "Dokładne kombinacje e-maila, telefonu i nazwy/adresu stanowią silny dowód. Dopasowanie rozmyte jest uwzględniane tylko wtedy, gdy zgadzają się miasto i numer adresu, co zmniejsza ryzyko fałszywych trafień.",
  "The pipeline writes a normalized copy and transparent reports while preserving the source export.": "Pipeline zapisuje znormalizowaną kopię i przejrzyste raporty, zachowując eksport źródłowy.",
  "Cleaned records, duplicate candidates, and summary metrics are saved separately. The raw CSV is never overwritten or used as an output path.": "Oczyszczone rekordy, kandydaci na duplikaty i metryki podsumowujące są zapisywane osobno. Surowy CSV nigdy nie jest nadpisywany ani używany jako ścieżka wyjściowa.",
  "Core analysis ideas,": "Kluczowe idee analizy,",
  "shown in code.": "pokazane w kodzie.",
  "Short, illustrative Python examples show the logic behind the workflow without turning this page into a full codebase.": "Krótkie, ilustracyjne przykłady Python pokazują logikę workflow bez zmieniania tej strony w pełny kod źródłowy.",
  "Illustrative implementation snippets": "Ilustracyjne fragmenty implementacji",
  "− Close": "− Zamknij",
  "＋ View code": "＋ Pokaż kod",
  "more lines": "kolejnych linii",
  "Calculate campaign efficiency": "Oblicz efektywność kampanii",
  "Calculates click-through rate and cost per acquisition from campaign-level spend, click and conversion columns.": "Oblicza współczynnik kliknięć i koszt pozyskania na podstawie wydatków, kliknięć i konwersji kampanii.",
  "Compare channel performance": "Porównaj wyniki kanałów",
  "Groups campaign data by channel to compare total spend, conversions and average efficiency in one view.": "Grupuje dane kampanii według kanału, aby porównać łączne wydatki, konwersje i średnią efektywność w jednym widoku.",
  "Flag campaigns for review": "Oznacz kampanie do przeglądu",
  "Identifies campaigns with high acquisition cost or unusually weak click-through rate so they can be reviewed by a marketer.": "Identyfikuje kampanie z wysokim kosztem pozyskania lub wyjątkowo niskim współczynnikiem kliknięć, aby marketer mógł je sprawdzić.",
  "Extract document text": "Wyodrębnij tekst dokumentu",
  "Reads each PDF page and joins the extracted text into one string ready for downstream processing.": "Odczytuje każdą stronę PDF i łączy wyodrębniony tekst w jeden ciąg gotowy do dalszego przetwarzania.",
  "Structure key fields": "Ustrukturyzuj kluczowe pola",
  "Maps values from extracted text into a predictable record shape that can be validated and stored consistently.": "Mapuje wartości z wyodrębnionego tekstu do przewidywalnej struktury rekordu, którą można walidować i spójnie przechowywać.",
  "Assist classification and review": "Wspomóż klasyfikację i przegląd",
  "Uses an AI-assisted classification step to suggest a document type and summary, then sends the result to human review before final use.": "Wykorzystuje etap klasyfikacji wspierany przez AI, aby zaproponować typ dokumentu i podsumowanie, a następnie przekazuje wynik do przeglądu przez człowieka przed końcowym użyciem.",
  "Capture travel intent": "Rozpoznaj intencję podróży",
  "Passes a Telegram message into an intent-extraction step that returns the location, dates and preferences needed to guide the next action.": "Przekazuje wiadomość Telegram do kroku ekstrakcji intencji, który zwraca lokalizację, daty i preferencje potrzebne do kolejnego działania.",
  "Build a focused search": "Zbuduj ukierunkowane wyszukiwanie",
  "Turns the structured request into a focused query instead of using a broad, generic destination search.": "Zamienia ustrukturyzowaną prośbę w precyzyjne zapytanie zamiast szerokiego, ogólnego wyszukiwania miejsca docelowego.",
  "Shape the recommendation": "Ukształtuj rekomendację",
  "Ranks options against the traveler’s request and formats a clear Telegram-ready response with the most relevant choices.": "Ranguje opcje względem prośby podróżnego i formatuje jasną odpowiedź gotową do Telegrama z najtrafniejszymi wyborami.",
  "← Marketing Analysis": "← Analiza marketingowa",
  "Next: Document Processing →": "Dalej: Przetwarzanie dokumentów →",
  "← Document Processing": "← Przetwarzanie dokumentów",
  "Next: Travel Agent →": "Dalej: Agent podróży →",
  "Built with curiosity and code": "Stworzone z ciekawością i kodem",
  "WoodStep is a simulated wooden staircase manufacturer with a legacy customer database containing inconsistent customer records. The export includes inconsistent names, phone formatting differences, inconsistent emails, incomplete contact information, inconsistent dates, and duplicate or near-duplicate records.": "WoodStep to symulowany producent drewnianych schodów ze starszą bazą klientów zawierającą niespójne rekordy. Eksport obejmuje niespójne nazwy, różnice w formatach telefonów, niespójne e-maile, niepełne dane kontaktowe, niespójne daty oraz duplikaty lub niemal-duplikaty.",
  "The goal was to build a reproducible cleaning and duplicate-detection pipeline without deleting the original data. Every record is retained, normalized into a cleaned copy, and any concern is surfaced for human review.": "Celem było zbudowanie odtwarzalnego pipeline'u czyszczenia i wykrywania duplikatów bez usuwania oryginalnych danych. Każdy rekord jest zachowywany, normalizowany do oczyszczonej kopii, a każda wątpliwość jest przedstawiana do przeglądu przez człowieka.",
  "AI helped analyze the structure of the customer dataset, identify possible data-quality problems and inconsistent records, and assist with developing and improving the Python cleaning code.": "AI pomagała analizować strukturę zbioru danych klientów, identyfikować możliwe problemy z jakością danych i niespójne rekordy oraz rozwijać i ulepszać kod czyszczenia w Pythonie.",
  "It also suggested validation rules and edge cases to check, and helped explain and document the cleaning workflow. Final cleaning rules and results were reviewed and validated by a human.": "AI sugerowała również reguły walidacji i przypadki brzegowe do sprawdzenia oraz pomagała wyjaśnić i udokumentować workflow czyszczenia. Ostateczne reguły czyszczenia i wyniki zostały sprawdzone i zatwierdzone przez człowieka.",
  "Dataset analysis": "Analiza zbioru danych",
  "Quality checks": "Kontrole jakości",
  "Python assistance": "Pomoc w Pythonie",
  "Validation rules": "Reguły walidacji",
  "Documentation": "Dokumentacja",
  "AI in the workflow,": "AI w workflow,",
  "not in the runtime.": "nie w działaniu runtime.",
  "Problem analysis": "Analiza problemu",
  "Solution design": "Projekt rozwiązania",
  "AI-assisted implementation": "Implementacja wspierana przez AI",
  "Synthetic data generation": "Generowanie danych syntetycznych",
  "Debugging": "Debugowanie",
  "Code review": "Przegląd kodu",
  "AI supported analysis of the data-quality problem, pipeline design, synthetic test-data generation, initial implementations, edge-case identification, debugging, code review, and documentation improvements. It is not a runtime component and no LLM API is used by this project.": "AI wspierała analizę problemu jakości danych, projekt pipeline'u, generowanie syntetycznych danych testowych, początkowe implementacje, identyfikację przypadków brzegowych, debugowanie, przegląd kodu i ulepszanie dokumentacji. Nie jest komponentem runtime i projekt nie używa API LLM.",
  "The final implementation was tested, reviewed and validated manually.": "Końcowa implementacja została ręcznie przetestowana, sprawdzona i zatwierdzona.",
  "A small, reproducible project structure.": "Mała, odtwarzalna struktura projektu.",
  "Inspect the transformation.": "Sprawdź transformację.",
  "Switch between selected raw rows, their normalized counterparts, and duplicate-report examples. The controls are a frontend demonstration over synthetic samples.": "Przełączaj między wybranymi surowymi wierszami, ich znormalizowanymi odpowiednikami i przykładami z raportu duplikatów. Kontrolki są demonstracją frontendu na syntetycznych próbkach.",
  "Source code": "Kod źródłowy",
  "Explore the full implementation": "Poznaj pełną implementację",
  "A public repository link will be added when the source is published.": "Link do publicznego repozytorium zostanie dodany po publikacji źródła.",
  "Repository coming soon": "Repozytorium wkrótce",
  "Transparent by design.": "Przejrzysty z założenia.",
  "The pipeline processes the full 500-record dataset, preserves every original record, normalizes inconsistent fields, identifies 50 high-confidence duplicate pairs, and flags 41 incomplete or invalid records for review. The 400 figure means records not involved in a duplicate candidate pair—not 400 confirmed unique customers.": "Pipeline przetwarza pełny zbiór 500 rekordów, zachowuje każdy oryginalny rekord, normalizuje niespójne pola, identyfikuje 50 par duplikatów o wysokiej pewności i oznacza 41 niekompletnych lub nieprawidłowych rekordów do przeglądu. Liczba 400 oznacza rekordy nieuczestniczące w parze kandydatów na duplikaty — nie 400 potwierdzonych unikalnych klientów.",
  "Limitations": "Ograniczenia",
  "Duplicate candidates are flagged; the pipeline does not merge records or select a golden customer record.": "Kandydaci na duplikaty są oznaczani; pipeline nie scala rekordów ani nie wybiera nadrzędnego rekordu klienta.",
  "Confidence scores are heuristic rather than trained or statistically calibrated.": "Wyniki pewności są heurystyczne, a nie wytrenowane lub statystycznie skalibrowane.",
  "The design suits small-to-medium CSV datasets; production scale would need stronger blocking/indexing, audit logging, and potentially a human-review interface.": "Projekt pasuje do małych i średnich zbiorów CSV; skala produkcyjna wymagałaby lepszego blokowania/indeksowania, logowania audytowego i potencjalnie interfejsu do przeglądu przez człowieka.",
  "Previous project · Next: Message Classification →": "Poprzedni projekt · Dalej: Klasyfikacja wiadomości →",
  "FRONTEND DEMO": "DEMO FRONTENDU",
  "Data explorer": "Eksplorator danych",
  "Small synthetic samples only. No backend or customer data is exposed.": "Wyłącznie małe próbki syntetyczne. Żadne dane backendu ani klientów nie są ujawniane.",
  "Raw Data": "Surowe dane",
  "Cleaned Data": "Oczyszczone dane",
  "Duplicate Report": "Raport duplikatów",
  "Search sample records": "Szukaj przykładowych rekordów",
  "High-confidence only": "Tylko wysoka pewność",
  "Flagged records only": "Tylko oznaczone rekordy",
  "Record": "Rekord",
  "Name": "Nazwa",
  "Contact / confidence": "Kontakt / pewność",
  "Details": "Szczegóły",
  "FLAGGED": "OZNACZONE",
  "No matching sample records.": "Brak pasujących przykładowych rekordów.",
  "email missing": "brak e-maila",
  "high confidence": "wysoka pewność",
  "same email · same phone · same name + address": "ten sam e-mail · ten sam telefon · ta sama nazwa + adres",
  "same email · same name + address": "ten sam e-mail · ta sama nazwa + adres",
  "same phone · same name + address": "ten sam telefon · ta sama nazwa + adres",
  "AI Development": "Rozwój AI",
  "AI Agents": "Agenci AI",
  "Automation": "Automatyzacja",
  "LLM Applications": "Aplikacje LLM",
  "Data Cleaning": "Czyszczenie danych",
  "Web Scraping": "Web scraping",
  "Document Processing": "Przetwarzanie dokumentów",
  "A structured data-cleaning workflow for inconsistent customer records in a manufacturing context.": "Ustrukturyzowany workflow czyszczenia danych dla niespójnych rekordów klientów w kontekście produkcyjnym.",
  "Customer information can arrive in varied formats, creating duplicates and making everyday data work less reliable.": "Informacje o klientach mogą trafiać w różnych formatach, tworząc duplikaty i obniżając wiarygodność codziennej pracy z danymi.",
  "A Python pipeline is designed to standardize fields, surface possible duplicates and produce clear structured outputs for review.": "Pipeline Python standaryzuje pola, wykrywa możliwe duplikaty i tworzy przejrzyste, ustrukturyzowane wyniki do przeglądu.",
  "A repeatable foundation for transforming messy source data into reviewable, structured datasets and reports.": "Powtarzalna podstawa do przekształcania chaotycznych danych źródłowych w ustrukturyzowane zbiory danych i raporty gotowe do przeglądu.",
  "AI supports exploration of edge cases, implementation options and clearer validation logic while the data workflow remains intentionally engineered and reviewable.": "AI wspiera analizę przypadków brzegowych, wariantów implementacji i czytelniejszej logiki walidacji, a workflow danych pozostaje celowo inżynierski i możliwy do przeglądu.",
  "Marketing teams need a clear way to compare campaign performance and identify the patterns behind meaningful results.": "Zespoły marketingowe potrzebują jasnego sposobu porównywania wyników kampanii i rozpoznawania wzorców stojących za istotnymi rezultatami.",
  "A data-analysis workflow structures campaign metrics, compares performance and produces grounded recommendations for review.": "Workflow analizy danych porządkuje metryki kampanii, porównuje wyniki i tworzy uzasadnione rekomendacje do przeglądu.",
  "A project foundation for surfacing campaign patterns and supporting more informed marketing decisions.": "Podstawa projektu do wykrywania wzorców kampanii i wspierania bardziej świadomych decyzji marketingowych.",
  "AI assists analysis and recommendation generation while final decisions remain with the marketing team.": "AI wspiera analizę i generowanie rekomendacji, a ostateczne decyzje pozostają po stronie zespołu marketingowego.",
  "Important operational data is often locked in PDFs, scans and other document formats that are not immediately ready for analysis or reuse.": "Ważne dane operacyjne są często zamknięte w PDF-ach, skanach i innych formatach dokumentów, które nie są od razu gotowe do analizy lub ponownego użycia.",
  "The workflow combines document reading, OCR where needed and AI-assisted extraction into consistent structured fields.": "Workflow łączy odczytywanie dokumentów, OCR tam, gdzie jest potrzebny, oraz ekstrakcję wspieraną przez AI w spójne pola strukturalne.",
  "A scalable project pattern for making unstructured documents easier to search, validate and integrate into downstream work.": "Skalowalny wzorzec projektu, który ułatwia wyszukiwanie, walidację i integrację nieustrukturyzowanych dokumentów z dalszą pracą.",
  "AI assists with identifying and normalizing meaningful information, while outputs remain designed for validation.": "AI wspiera identyfikowanie i normalizowanie istotnych informacji, a wyniki są nadal projektowane z myślą o walidacji.",
  "A conversational agent that explores entertainment options for travelers through Telegram and voice.": "Konwersacyjny agent, który odkrywa opcje rozrywki dla podróżnych przez Telegram i głos.",
  "Travelers want recommendations that reflect their context, preferences and timing without needing to search across many sources.": "Podróżni chcą rekomendacji odzwierciedlających ich kontekst, preferencje i czas bez konieczności przeszukiwania wielu źródeł.",
  "A Telegram-based agent combines conversation, voice transcription, LLM reasoning and search-enabled recommendations.": "Agent oparty na Telegramie łączy rozmowę, transkrypcję głosu, rozumowanie LLM i rekomendacje wspierane wyszukiwaniem.",
  "A real agent-style project concept that brings multiple AI capabilities into a practical conversational experience.": "Koncepcja rzeczywistego projektu w stylu agenta, łącząca wiele możliwości AI w praktycznym doświadczeniu konwersacyjnym.",
  "AI enables natural-language interaction, voice handling and context-aware recommendation flows, with external information sources used to ground responses.": "AI umożliwia interakcję w języku naturalnym, obsługę głosu i przepływy rekomendacji uwzględniających kontekst, przy wykorzystaniu zewnętrznych źródeł informacji do ugruntowania odpowiedzi.",
  "Campaign": "Kampania",
  "Spend": "Wydatki",
  "Conv. rate": "Wsp. konwersji",
  "Review": "Przegląd",
  "Stable / efficient": "Stabilna / efektywna",
  "Review creative": "Sprawdź kreację",
  "Scale carefully": "Skaluj ostrożnie",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const pathname = usePathname();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const storedLanguage = localStorage.getItem(storageKey);
      setLanguageState(storedLanguage === "pl" ? "pl" : "en");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node = walker.nextNode();

    while (node) {
      if (!node.parentElement?.closest("pre, code, script, style")) textNodes.push(node as Text);
      node = walker.nextNode();
    }

    textNodes.forEach((textNode) => {
      const english = originalText.get(textNode) ?? textNode.textContent ?? "";
      originalText.set(textNode, english);
      if (!english.trim()) return;
      textNode.textContent = language === "pl" ? (staticTranslations[english] ?? english) : english;
    });
  }, [language, pathname]);

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem(storageKey, nextLanguage);
    setLanguageState(nextLanguage);
  };

  const translate = (english: string) => language === "pl" ? (staticTranslations[english] ?? english) : english;

  return <LanguageContext.Provider value={{ language, setLanguage, copy: copy[language], translate }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");

  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return <div className="inline-flex rounded-full border border-white/15 bg-white/[.03] p-1 font-mono text-[10px]" aria-label="Language selector"><button type="button" onClick={() => setLanguage("en")} aria-pressed={language === "en"} className={`rounded-full px-2 py-1 transition ${language === "en" ? "bg-cyan-300 text-slate-950" : "text-slate-400 hover:text-white"}`}>EN</button><span className="self-center text-slate-700">|</span><button type="button" onClick={() => setLanguage("pl")} aria-pressed={language === "pl"} className={`rounded-full px-2 py-1 transition ${language === "pl" ? "bg-cyan-300 text-slate-950" : "text-slate-400 hover:text-white"}`}>PL</button></div>;
}

export function LocalizedText({ en, pl }: { en: string; pl: string }) {
  const { language } = useLanguage();
  return language === "pl" ? pl : en;
}

import type { Metadata } from "next";
import { LanguageProvider } from "./components/language-switcher";
import { BackToTop, PageExperience } from "./components/page-experience";
import "./globals.css";

export const metadata: Metadata = {
  title: "LU.AI — AI Developer & Problem Solver",
  description: "A portfolio of practical AI, automation and data-processing projects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body><LanguageProvider><PageExperience>{children}</PageExperience><BackToTop /></LanguageProvider></body></html>;
}

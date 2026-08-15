"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const leaveDurationMs = 180;

function isRouteLink(anchor: HTMLAnchorElement, currentPathname: string) {
  const url = new URL(anchor.href, window.location.href);
  return (
    url.origin === window.location.origin &&
    url.pathname !== currentPathname &&
    !anchor.hasAttribute("download") &&
    anchor.target !== "_blank"
  );
}

export function PageExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const timeout = window.setTimeout(() => setIsLeaving(false), 0);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      if (url.pathname === pathname && url.hash) {
        const target = document.getElementById(url.hash.slice(1));
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
        return;
      }

      if (!isRouteLink(anchor, pathname)) return;

      event.preventDefault();
      setIsLeaving(true);
      window.setTimeout(() => router.push(`${url.pathname}${url.search}${url.hash}`), leaveDurationMs);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, router]);

  return <div key={pathname} className={`page-transition ${isLeaving ? "page-transition-leave" : "page-transition-enter"}`}>{children}</div>;
}

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 480);
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!isVisible) return null;

  return <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-5 right-5 z-40 rounded-full border border-cyan-300/25 bg-[#101827]/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[.1em] text-cyan-100 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-[#17212b] sm:bottom-7 sm:right-7" aria-label="Back to top">↑ Top</button>;
}

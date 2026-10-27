"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** New pages start at the top. Hash links and browser history keep native restoration. */
export default function NavigationScroll() {
  const pathname = usePathname();
  const destination = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, location.href);
      destination.current = url.origin === location.origin && url.pathname !== location.pathname && !url.hash ? url.pathname : null;
    };
    const onHistory = () => { destination.current = null; };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onHistory);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onHistory);
    };
  }, []);

  useLayoutEffect(() => {
    if (destination.current !== pathname) return;
    destination.current = null;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

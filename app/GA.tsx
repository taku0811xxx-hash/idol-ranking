"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function GA() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
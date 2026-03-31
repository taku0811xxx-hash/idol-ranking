"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GA() {
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (window.gtag) {
        window.gtag("config", "G-F52LGM1JDL", {
          page_path: pathname,
        });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
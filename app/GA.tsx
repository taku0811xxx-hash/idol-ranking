"use client";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GA() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("config", "G-F52LGM1JDL", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
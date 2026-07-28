"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RouteTransition() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleLinkClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement;
      const link = target.closest("a");
      if (
        !link ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      const isInternal = destination.origin === current.origin;
      const isSameLocation =
        destination.pathname === current.pathname &&
        destination.search === current.search;

      if (!isInternal || isSameLocation) return;

      setVisible(true);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      safetyTimer.current = setTimeout(() => setVisible(false), 1800);
    }

    document.addEventListener("click", handleLinkClick, true);
    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => setVisible(false), 380);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden={!visible}
      className={`pafta-route-transition ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="pafta-transition-mark">
        <Image
          src="/pafta-icon-192.png"
          alt="PAFTA"
          width={96}
          height={96}
          priority
          className="h-16 w-16 rounded-[1.15rem] sm:h-20 sm:w-20"
        />
        <span className="pafta-transition-line" />
        <span className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-200">
          PAFTA
        </span>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackToolEvent } from "@/lib/analytics";

export default function TrackedHomeLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackToolEvent("home_navigation", "shortcut_opened", {
          label,
          href,
        })
      }
    >
      {children}
    </Link>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellMaxWidth = "7xl" | "4xl" | "3xl" | "md";

const maxWidthClass: Record<PageShellMaxWidth, string> = {
  "7xl": "max-w-7xl",
  "4xl": "max-w-4xl",
  "3xl": "max-w-3xl",
  md: "max-w-md",
};

interface PageShellProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  maxWidth?: PageShellMaxWidth;
}

export function PageShell({
  children,
  className,
  innerClassName,
  maxWidth = "7xl",
}: PageShellProps) {
  return (
    <div className={cn("page-shell", className)}>
      <div className={cn(maxWidthClass[maxWidth], "mx-auto w-full min-w-0", innerClassName)}>
        {children}
      </div>
    </div>
  );
}

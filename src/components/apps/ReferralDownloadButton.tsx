"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { App, AppLink } from "@/types";
import { Button } from "@/components/ui/button";
import { ReferralReminderDialog } from "@/components/apps/ReferralReminderDialog";

interface ReferralDownloadButtonProps {
  app: App;
  link: AppLink;
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "dark";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ReferralDownloadButton({
  app,
  link,
  children,
  className,
  variant = "outline",
  size = "sm",
}: ReferralDownloadButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Button>
      <ReferralReminderDialog
        app={app}
        linkLabel={link.label}
        linkUrl={link.url}
        linkPlatform={link.platform}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

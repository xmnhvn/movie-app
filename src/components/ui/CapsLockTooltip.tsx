import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "./utils";

interface CapsLockTooltipProps {
  show: boolean;
  className?: string;
  text?: string;
  align?: "left" | "center" | "right";
}

export function CapsLockTooltip({
  show,
  className,
  text = "CapsLock is on",
  align = "left",
}: CapsLockTooltipProps) {
  // Positioning helpers
  const positionClass =
    align === "center"
      ? "left-1/2 -translate-x-1/2"
      : align === "right"
        ? "right-2"
        : "left-2";

  const notchPosClass = align === "center" ? "left-1/2 -translate-x-1/2" : align === "right" ? "right-4" : "left-4";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute z-50 top-[calc(100%+6px)]",
        positionClass,
        show ? "opacity-100" : "opacity-0",
        "transition-opacity duration-100",
      )}
    >
      {/* Border notch */}
      <div
        className={cn(
          "absolute -top-2 h-0 w-0 border-l-6 border-r-6 border-b-6 border-transparent border-b-gray-200",
          notchPosClass,
        )}
      />
      {/* Fill notch */}
      <div
        className={cn(
          "absolute -top-[7px] h-0 w-0 border-l-6 border-r-6 border-b-6 border-transparent border-b-white",
          notchPosClass,
        )}
      />
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] leading-none text-gray-900 shadow-lg",
          className,
        )}
      >
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
        <span>{text}</span>
      </div>
    </div>
  );
}

export default CapsLockTooltip;

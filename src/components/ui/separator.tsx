import React from "react";

export function Separator({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`h-px w-full bg-border my-2 ${className}`.trim()}
      role="separator"
      {...props}
    />
  );
}

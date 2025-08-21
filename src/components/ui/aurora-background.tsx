"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col min-h-[80vh] py-12 items-center justify-center bg-gradient-to-br from-background via-muted/10 to-background text-foreground transition-colors duration-300",
          className
        )}
        {...props}
      >
        {/* 简洁的静态背景装饰 */}
        {showRadialGradient && (
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3"></div>
          </div>
        )}
        {children}
      </div>
    </main>
  );
};

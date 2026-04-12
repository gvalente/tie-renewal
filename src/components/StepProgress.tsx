"use client";

import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

export function StepProgress({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto pb-2">
      {steps.map((step, i) => {
        const isComplete = step.number < currentStep;
        const isCurrent = step.number === currentStep;

        return (
          <div key={step.number} className="flex items-center gap-1">
            {i > 0 && (
              <div
                className={`h-px w-4 sm:w-6 ${
                  isComplete ? "bg-terracotta" : "bg-border"
                }`}
              />
            )}
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                  isComplete
                    ? "bg-terracotta text-white shadow-sm"
                    : isCurrent
                    ? "border-2 border-terracotta text-terracotta bg-terracotta/5"
                    : "border border-border text-muted-foreground/50"
                }`}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : step.number}
              </div>
              <span
                className={`text-xs hidden sm:inline ${
                  isCurrent
                    ? "font-semibold text-foreground"
                    : isComplete
                    ? "text-terracotta"
                    : "text-muted-foreground/50"
                }`}
              >
                {step.title}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

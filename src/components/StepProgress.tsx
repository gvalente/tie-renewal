"use client";

import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

export function StepProgress({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <nav aria-label="Renewal guide steps" className="flex items-center gap-1 overflow-x-auto pb-2">
      {steps.map((step, i) => {
        const isComplete = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isClickable = isComplete && !!onStepClick;

        const indicator = (
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
        );

        const label = (
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
        );

        return (
          <div key={step.number} className="flex items-center gap-1">
            {i > 0 && (
              <div
                className={`h-px w-4 sm:w-6 ${
                  isComplete ? "bg-terracotta" : "bg-border"
                }`}
              />
            )}
            {isClickable ? (
              <button
                type="button"
                onClick={() => onStepClick(step.number)}
                aria-label={`Go back to step ${step.number}: ${step.title}`}
                aria-current={isCurrent ? "step" : undefined}
                className="flex items-center gap-1.5 whitespace-nowrap hover:opacity-80 transition-opacity"
              >
                {indicator}
                {label}
              </button>
            ) : (
              <div
                aria-current={isCurrent ? "step" : undefined}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                {indicator}
                {label}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

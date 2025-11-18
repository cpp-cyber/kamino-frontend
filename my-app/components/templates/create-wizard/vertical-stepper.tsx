"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface VerticalStepperProps {
  activeStep: number;
  completedSteps: number[];
}

export default function VerticalStepper({
  activeStep,
  completedSteps,
}: VerticalStepperProps) {
  const steps = [
    { id: 1, title: "Template Name", description: "Name your template" },
    { id: 2, title: "Router Option", description: "Configure networking" },
    { id: 3, title: "Select VMs", description: "Choose VM templates" },
    { id: 4, title: "Review", description: "Confirm configuration" },
  ];

  const getStepState = (
    stepId: number,
  ): "completed" | "active" | "inactive" | "future" => {
    if (completedSteps.includes(stepId)) return "completed";
    if (stepId === activeStep) return "active";
    if (stepId < activeStep) return "inactive";
    return "future";
  };

  return (
    <div className="flex flex-col h-full justify-between py-2">
      {steps.map((step, index) => {
        const state = getStepState(step.id);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex gap-3 flex-1">
            {/* Indicator column */}
            <div className="flex flex-col items-center">
              {/* Circle indicator */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  state === "completed" &&
                    "border-primary bg-primary text-primary-foreground",
                  state === "active" &&
                    "border-primary bg-background text-primary",
                  (state === "inactive" || state === "future") &&
                    "border-muted-foreground/30 bg-background text-muted-foreground",
                )}
              >
                {state === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 my-2 transition-all",
                    state === "completed"
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                  )}
                />
              )}
            </div>

            {/* Content column */}
            <div className="flex flex-col pt-1">
              <h3
                className={cn(
                  "text-sm font-medium transition-colors",
                  state === "active" && "text-foreground",
                  state === "completed" && "text-foreground",
                  (state === "inactive" || state === "future") &&
                    "text-muted-foreground",
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "text-xs transition-colors",
                  state === "active" && "text-muted-foreground",
                  state === "completed" && "text-muted-foreground",
                  (state === "inactive" || state === "future") &&
                    "text-muted-foreground/70",
                )}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

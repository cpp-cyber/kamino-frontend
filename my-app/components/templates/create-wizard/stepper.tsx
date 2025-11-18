"use client";

import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from "@/components/ui/stepper";

interface CreateTemplateStepperProps {
  activeStep: number;
  onStepChange: (step: number) => void;
  completedSteps: number[];
}

export default function CreateTemplateStepper({
  activeStep,
  onStepChange,
  completedSteps,
}: CreateTemplateStepperProps) {
  const steps = [
    { id: 1, title: "Template Name" },
    { id: 2, title: "Router Option" },
    { id: 3, title: "Select VMs" },
    { id: 4, title: "Review" },
  ];

  return (
    <Stepper value={activeStep} onValueChange={onStepChange}>
      {steps.map((step, index) => (
        <>
          <StepperItem
            key={step.id}
            step={step.id}
            completed={completedSteps.includes(step.id)}
          >
            <StepperTrigger>
              <StepperIndicator />
              <StepperTitle>{step.title}</StepperTitle>
            </StepperTrigger>
          </StepperItem>
          {index < steps.length - 1 && <StepperSeparator />}
        </>
      ))}
    </Stepper>
  );
}

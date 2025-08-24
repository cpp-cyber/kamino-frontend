"use client"

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

const steps = [
  {
    step: 1,
    title: "Select Template",
    description: "Choose a template from available options",
  },
  {
    step: 2,
    title: "Configure Details", 
    description: "Add description, image, and VM count",
  },
  {
    step: 3,
    title: "Publish Settings",
    description: "Set visibility and publish template",
  },
]

interface PublishTemplateStepperProps {
  activeStep: number
  onStepChange?: (step: number) => void
  completedSteps?: number[]
}

export default function PublishTemplateStepper({ 
  activeStep = 1, 
  onStepChange,
  completedSteps = []
}: PublishTemplateStepperProps) {
  return (
    <div className="space-y-8 text-center py-10">
      <Stepper value={activeStep} onValueChange={onStepChange}>
        {steps.map(({ step, title, description }) => {
          // A step is only completed if it's in completedSteps AND we're past it
          const isCompleted = completedSteps.includes(step) && activeStep > step
          
          return (
            <StepperItem
              key={step}
              step={step}
              completed={isCompleted}
              className="relative flex-1 flex-col!"
            >
              <StepperTrigger className="flex-col gap-3 rounded">
                <StepperIndicator />
                <div className="space-y-0.5 px-2">
                  <StepperTitle>{title}</StepperTitle>
                  <StepperDescription className="max-sm:hidden">
                    {description}
                  </StepperDescription>
                </div>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
              )}
            </StepperItem>
          )
        })}
      </Stepper>
    </div>
  )
}

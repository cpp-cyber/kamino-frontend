"use client";

import { useState, useEffect, useCallback } from "react";
import { createKaminoTemplateInProxmox, getProxmoxTemplates } from "@/lib/api";
import { VirtualMachine } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VerticalStepper from "./vertical-stepper";
import { StepOne } from "./step-one";
import { StepTwo } from "./step-two";
import { StepFour } from "./step-four";
import { StepFive } from "./step-five";
import { SuccessStep } from "./success-step";

interface SelectedVM {
  vmid: number;
  node: string;
  quantity: number;
}

interface VMInstance {
  node: string;
  vmid: number;
  customName: string;
  originalName: string;
}

export function TemplateCreateWizard() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form data
  const [templateName, setTemplateName] = useState("");
  const [addRouter, setAddRouter] = useState(true);
  const [selectedVMs, setSelectedVMs] = useState<SelectedVM[]>([]);
  const [vmInstances, setVmInstances] = useState<VMInstance[]>([]);

  // Available templates for review step
  const [availableTemplates, setAvailableTemplates] = useState<
    VirtualMachine[]
  >([]);

  // Load available templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getProxmoxTemplates();
        setAvailableTemplates(data.templates || []);
      } catch (error) {
        console.error("Failed to load templates:", error);
      }
    };
    loadTemplates();
  }, []);

  // Generate VM instances when selectedVMs changes or moving to step 4
  useEffect(() => {
    if (currentStep === 4) {
      setVmInstances((prevInstances) => {
        const instances: VMInstance[] = [];
        selectedVMs.forEach((vm) => {
          const template = availableTemplates.find((t) => t.vmid === vm.vmid);
          const originalName = template?.name || `VM-${vm.vmid}`;

          for (let i = 0; i < vm.quantity; i++) {
            // Generate default name: if quantity is 1, use just the name, otherwise append number
            const defaultName =
              vm.quantity === 1 ? originalName : `${originalName}-${i + 1}`;

            const existingInstance = prevInstances.find(
              (inst) =>
                inst.vmid === vm.vmid &&
                inst.originalName === originalName &&
                inst.customName.startsWith(originalName),
            );

            instances.push({
              node: vm.node,
              vmid: vm.vmid,
              customName: existingInstance?.customName || defaultName,
              originalName: originalName,
            });
          }
        });
        return instances;
      });
    }
  }, [currentStep, selectedVMs, availableTemplates]);

  // Check if user has unsaved data
  const hasUnsavedData = useCallback(() => {
    return (
      !isSuccess &&
      (templateName !== "" ||
        addRouter !== false ||
        selectedVMs.length > 0 ||
        currentStep > 1)
    );
  }, [isSuccess, templateName, addRouter, selectedVMs.length, currentStep]);

  // Add beforeunload event listener to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedData()) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedData]);

  // Step navigation
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCompletedSteps((prev) => {
        const newCompleted = [...prev];
        if (!newCompleted.includes(currentStep)) {
          newCompleted.push(currentStep);
        }
        return newCompleted;
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Remove the current step from completed steps when going back
      setCompletedSteps((prev) => prev.filter((step) => step < currentStep));
    }
  };

  // Update VM instance custom name
  const updateVMInstanceName = (index: number, newName: string) => {
    setVmInstances((prev) =>
      prev.map((instance, i) =>
        i === index ? { ...instance, customName: newName } : instance,
      ),
    );
  };

  // Form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare data for API - convert vmInstances to the format expected by backend
      const templateData = {
        name: templateName,
        add_router: addRouter,
        vms: vmInstances.map((instance) => ({
          node: instance.node,
          vmid: instance.vmid,
          name: instance.customName,
        })),
      };

      console.log("Creating Kamino template:", templateData);

      // Submit to backend API
      await createKaminoTemplateInProxmox(templateData);
      console.log("Template created successfully!");

      // Mark all steps as completed and show success
      setCompletedSteps([1, 2, 3, 4]);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating template:", error);
      alert(
        `Error creating template: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success without stepper
  if (isSuccess) {
    return <SuccessStep templateName={templateName} />;
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardContent className="p-6">
        <div className="flex gap-8 min-h-[600px]">
          {/* Vertical Stepper - Left Side */}
          <div className="w-48 shrink-0">
            <VerticalStepper
              activeStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          <Separator orientation="vertical" className="h-auto" />

          {/* Step Content - Right Side */}
          <div className="flex-1 min-w-0">
            {currentStep === 1 && (
              <StepOne
                templateName={templateName}
                onTemplateNameChange={setTemplateName}
                onNext={goToNextStep}
              />
            )}

            {currentStep === 2 && (
              <StepTwo
                addRouter={addRouter}
                onAddRouterChange={setAddRouter}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === 3 && (
              <StepFour
                selectedVMs={selectedVMs}
                onSelectedVMsChange={setSelectedVMs}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === 4 && (
              <StepFive
                templateName={templateName}
                addRouter={addRouter}
                vmInstances={vmInstances}
                onUpdateVMName={updateVMInstanceName}
                onSubmit={handleSubmit}
                onBack={goToPreviousStep}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

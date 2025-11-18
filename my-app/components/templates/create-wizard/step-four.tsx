"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorDisplay } from "@/components/ui/error-display";
import { getProxmoxTemplates } from "@/lib/api";
import { VirtualMachine } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SelectedVM {
  vmid: number;
  node: string;
  quantity: number;
}

interface StepFourProps {
  selectedVMs: SelectedVM[];
  onSelectedVMsChange: (vms: SelectedVM[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepFour({
  selectedVMs,
  onSelectedVMsChange,
  onNext,
  onBack,
}: StepFourProps) {
  const [templates, setTemplates] = useState<VirtualMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProxmoxTemplates();
        setTemplates(data.templates || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Proxmox templates",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const isVMSelected = (vmid: number): boolean => {
    return selectedVMs.some((vm) => vm.vmid === vmid);
  };

  const getVMQuantity = (vmid: number): number => {
    const vm = selectedVMs.find((vm) => vm.vmid === vmid);
    return vm?.quantity || 1;
  };

  const toggleVM = (vmid: number, checked: boolean) => {
    if (checked) {
      const template = templates.find((t) => t.vmid === vmid);
      const node = template?.node || "";
      onSelectedVMsChange([...selectedVMs, { vmid, node, quantity: 1 }]);
    } else {
      onSelectedVMsChange(selectedVMs.filter((vm) => vm.vmid !== vmid));
    }
  };

  const updateQuantity = (vmid: number, quantity: number) => {
    // Ensure quantity is between 1 and 3
    const clampedQuantity = Math.max(1, Math.min(3, quantity));
    onSelectedVMsChange(
      selectedVMs.map((vm) =>
        vm.vmid === vmid ? { ...vm, quantity: clampedQuantity } : vm,
      ),
    );
  };

  const handleNext = () => {
    onNext();
  };

  const handleCardClick = (vmid: number) => {
    toggleVM(vmid, !isVMSelected(vmid));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner message="Loading available Proxmox templates..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <ErrorDisplay error={error} />
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Select Virtual Machines (Optional)
        </h2>
        <p className="text-muted-foreground mt-1">
          Choose from available Proxmox templates and set quantities (max 3 per
          template), or skip to continue without VMs
        </p>
      </div>

      <Separator className="mb-6" />

      <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
        {templates.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No Proxmox templates are currently available. Please create
              template VMs in Proxmox first.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3 overflow-y-auto pr-2 flex-1">
            {templates.map((template) => (
              <div
                key={template.vmid}
                className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer select-none"
                onClick={() => handleCardClick(template.vmid)}
              >
                <div className="flex items-center space-x-4 flex-1 pointer-events-none">
                  <Checkbox
                    checked={isVMSelected(template.vmid)}
                    className="pointer-events-auto"
                    onCheckedChange={(checked) =>
                      toggleVM(template.vmid, checked as boolean)
                    }
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-base font-medium">{template.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {template.maxcpu} vCPU
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(template.maxmem / 1024 / 1024 / 1024)} GB
                        RAM
                      </Badge>
                    </div>
                  </div>
                </div>
                {isVMSelected(template.vmid) && (
                  <div
                    className="flex items-center space-x-2 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm whitespace-nowrap">Quantity:</span>
                    <Input
                      type="number"
                      min="1"
                      max="3"
                      value={getVMQuantity(template.vmid)}
                      onChange={(e) =>
                        updateQuantity(
                          template.vmid,
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="w-20"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Network, Server, Edit2 } from "lucide-react";
import { useState } from "react";

interface VMInstance {
  node: string;
  vmid: number;
  customName: string;
  originalName: string;
}

interface StepFiveProps {
  templateName: string;
  addRouter: boolean;
  vmInstances: VMInstance[];
  onUpdateVMName: (index: number, newName: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function StepFive({
  templateName,
  addRouter,
  vmInstances,
  onUpdateVMName,
  onSubmit,
  onBack,
  isSubmitting,
}: StepFiveProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const totalVMs = vmInstances.length;

  const handleNameChange = (index: number, newName: string) => {
    const sanitizedName = newName
      .replace(/ /g, "-")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .replace(/^[-]+/, "");
    onUpdateVMName(index, sanitizedName);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
  };

  const handleBlur = (index: number, currentValue: string) => {
    // If the value is blank/empty, revert to original template name
    if (currentValue.trim() === "") {
      onUpdateVMName(index, vmInstances[index].originalName);
    }
    setEditingIndex(null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    currentValue: string,
  ) => {
    if (e.key === "Enter") {
      // If the value is blank/empty, revert to original template name
      if (currentValue.trim() === "") {
        onUpdateVMName(index, vmInstances[index].originalName);
      }
      setEditingIndex(null);
    } else if (e.key === "Escape") {
      setEditingIndex(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Review Template Configuration
        </h2>
        <p className="text-muted-foreground mt-1">
          Review your template configuration and customize VM names before
          creating
        </p>
      </div>

      <Separator className="mb-6" />

      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Template Name */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Template Name
          </h3>
          <p className="text-base font-semibold">{templateName}</p>
        </div>

        <Separator />

        {/* Router Option */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Router Configuration
          </h3>
          <div className="flex items-center gap-2">
            {addRouter ? (
              <>
                <Network className="h-4 w-4 text-green-600" />
                <span className="text-base">
                  Router will be automatically added
                </span>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-300"
                >
                  Enabled
                </Badge>
              </>
            ) : (
              <>
                <Network className="h-4 w-4 text-muted-foreground" />
                <span className="text-base">No router will be added</span>
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-300"
                >
                  Disabled
                </Badge>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Selected VMs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Virtual Machines
            </h3>
            <Badge variant="secondary">
              {totalVMs} VM{totalVMs !== 1 ? "s" : ""}
            </Badge>
          </div>
          {totalVMs === 0 ? (
            <div className="rounded-lg border p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                No virtual machines selected
              </p>
            </div>
          ) : (
            <div className="space-y-2 rounded-lg border p-4 bg-muted/30">
              {vmInstances.map((instance, index) => (
                <div
                  key={`${instance.vmid}-${index}`}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-background transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Server className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      {editingIndex === index ? (
                        <Input
                          value={instance.customName}
                          onChange={(e) =>
                            handleNameChange(index, e.target.value)
                          }
                          onBlur={() => handleBlur(index, instance.customName)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, index, instance.customName)
                          }
                          autoFocus
                          className="h-8 text-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <p className="text-sm font-medium truncate">
                            {instance.customName}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4"
                            onClick={() => handleEditClick(index)}
                          >
                            <Edit2 className="size-3" />
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {instance.originalName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating Template..." : "Create Template"}
        </Button>
      </div>
    </div>
  );
}

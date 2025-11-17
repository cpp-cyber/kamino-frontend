"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface StepTwoProps {
  addRouter: boolean;
  onAddRouterChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepTwo({
  addRouter,
  onAddRouterChange,
  onNext,
  onBack,
}: StepTwoProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Router Configuration
        </h2>
        <p className="text-muted-foreground mt-1">
          Choose whether to automatically include a router in this template
        </p>
      </div>

      <Separator className="mb-6" />

      <div className="space-y-6 flex-1">
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="add-router" className="text-base font-medium">
              Add Router (Recommended)
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically add a router VM to provide networking for this
              template
            </p>
          </div>
          <Switch
            id="add-router"
            checked={addRouter}
            onCheckedChange={onAddRouterChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

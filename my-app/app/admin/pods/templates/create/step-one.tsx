"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";
import { getProxmoxTemplateNames } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface StepOneProps {
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  onNext: () => void;
}

export function StepOne({
  templateName,
  onTemplateNameChange,
  onNext,
}: StepOneProps) {
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExistingNames = async () => {
      try {
        setLoading(true);
        setError(null);
        const names = await getProxmoxTemplateNames();
        setExistingNames(names);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load existing template names",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExistingNames();
  }, []);

  const isNameTaken =
    templateName.trim() !== "" && existingNames.includes(templateName.trim());
  const isValid = templateName.trim() !== "" && !isNameTaken;

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner message="Loading existing template names..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Template Name</h2>
        <p className="text-muted-foreground mt-1">
          Enter a unique name for your new Kamino template
        </p>
      </div>

      <Separator className="mb-6" />

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            placeholder="e.g., CIS4670_01_Lab1"
            value={templateName}
            onChange={(e) => {
              const value = e.target.value
                .replace(/ /g, "_")
                .replace(/[^a-zA-Z0-9_]/g, "")
                .replace(/^_+/, "");
              onTemplateNameChange(value);
            }}
            autoFocus
            className={
              isNameTaken
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {isNameTaken && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              This template name already exists in Proxmox
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Choose a descriptive name that clearly indicates the purpose of
              this template. This name will be used to identify the template
              throughout the system.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleNext} disabled={!isValid}>
          Next
        </Button>
      </div>
    </div>
  );
}

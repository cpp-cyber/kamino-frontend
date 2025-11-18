"use client";

import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { CreatorPageLayout } from "@/app/creator/creator-page-layout";
import { PodTemplateTable } from "@/components/templates/templates-table/templates-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTemplate, toggleTemplateVisibility } from "@/lib/api";

const breadcrumbs = [{ label: "Pod Templates", href: "/creator/templates" }];

// Template API functions
const templateVisibility = async (templateName: string) => {
  await toggleTemplateVisibility(templateName);
  console.log(`Toggled template: ${templateName}`);
  return Promise.resolve();
};

const deletePodTemplate = async (templateName: string) => {
  await deleteTemplate(templateName);
  console.log(`Delete template: ${templateName}`);
  return Promise.resolve();
};

export default function CreatorPodTemplatePage() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    name: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleTemplateAction = async (
    templateName: string,
    action: "toggle" | "delete",
  ) => {
    // If toggling visibility, call API immediately and avoid confirmation dialog.
    if (action === "toggle") {
      setIsProcessing(true);
      try {
        await templateVisibility(templateName);
        toast.success(`Template "${templateName}" has been toggled`);
        triggerRefresh(); // Refresh the table
      } catch (error) {
        toast.error(
          `Failed to toggle template: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // For destructive actions (delete), show confirmation dialog.
    setSelectedTemplate({ name: templateName });
    setAlertOpen(true);
  };

  const handleConfirmTemplateAction = async () => {
    if (!selectedTemplate) return;

    // Dialog is only used for deletes now
    setIsProcessing(true);
    try {
      await deletePodTemplate(selectedTemplate.name);
      toast.success(`Template "${selectedTemplate.name}" has been deleted`);
      setAlertOpen(false);
      setSelectedTemplate(null);
      triggerRefresh(); // Refresh the table
    } catch (error) {
      toast.error(
        `Failed to delete template: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AuthGuard creatorOrAdmin>
      <CreatorPageLayout breadcrumbs={breadcrumbs}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Pod Templates
              </h1>
              <p className="text-muted-foreground">
                Manage all pod templates on Proxmox
              </p>
            </div>
            <PodTemplateTable
              onTemplateAction={handleTemplateAction}
              refreshKey={refreshKey}
            />
          </div>
        </div>
      </CreatorPageLayout>

      {/* Template Deletion Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete &quot;{selectedTemplate?.name}
              &quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all template personalizations (NOT Proxmox data)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmTemplateAction}
              disabled={isProcessing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  );
}

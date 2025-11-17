"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SuccessStepProps {
  templateName: string;
}

export function SuccessStep({ templateName }: SuccessStepProps) {
  return (
    <Card className="w-full md:w-lg flex-1 mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">
          Template Created Successfully!
        </CardTitle>
        <CardDescription className="text-base">
          Your template &quot;{templateName}&quot; has been created and is now
          available in Proxmox.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

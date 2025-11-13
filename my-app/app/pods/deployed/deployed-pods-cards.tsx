import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CalendarIcon,
  Trash,
  User,
  Cpu,
  HardDrive,
  MemoryStick,
  Clock,
  Boxes,
} from "lucide-react";
import Image from "next/image";
import { DeployedPod } from "@/lib/types";
import {
  formatUptime,
  formatBytes,
  calculateUtilization,
  cn,
  formatPodName,
} from "@/lib/utils";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { IconCircleFilled, IconPlayerPlayFilled } from "@tabler/icons-react";
import { useState, useEffect } from "react";

// Live uptime component that updates every second
function LiveUptime({ initialUptime }: { initialUptime: number }) {
  // Calculate the start time once when component mounts
  const [startTime] = useState(() => Date.now() - initialUptime * 1000);
  const [currentUptime, setCurrentUptime] = useState(initialUptime);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate current uptime based on the fixed start time
      const newUptime = Math.floor((Date.now() - startTime) / 1000);
      setCurrentUptime(newUptime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <span>{formatUptime(currentUptime)}</span>;
}

type SectionCardsProps = {
  pods: DeployedPod[];
  onDelete: (pod: DeployedPod) => void;
};

export function SectionCards({ pods, onDelete }: SectionCardsProps) {
  if (pods.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 py-8">
        <div className="text-muted-foreground">No deployed pods found</div>
      </div>
    );
  }

  return (
    <div>
      {pods.map((pod, index) => {
        const vms = pod.vms || [];

        return (
          <div key={pod.name || index}>
            {/* Main Card */}
            <Card className="overflow-hidden border bg-gradient-to-br from-primary/5 to-muted/5 border-primary/20 shadow-lg">
              <CardContent className="px-8 py-6">
                {/* Header row */}
                <div className="relative flex gap-6 mb-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div className="w-52 h-52 rounded-xl border-2 bg-background overflow-hidden shadow-md ring-2 ring-muted/20">
                      <Image
                        src={
                          pod.template?.image_path
                            ? `/api/v1/template/image/${pod.template.image_path}`
                            : "/kaminoLogo.svg"
                        }
                        alt="Pod Template"
                        className="w-full h-full object-cover"
                        width={208}
                        height={208}
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    {/* Delete Pod Button */}
                    <Button
                      variant="destructive"
                      className="absolute top-0 right-0 gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => onDelete(pod)}
                    >
                      <Trash className="size-4" />
                    </Button>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-medium">
                        Published{" "}
                        {pod.template?.created_at
                          ? new Date(
                              pod.template.created_at,
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : new Date().toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold leading-tight text-foreground tracking-tight">
                      {formatPodName(pod.template?.name || pod.name)}
                    </h1>

                    {/* Pod Stats */}
                    <div className="flex items-center gap-2 pt-2">
                      <Badge
                        variant="secondary"
                        className="gap-2 font-medium shadow"
                      >
                        <Boxes className="h-3 w-3" />
                        {vms.length} {vms.length === 1 ? "VM" : "VMs"}
                      </Badge>
                      {vms.filter((vm) => vm.status === "running").length >
                        0 && (
                        <Badge
                          variant="secondary"
                          className="gap-2 font-medium shadow"
                        >
                          <IconPlayerPlayFilled className="text-green-400" />
                          {
                            vms.filter((vm) => vm.status === "running").length
                          }{" "}
                          Running
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <Accordion
                  type="multiple"
                  defaultValue={["vms", "description"]}
                  className="space-y-4"
                >
                  {/* VMs */}
                  <AccordionItem value="vms" className="border-b-0">
                    <AccordionTrigger className="justify-start gap-3 py-2 text-xl font-semibold text-foreground hover:no-underline rounded-b-none border-b pb-4 [&>svg]:-order-1 items-center">
                      Virtual Machines
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {vms.length > 0 ? (
                          vms.map((vm) => (
                            <Link
                              key={vm.vmid}
                              href={`https://gonk.sdc.cpp:8006/#v1:0:=qemu%2F${vm.vmid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block group"
                            >
                              <Card className="h-full transition-all duration-200 bg-gradient-to-br from-primary/5 hover:shadow-lg border-2 hover:border-primary/20 cursor-pointer">
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <IconCircleFilled
                                        className={cn(
                                          "h-3 w-3 flex-shrink-0",
                                          vm.status === "running"
                                            ? "text-green-400"
                                            : vm.status === "stopped"
                                              ? "text-red-400"
                                              : "text-yellow-400",
                                        )}
                                      />
                                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                                        {vm.name}
                                      </h3>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className={cn(
                                        "font-medium",
                                        vm.status === "running" &&
                                          "border-green-400/40",
                                        vm.status === "stopped" &&
                                          "border-red-400/40",
                                      )}
                                    >
                                      <Clock />
                                      <LiveUptime initialUptime={vm.uptime} />
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="space-y-4">
                                    {/* CPU Usage */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                          <Cpu className="size-4" />
                                          <span className="font-medium">
                                            CPU
                                          </span>
                                        </div>
                                        <span className="text-muted-foreground">
                                          {vm.cpu || vm.cpu === 0
                                            ? `${(vm.cpu * 100).toFixed(1)}%`
                                            : "N/A"}{" "}
                                          of {vm.maxcpu || "N/A"} cores
                                        </span>
                                      </div>
                                      <Progress
                                        value={vm.cpu ? vm.cpu * 100 : 0}
                                        className="h-2"
                                      />
                                    </div>

                                    {/* Memory Usage */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                          <MemoryStick className="size-4" />
                                          <span className="font-medium">
                                            Memory
                                          </span>
                                        </div>
                                        <span className="text-muted-foreground">
                                          {vm.mem ? formatBytes(vm.mem) : "N/A"}{" "}
                                          /{" "}
                                          {vm.maxmem
                                            ? formatBytes(vm.maxmem)
                                            : "N/A"}
                                        </span>
                                      </div>
                                      <Progress
                                        value={
                                          vm.mem && vm.maxmem
                                            ? calculateUtilization(
                                                vm.mem,
                                                vm.maxmem,
                                              )
                                            : 0
                                        }
                                        className="h-2"
                                      />
                                    </div>

                                    {/* Storage Total */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                          <HardDrive className="size-4" />
                                          <span className="font-medium">
                                            Storage
                                          </span>
                                        </div>
                                        <span className="text-muted-foreground">
                                          {vm.maxdisk
                                            ? formatBytes(vm.maxdisk)
                                            : "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))
                        ) : (
                          <div className="col-span-full">
                            <Card className="border-dashed">
                              <CardContent className="flex items-center justify-center py-8">
                                <p className="text-sm text-muted-foreground">
                                  No virtual machines found
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 text-center italic">
                        Click on any virtual machine to open it in Proxmox
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Description */}
                  <AccordionItem value="description">
                    <AccordionTrigger className="justify-start gap-3 py-0 text-xl font-semibold text-foreground hover:no-underline rounded-b-none border-b pb-4 [&>svg]:-order-1 items-center">
                      Description
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card className="h-fit mt-4 bg-gradient-to-br from-primary/5">
                        <CardContent className="">
                          {pod.template?.description ? (
                            pod.template.description.length > 1000 ? (
                              <ScrollArea className="h-96 w-full rounded-md">
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                  <MarkdownRenderer
                                    content={pod.template.description}
                                    variant="compact"
                                  />
                                </div>
                              </ScrollArea>
                            ) : (
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <MarkdownRenderer
                                  content={pod.template.description}
                                />
                              </div>
                            )
                          ) : (
                            <div className="flex items-center justify-center py-8 text-muted-foreground">
                              <span className="italic">
                                No description available
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Footer section */}
                <div className="mt-8 -mb-4 pt-6 border-t border-muted">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted shadow">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Authors</p>
                      {pod.template?.authors ? (
                        <p className="font-medium text-foreground">
                          {pod.template.authors}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No authors specified
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

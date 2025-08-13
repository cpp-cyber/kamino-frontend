"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { RocketIcon, ServerIcon, CalendarIcon } from "lucide-react"
import Image from "next/image"
import { PodTemplate } from "@/lib/types"

type SectionCardsProps = {
  pods: PodTemplate[]
  onDeploy: (pod: PodTemplate) => void
}

export function SectionCards({ pods, onDeploy }: SectionCardsProps) {
  return (
    <section className="mx-auto max-w-7xl py-8">
      <div className="container">
        {pods.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">No pods available</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {pods.map((pod, index) => (
              <TemplateCard key={pod.name || index} template={pod} onDeploy={onDeploy} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Template card component
function TemplateCard({ template, onDeploy }: { template: PodTemplate; onDeploy: (template: PodTemplate) => void }) {
  return (
    <div 
      className="opacity-100 hover:opacity-95 transition-all duration-300 group h-[480px] w-full max-w-xl overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl border cursor-pointer"
      onClick={() => onDeploy(template)}
    >
      {/* Pod Image */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-full h-full relative overflow-hidden">
            <Image 
              src="/kaminoLogo.svg" 
              alt="Kamino Logo" 
              fill
              className="object-cover object-top opacity-15 transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
          </div>
        </div>
      </div>

      {/* Pod Content */}
      <div className="flex h-[280px] flex-col p-6">
        
        {/* Pod Release Date */}
        {template.created_at && (
          <div className="mb-1 -mt-2 flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="mr-1.5 h-4 w-4" />
            {new Date(template.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}

        {/* Pod Name */}
        <h3 className="mb-3 text-2xl font-bold">{template.name}</h3>
        
        {/* Pod Description */}
        <ScrollArea 
          className="mb-4 text-sm text-muted-foreground line-clamp-4 leading-relaxed cursor-text"
          onClick={(e) => e.stopPropagation()}
        >
          {template.description || 'No description available'}
        </ScrollArea>

        {/* Pod Stats */}
        <div className="mt-auto pt-1">
          <div className="flex items-center rounded-lg bg-muted/50 p-3">
            
            {/* VMs */}
            <div className="flex-1 flex justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="text-sm font-bold mb-1">{(template.vms || []).length}</div>
                <div className="flex items-center space-x-1">
                  <ServerIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {(template.vms || []).length === 1 ? "VM" : "VMs"}
                  </span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-border" />
            
            {/* Deployments */}
            <div className="flex-1 flex justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="text-sm font-bold mb-1">{template.deployments || 'N/A'}</div>
                <div className="flex items-center space-x-1">
                  <RocketIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {template.deployments === 1 ? "Deployment" : "Deployments"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

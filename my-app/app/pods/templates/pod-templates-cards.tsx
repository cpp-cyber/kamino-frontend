"use client"

import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { RocketIcon, ServerIcon } from "lucide-react"
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
              src={template.image_path ? `/api/v1/template/image/${template.image_path}` : '/kaminoLogo.svg'}
              alt={template.name}
              fill
              unoptimized
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
          </div>
        </div>
      </div>

      {/* Pod Content */}
      <div className="flex h-[280px] flex-col p-6">

        {/* Pod Name */}
        <h3 className="mb-1 text-2xl font-bold">{template.name.replaceAll('_', ' ')}</h3>
        
        {/* Pod Description */}
        <div className="mb-3 text-base text-muted-foreground leading-relaxed h-[110px] overflow-hidden">
          <div className="h-full relative">
            <MarkdownRenderer
              content={template.description || 'No description available'}
              variant="card"
              className="h-full overflow-hidden"
            />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Authors */}
        {template.authors && (
          <div className="mb-3 text-sm">
            <span className="text-muted-foreground">Authors: </span>
            <span className="text-foreground font-medium">{template.authors}</span>
          </div>
        )}

        {/* Pod Stats */}
        <div className="mt-auto pt-1">
          <div className="flex items-center rounded-lg bg-muted/50 p-3">
            
            {/* VMs */}
            <div className="flex-1 flex justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="text-sm font-bold mb-1">{template.vm_count}</div>
                <div className="flex items-center space-x-1">
                  <ServerIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {(template.vm_count || 0) === 1 ? "VM" : "VMs"}
                  </span>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-border" />
            
            {/* Deployments */}
            <div className="flex-1 flex justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="text-sm font-bold mb-1">{template.deployments}</div>
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

"use client"

import { Calendar, RocketIcon, ServerIcon, User } from "lucide-react"
import Image from "next/image"
import { PodTemplate } from "@/lib/types"
import { formatPodName } from "@/lib/utils"

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
      className="opacity-100 hover:opacity-95 transition-all duration-300 group h-[480px] w-full max-w-xl overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-muted/5 border-primary/20 shadow-lg hover:shadow-xl border cursor-pointer"
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

        {/* Date, title, & authors */}
        <div className="flex-1 flex flex-col">
          {template.created_at && (
            <p className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1.5 h-4 w-4" />
            {new Date(template.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            </p>
          )}
          <h1 className="text-3xl font-semibold leading-tight text-wrap py-2">
            {formatPodName(template.name)}
          </h1>
          {template.authors && (
            <div className="flex items-center text-sm">
              <User className="text-muted-foreground mr-1.5 size-4" />
              <span className="text-muted-foreground">{template.authors}</span>
            </div>
          )}
        </div>

        {/* Pod Stats */}
        <div className="mt-auto pt-1">
          <div className="flex items-center rounded-lg bg-muted/50 shadow-md p-3">
            
            {/* VMs */}
            <div className="flex-1 flex justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="text-lg font-bold mb-1">{template.vm_count}</div>
                <div className="flex items-center space-x-1">
                  <ServerIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
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
                <div className="text-lg font-bold mb-1">{template.deployments}</div>
                <div className="flex items-center space-x-1">
                  <RocketIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
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

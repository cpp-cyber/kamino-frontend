"use client"

import * as React from "react"
import { SearchIcon, MoreVertical, EyeOff, Trash2, RefreshCcw, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { PodTemplate } from "@/lib/types"
import { getAllPodTemplates } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PodTemplateStatusBadge } from "@/components/status-badges"
import { EditTemplateDialog } from "./edit-template-dialog"

interface PodTemplateTableProps {
  onTemplateAction: (templateName: string, action: 'toggle' | 'delete') => void
  refreshKey?: number
}

export function PodTemplateTable({ onTemplateAction, refreshKey }: PodTemplateTableProps) {
  const [podTemplates, setPodTemplates] = React.useState<PodTemplate[]>([])
  const [filteredPodTemplates, setFilteredPodTemplates] = React.useState<PodTemplate[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<PodTemplate | null>(null)

  React.useEffect(() => {
    loadPodTemplates()
  }, [refreshKey])

  const loadPodTemplates = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAllPodTemplates()
      setPodTemplates(data)
      setFilteredPodTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pod templates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTemplate = (template: PodTemplate) => {
    setSelectedTemplate(template)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    loadPodTemplates()
  }

  React.useEffect(() => {
    const filtered = podTemplates.filter((template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPodTemplates(filtered)
  }, [searchTerm, podTemplates])

  const totalItems = filteredPodTemplates.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading pod templates..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadPodTemplates} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border">
        <div className="bg-muted p-4 border-b rounded-t-md">
          <div className="flex items-center justify-between space-x-2">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-background"
              />
            </div>
            {searchTerm && (
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {totalItems} result{totalItems !== 1 ? 's' : ''}
              </div>
            )}
            <Button onClick={loadPodTemplates} variant="outline">
              <RefreshCcw className="h-4 w-4" />
              <span className="hidden lg:inline">Refresh</span>
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead className="px-4 py-3">
                <span className="font-medium">Name</span>
              </TableHead>
              <TableHead className="py-3">
                <span className="font-medium">Deployments</span>
              </TableHead>
              <TableHead className="py-3">
                <span className="font-medium">Status</span>
              </TableHead>
              <TableHead className="py-3">
                <span className="font-medium">Published</span>
              </TableHead>
              <TableHead className="text-end px-4 py-3">
                <span className="font-medium">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPodTemplates.length === 0 && (
              <TableRow key="empty-state">
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No Pod Templates found matching your search.' : 'No Pod Templates found.'}
                </TableCell>
              </TableRow>
            )}
            {filteredPodTemplates.map((podTemplate) => (
              <TableRow key={podTemplate.name}>
                <TableCell className="font-medium px-4">{podTemplate.name}</TableCell>
                <TableCell>{podTemplate.deployments}</TableCell>
                <TableCell>
                  <PodTemplateStatusBadge status={podTemplate.template_visible === true ? 'public' : 'hidden'} />
                </TableCell>
                <TableCell>
                    {podTemplate.created_at ? new Date(podTemplate.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </TableCell>
                <TableCell  className="text-end px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditTemplate(podTemplate)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onTemplateAction(podTemplate.name, 'toggle')}
                        className="cursor-pointer"
                      >
                        {podTemplate.template_visible === true ? (
                          <EyeOff className="mr-2" />
                        ) : (
                          <Eye className="mr-2" />
                        )}
                        {podTemplate.template_visible === true ? 'Hide' : 'Show'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onTemplateAction(podTemplate.name, 'delete')}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Template Dialog */}
      <EditTemplateDialog
        template={selectedTemplate}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

    </div>
  )
}

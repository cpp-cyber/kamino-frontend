"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getAllPodTemplates, getAllUsers, getGroups, clonePodTemplates } from "@/lib/api"
import { PodTemplate, User, Group } from "@/lib/types"
import { Rocket, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeployPodDialogProps {
  onPodDeployed?: () => void
  trigger?: React.ReactNode
}

// Custom Horizontal Stepper Component
interface StepProps {
  stepNumber: number
  isActive: boolean
  isCompleted: boolean
  isClickable: boolean
  onClick: () => void
  isLast?: boolean
}

function Step({ stepNumber, isActive, isCompleted, isClickable, onClick, isLast }: StepProps) {
  return (
    <div className="flex items-center">
      <button
        onClick={onClick}
        disabled={!isClickable}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-colors",
          isActive && "border-primary bg-primary text-primary-foreground",
          isCompleted && !isActive && "border-primary bg-primary text-primary-foreground",
          !isActive && !isCompleted && "border-muted-foreground bg-background text-muted-foreground",
          isClickable && "cursor-pointer hover:border-primary",
          !isClickable && "cursor-not-allowed opacity-50"
        )}
      >
        {isCompleted && !isActive ? (
          <Check className="w-5 h-5" />
        ) : (
          stepNumber
        )}
      </button>
      {!isLast && (
        <div className={cn(
          "h-0.5 w-16 mx-4",
          isCompleted ? "bg-primary" : "bg-muted"
        )} />
      )}
    </div>
  )
}

export function DeployPodDialog({ onPodDeployed, trigger }: DeployPodDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [templates, setTemplates] = useState<PodTemplate[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [groupSearch, setGroupSearch] = useState("")
  const hasLoadedDataRef = useRef(false)

  // Filter users and groups based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  )
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(groupSearch.toLowerCase())
  )

  // Select all state helpers
  const filteredUserNames = filteredUsers.map(user => user.name)
  const filteredGroupNames = filteredGroups.map(group => group.name)
  const allUsersSelected = filteredUserNames.length > 0 && filteredUserNames.every(name => selectedUsers.includes(name))
  const allGroupsSelected = filteredGroupNames.length > 0 && filteredGroupNames.every(name => selectedGroups.includes(name))

  // Load data when dialog opens
  useEffect(() => {
    if (isDialogOpen && !hasLoadedDataRef.current) {
      console.log('Loading data for deploy pod dialog...')
      hasLoadedDataRef.current = true
      setIsLoading(true)
      Promise.all([
        getAllPodTemplates(),
        getAllUsers(),
        getGroups()
      ]).then(([templatesRes, usersRes, groupsRes]) => {
        console.log('Data loaded successfully:', {
          templates: templatesRes.length,
          users: usersRes.users.length,
          groups: groupsRes.groups.length
        })
        setTemplates(templatesRes)
        setUsers(usersRes.users)
        setGroups(groupsRes.groups)
      }).catch((error) => {
        console.error('Failed to load data:', error)
        toast.error('Failed to load templates and user data')
        hasLoadedDataRef.current = false // Reset on error so user can retry
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }, [isDialogOpen])

  const handleUserToggle = (username: string) => {
    setSelectedUsers(prev => 
      prev.includes(username) 
        ? prev.filter(u => u !== username)
        : [...prev, username]
    )
  }

  const handleGroupToggle = (groupName: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

  const handleSelectAllUsers = () => {
    const filteredUserNames = filteredUsers.map(user => user.name)
    const allSelected = filteredUserNames.every(name => selectedUsers.includes(name))
    
    if (allSelected) {
      // Remove all filtered users from selection
      setSelectedUsers(prev => prev.filter(name => !filteredUserNames.includes(name)))
    } else {
      // Add all filtered users to selection
      const newSelection = [...new Set([...selectedUsers, ...filteredUserNames])]
      setSelectedUsers(newSelection)
    }
  }

  const handleSelectAllGroups = () => {
    const filteredGroupNames = filteredGroups.map(group => group.name)
    const allSelected = filteredGroupNames.every(name => selectedGroups.includes(name))
    
    if (allSelected) {
      // Remove all filtered groups from selection
      setSelectedGroups(prev => prev.filter(name => !filteredGroupNames.includes(name)))
    } else {
      // Add all filtered groups to selection
      const newSelection = [...new Set([...selectedGroups, ...filteredGroupNames])]
      setSelectedGroups(newSelection)
    }
  }

  const resetForm = () => {
    setCurrentStep(0)
    setSelectedTemplate("")
    setSelectedUsers([])
    setSelectedGroups([])
    setUserSearch("")
    setGroupSearch("")
    hasLoadedDataRef.current = false // Reset data loading flag
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault()
    console.log('handleNext called, currentStep:', currentStep)
    if (currentStep < 3) {
      console.log('Moving to step:', currentStep + 1)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 0: // Template selection
        return !!selectedTemplate
      case 1: // User selection
        return true // Can skip user selection
      case 2: // Group selection
        return true // Can skip group selection
      case 3: // Confirmation
        return true
      default:
        return false
    }
  }

  const canFinish = () => {
    return selectedTemplate && (selectedUsers.length > 0 || selectedGroups.length > 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handleSubmit called, currentStep:', currentStep)
    
    // Only allow submission on the final confirmation step
    if (currentStep !== 3) {
      console.log('Blocked submission - not on final step')
      return
    }
    
    if (!selectedTemplate) {
      toast.error("Please select a template")
      return
    }

    if (selectedUsers.length === 0 && selectedGroups.length === 0) {
      toast.error("Please select at least one user or group")
      return
    }

    console.log('Proceeding with deployment...')
    setIsSubmitting(true)
    try {
      await clonePodTemplates(selectedTemplate, selectedUsers, selectedGroups)
      
      const targetCount = selectedUsers.length + selectedGroups.length
      toast.success(`Successfully deployed "${selectedTemplate}" to ${targetCount} target${targetCount === 1 ? '' : 's'}`)
      
      resetForm()
      setIsDialogOpen(false)
      if (onPodDeployed) {
        onPodDeployed()
      }
    } catch (error) {
      console.error('Failed to deploy pod:', error)
      toast.error('Failed to deploy pod')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Pod Template</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the template you want to deploy to users and groups.
              </p>
            </div>
            <div className="space-y-2">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isLoading}>
                <SelectTrigger id="template-select" className="w-full">
                  <SelectValue placeholder={isLoading ? "Loading templates..." : "Template"} />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.name} value={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Users (Optional)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose specific users to deploy to, or skip this step if you prefer to deploy to groups only.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select Users ({selectedUsers.length} selected)</Label>
                {filteredUsers.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllUsers}
                    className="h-6 px-2 text-xs hover:bg-muted"
                  >
                    {allUsersSelected ? "Deselect All" : "Select All"}
                    {userSearch && ` (${filteredUsers.length})`}
                  </Button>
                )}
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="border-b bg-muted/50 p-3">
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="h-8 border-0 bg-background shadow-none focus-visible:ring-1"
                  />
                </div>
                <ScrollArea className="h-48">
                  <div className="p-2 space-y-2">
                    {filteredUsers.map(user => (
                      <div key={user.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.name}`}
                          checked={selectedUsers.includes(user.name)}
                          onCheckedChange={() => handleUserToggle(user.name)}
                        />
                        <Label htmlFor={`user-${user.name}`} className="text-sm cursor-pointer flex-1">
                          {user.name}
                        </Label>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        No users found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Groups (Optional)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose groups to deploy to, or skip this step if you&apos;ve already selected specific users.
                {selectedUsers.length === 0 && (
                  <span className="text-orange-600 font-medium"> Note: You must select at least one group since no users were selected.</span>
                )}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Select Groups ({selectedGroups.length} selected)</Label>
                {filteredGroups.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllGroups}
                    className="h-6 px-2 text-xs hover:bg-muted"
                  >
                    {allGroupsSelected ? "Deselect All" : "Select All"}
                    {groupSearch && ` (${filteredGroups.length})`}
                  </Button>
                )}
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="border-b bg-muted/50 p-3">
                  <Input
                    placeholder="Search groups..."
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    className="h-8 border-0 bg-background shadow-none focus-visible:ring-1"
                  />
                </div>
                <ScrollArea className="h-48">
                  <div className="p-2 space-y-2">
                    {filteredGroups.map(group => (
                      <div key={group.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`group-${group.name}`}
                          checked={selectedGroups.includes(group.name)}
                          onCheckedChange={() => handleGroupToggle(group.name)}
                        />
                        <Label 
                          htmlFor={`group-${group.name}`} 
                          className="text-sm cursor-pointer flex-1 leading-5"
                        >
                          <span className="font-medium">{group.name}</span>
                          {group.user_count && (
                            <div className="text-xs text-muted-foreground">
                              {group.user_count} user{group.user_count !== 1 ? 's' : ''}
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                    {filteredGroups.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        No groups found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Review Deployment</h3>
              <p className="text-muted-foreground">
                Confirm your deployment configuration
              </p>
            </div>
            
            {/* Modern Summary Layout */}
            <div className="space-y-6">
              {/* Template Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Pod Template
                </h4>
                <div className="flex items-center space-x-3 p-4 bg-background border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{selectedTemplate}</p>
                  </div>
                </div>
              </div>

              {/* Targets Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Deployment Targets
                </h4>
                
                <div className="grid gap-4">
                  {/* Users */}
                  {selectedUsers.length > 0 && (
                    <div className="p-4 bg-background border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Users</span>
                        </div>
                        <Badge variant="secondary">{selectedUsers.length}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedUsers.map(user => (
                          <span
                            key={user}
                            className="px-2 py-1 bg-muted text-sm rounded-md"
                          >
                            {user}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Groups */}
                  {selectedGroups.length > 0 && (
                    <div className="p-4 bg-background border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">Groups</span>
                        </div>
                        <Badge variant="secondary">{selectedGroups.length}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedGroups.map(group => (
                          <span
                            key={group}
                            className="px-2 py-1 bg-muted text-sm rounded-md"
                          >
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="flex items-center justify-center space-x-8 p-6 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1</div>
                  <div className="text-sm text-muted-foreground">Template</div>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedUsers.length + selectedGroups.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target{selectedUsers.length + selectedGroups.length === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open)
      if (!open) resetForm()
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Rocket className="size-4 mr-2" />
            Deploy Pod
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Deploy Pod to Users/Groups</DialogTitle>
          <DialogDescription>
            Follow the steps to clone a pod template and deploy it to selected users and groups
          </DialogDescription>
        </DialogHeader>
        
        {/* Horizontal Stepper */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-center">
            <Step
              stepNumber={1}
              isActive={currentStep === 0}
              isCompleted={currentStep > 0 && !!selectedTemplate}
              isClickable={true}
              onClick={() => setCurrentStep(0)}
            />
            <Step
              stepNumber={2}
              isActive={currentStep === 1}
              isCompleted={currentStep > 1}
              isClickable={!!selectedTemplate}
              onClick={() => selectedTemplate && setCurrentStep(1)}
            />
            <Step
              stepNumber={3}
              isActive={currentStep === 2}
              isCompleted={currentStep > 2}
              isClickable={!!selectedTemplate}
              onClick={() => selectedTemplate && setCurrentStep(2)}
            />
            <Step
              stepNumber={4}
              isActive={currentStep === 3}
              isCompleted={false}
              isClickable={!!selectedTemplate && (selectedUsers.length > 0 || selectedGroups.length > 0)}
              onClick={() => canFinish() && setCurrentStep(3)}
              isLast={true}
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto px-4">
            {isLoading && templates.length === 0 ? (
              <LoadingSpinner message="Loading templates and data..." />
            ) : (
              renderStepContent()
            )}
          </div>
          
          <DialogFooter className="mt-6 pt-4 border-t flex justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Previous
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button 
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceedFromStep(currentStep) || isSubmitting}
                >
                  Next
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={!canFinish() || isSubmitting}
                  className="text-sm bg-gradient-to-r from-kamino-green to-kamino-yellow font-medium hover:brightness-90 !text-white"
                >
                  {isSubmitting ? "Deploying..." : "Deploy"}
                  <Rocket className="size-4 ml-1" />
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

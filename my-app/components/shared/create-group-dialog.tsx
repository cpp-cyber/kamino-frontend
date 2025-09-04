"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createGroups } from "@/lib/api"
import { parseGroupNamesFromText, validateGroupName, validateGroupNames, filterGroupNameInput, GroupNameValidationResult } from "@/lib/utils"
import { Users, UserPlus, Hash, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CreateGroupDialogProps {
  onGroupCreated?: () => void
  trigger?: React.ReactNode
}

export function CreateGroupDialog({ onGroupCreated, trigger }: CreateGroupDialogProps) {
  // Single group states
  const [groupName, setGroupName] = useState("")
  const [groupNameValidation, setGroupNameValidation] = useState<GroupNameValidationResult>({ isValid: true, errors: [] })
  
  // Bulk group states
  const [groupsText, setGroupsText] = useState("")
  const [bulkValidation, setBulkValidation] = useState<{ name: string; validation: GroupNameValidationResult }[]>([])
  
  // Prefix group states
  const [prefix, setPrefix] = useState("")
  const [prefixValidation, setPrefixValidation] = useState<GroupNameValidationResult>({ isValid: true, errors: [] })
  const [groupCount, setGroupCount] = useState("5")
  
  // Common states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Validation handlers
  const handleGroupNameChange = (value: string) => {
    const filtered = filterGroupNameInput(value)
    setGroupName(filtered)
    setGroupNameValidation(validateGroupName(filtered))
  }

  const handlePrefixChange = (value: string) => {
    const filtered = filterGroupNameInput(value)
    setPrefix(filtered)
    // Validate the prefix with example suffix for completeness
    const exampleName = `${filtered}1`
    setPrefixValidation(validateGroupName(exampleName))
  }

  const handleBulkGroupsChange = (value: string) => {
    setGroupsText(value)
    const groups = parseGroupNamesFromText(value)
    setBulkValidation(validateGroupNames(groups))
  }

  const handleSingleGroupSubmit = async () => {
    const validation = validateGroupName(groupName)
    if (!validation.isValid) {
      toast.error(validation.errors[0])
      return false
    }

    await createGroups([groupName.trim()])
    toast.success(`Group "${groupName.trim()}" has been created successfully`)
    setGroupName("")
    setGroupNameValidation({ isValid: true, errors: [] })
    return true
  }

  const handleBulkGroupSubmit = async () => {
    if (!groupsText.trim()) {
      toast.error("Please enter group names")
      return false
    }

    const groups = parseGroupNamesFromText(groupsText)
    
    if (groups.length === 0) {
      toast.error("No valid group names found")
      return false
    }

    const validations = validateGroupNames(groups)
    const invalidGroups = validations.filter(v => !v.validation.isValid)
    
    if (invalidGroups.length > 0) {
      const firstError = invalidGroups[0]
      toast.error(`Invalid group name "${firstError.name}": ${firstError.validation.errors[0]}`)
      return false
    }
    
    await createGroups(groups)
    toast.success(`${groups.length} group(s) have been created successfully`)
    setGroupsText("")
    setBulkValidation([])
    return true
  }

  const handlePrefixGroupSubmit = async () => {
    const prefixValidationResult = validateGroupName(prefix)
    if (!prefixValidationResult.isValid) {
      toast.error(`Invalid prefix: ${prefixValidationResult.errors[0]}`)
      return false
    }

    const count = parseInt(groupCount)
    if (isNaN(count) || count < 1 || count > 50) {
      toast.error("Please select a valid number of groups (1-50)")
      return false
    }

    const groups = Array.from({ length: count }, (_, i) => `${prefix.trim()}${i + 1}`)
    
    // Validate all generated group names
    const validations = validateGroupNames(groups)
    const invalidGroups = validations.filter(v => !v.validation.isValid)
    
    if (invalidGroups.length > 0) {
      const firstError = invalidGroups[0]
      toast.error(`Generated group name "${firstError.name}" would be invalid: ${firstError.validation.errors[0]}`)
      return false
    }
    
    await createGroups(groups)
    toast.success(`${groups.length} group(s) have been created successfully with prefix "${prefix.trim()}"`)
    setPrefix("")
    setPrefixValidation({ isValid: true, errors: [] })
    setGroupCount("5")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      let success = false
      
      if (activeTab === "single") {
        success = await handleSingleGroupSubmit()
      } else if (activeTab === "bulk") {
        success = await handleBulkGroupSubmit()
      } else if (activeTab === "prefix") {
        success = await handlePrefixGroupSubmit()
      }
      
      if (success) {
        closeButtonRef.current?.click()
        if (onGroupCreated) {
          onGroupCreated()
        }
      }
    } catch (error) {
      console.error('Failed to create group(s):', error)
      if (error instanceof Error) {
        toast.error(`Failed to create group(s): ${error.message}`)
      } else {
        toast.error('Failed to create group(s)')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Users className="size-4 mr-2" />
            Create Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Create new groups to manage user permissions
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Single
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="size-4" />
              Bulk
            </TabsTrigger>
            <TabsTrigger value="prefix" className="flex items-center gap-2">
              <Hash className="size-4" />
              Prefix
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <TabsContent value="single" className="space-y-4 mt-4">
              <div className="grid gap-3">
                <Label htmlFor="groupname-1">Group Name</Label>
                <Input 
                  id="groupname-1" 
                  name="groupname" 
                  placeholder="Enter group name" 
                  value={groupName}
                  onChange={(e) => handleGroupNameChange(e.target.value)}
                  disabled={isSubmitting}
                  required={activeTab === "single"}
                  className={!groupNameValidation.isValid ? "border-destructive" : ""}
                />
                {!groupNameValidation.isValid && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {groupNameValidation.errors[0]}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="text-xs text-muted-foreground">
                  Max 63 characters. Only letters, numbers, hyphens, and underscores allowed.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bulk" className="space-y-4 mt-4">
              <div className="grid gap-3">
                <Label htmlFor="groups-text">Group Names</Label>
                <Textarea
                  id="groups-text"
                  name="groups-text"
                  placeholder="group"
                  value={groupsText}
                  onChange={(e) => handleBulkGroupsChange(e.target.value)}
                  disabled={isSubmitting}
                  rows={8}
                  className={`font-mono text-sm ${bulkValidation.some(v => !v.validation.isValid) ? "border-destructive" : ""}`}
                  required={activeTab === "bulk"}
                />
                {bulkValidation.length > 0 && bulkValidation.some(v => !v.validation.isValid) && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <div className="space-y-1">
                        {bulkValidation
                          .filter(v => !v.validation.isValid)
                          .slice(0, 3) // Show only first 3 errors
                          .map((v, i) => (
                            <div key={i}>
                              <strong>{v.name}:</strong> {v.validation.errors[0]}
                            </div>
                          ))}
                        {bulkValidation.filter(v => !v.validation.isValid).length > 3 && (
                          <div className="text-xs">
                            ...and {bulkValidation.filter(v => !v.validation.isValid).length - 3} more errors
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1"><strong>Example:</strong></p>
                  <code className="block bg-muted p-2 rounded text-xs">
                    administrators<br/>
                    developers<br/>
                    users<br/>
                    moderators
                  </code>
                  <div className="text-xs mt-2">
                    Each group name: max 63 characters, only letters, numbers, hyphens, and underscores allowed.
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="prefix" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 gap-3 w-65">
                    <div className="grid gap-3">
                      <Label htmlFor="prefix">Group Prefix</Label>
                      <Input 
                        id="prefix" 
                        name="prefix" 
                        placeholder="team" 
                        value={prefix}
                        onChange={(e) => handlePrefixChange(e.target.value)}
                        disabled={isSubmitting}
                        required={activeTab === "prefix"}
                        className={!prefixValidation.isValid ? "border-destructive" : ""}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="group-count">Number of Groups</Label>
                      <Select value={groupCount} onValueChange={setGroupCount} disabled={isSubmitting}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                          {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {!prefixValidation.isValid && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {prefixValidation.errors[0]}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1"><strong>Preview:</strong></p>
                  <code className="block bg-muted p-2 rounded text-xs">
                    {prefix || 'prefix'}{1}<br/>
                    {prefix || 'prefix'}{2}<br/>
                    {prefix || 'prefix'}{3}<br/>
                    ...{parseInt(groupCount) > 3 ? ` (up to ${prefix || 'prefix'}${groupCount})` : ''}
                  </code>
                  <div className="text-xs mt-2">
                    Prefix + numbers: max 63 characters total, only letters, numbers, hyphens, and underscores allowed.
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button ref={closeButtonRef} variant="outline" type="button" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={
                  isSubmitting || 
                  (activeTab === "single" && (!groupName.trim() || !groupNameValidation.isValid)) ||
                  (activeTab === "bulk" && (!groupsText.trim() || bulkValidation.some(v => !v.validation.isValid))) ||
                  (activeTab === "prefix" && (!prefix.trim() || !prefixValidation.isValid))
                }
              >
                {isSubmitting ? "Creating..." : 
                 activeTab === "single" ? "Create Group" : 
                 activeTab === "bulk" ? "Create Groups" : 
                 `Create ${groupCount} Groups`}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

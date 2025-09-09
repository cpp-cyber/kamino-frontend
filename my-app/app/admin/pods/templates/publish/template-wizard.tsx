"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { uploadTemplateImage, publishTemplate } from "@/lib/api"
import { PodTemplate } from "@/lib/types"
import PublishTemplateStepper from "./stepper"
import { StepOne } from "./step-one"
import { StepTwo } from "./step-two"
import { StepThree } from "./step-three"
import { SuccessStep } from "./success-step"

export function TemplatePublishWizard() {
  const router = useRouter()
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form data
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [description, setDescription] = useState("")
  const [authors, setAuthors] = useState("")
  const [vmCount, setVmCount] = useState(1)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isTemplateVisible, setIsTemplateVisible] = useState(false)

  // Check if user has unsaved data
  const hasUnsavedData = useCallback(() => {
    return !isSuccess && (
      selectedTemplate !== "" || 
      description !== "" || 
      authors !== "" ||
      vmCount !== 1 || 
      imageFiles.length > 0 ||
      currentStep > 1
    )
  }, [isSuccess, selectedTemplate, description, authors, vmCount, imageFiles.length, currentStep])

  // Add beforeunload event listener to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedData()) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [selectedTemplate, description, vmCount, imageFiles, currentStep, isSuccess, hasUnsavedData])

  // Step navigation
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCompletedSteps(prev => {
        const newCompleted = [...prev]
        if (!newCompleted.includes(currentStep)) {
          newCompleted.push(currentStep)
        }
        return newCompleted
      })
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // Remove the current step from completed steps when going back
      setCompletedSteps(prev => prev.filter(step => step < currentStep))
    }
  }

  const goToStep = (step: number) => {
    // Only allow navigation to completed steps or the next immediate step
    if (step <= Math.max(...completedSteps, 0) + 1 && step >= 1 && step <= 3) {
      setCurrentStep(step)
      // Remove any steps after the target step from completed steps
      setCompletedSteps(prev => prev.filter(completedStep => completedStep < step))
    }
  }

  // Reset form to start over
  const resetForm = () => {
    setSelectedTemplate("")
    setDescription("")
    setAuthors("")
    setVmCount(1)
    setImageFiles([])
    setIsTemplateVisible(false)
    setCurrentStep(1)
    setCompletedSteps([])
    setIsSuccess(false)
  }

  // Navigate to templates page
  const goToTemplates = () => {
    router.push('/admin/pods/templates')
  }

  // Form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Upload image file if present
      let imagePath = ""
      if (imageFiles.length > 0) {
        console.log('Uploading image:', imageFiles[0].name)
        try {
          imagePath = await uploadTemplateImage(imageFiles[0])
          console.log('Image uploaded successfully to:', imagePath)
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          alert('Failed to upload image. Please try again.')
          return
        }
      }

      // Prepare PodTemplate object for backend API
      const podTemplate: PodTemplate = {
        name: selectedTemplate,
        description: description,
        authors: authors.trim() || "",
        image_path: imagePath,
        template_visible: isTemplateVisible,
        vm_count: vmCount,
      }

      console.log('Submitting PodTemplate to backend:', podTemplate)
      
      // Submit to backend API
      await publishTemplate(podTemplate)
      console.log('Template published successfully!')
      
      // Mark all steps as completed and show success
      setCompletedSteps([1, 2, 3])
      setIsSuccess(true)
      
    } catch (error) {
      console.error('Error publishing template:', error)
      alert(`Error publishing template: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form data when template selection changes
  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
    // Reset other form data when changing template
    setDescription("")
    setAuthors("")
    setVmCount(1)
    setImageFiles([])
    setIsTemplateVisible(false)
  }

  // Don't show stepper on success
  const showStepper = !isSuccess

  return (
    
    <div className="space-y-8">
      {/* Stepper */}
      {showStepper && (
        <PublishTemplateStepper
          activeStep={currentStep}
          onStepChange={goToStep}
          completedSteps={completedSteps}
        />
      )}

      {/* Step Content */}
      <div className="min-h-[400px]">
        {isSuccess ? (
          <SuccessStep
            templateName={selectedTemplate}
            onStartNew={resetForm}
            onGoToTemplates={goToTemplates}
          />
        ) : (
          <>
            {currentStep === 1 && (
              <StepOne
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
                onNext={goToNextStep}
              />
            )}

            {currentStep === 2 && (
              <StepTwo
                selectedTemplate={selectedTemplate}
                description={description}
                onDescriptionChange={setDescription}
                authors={authors}
                onAuthorsChange={setAuthors}
                vmCount={vmCount}
                onVmCountChange={setVmCount}
                imageFiles={imageFiles}
                onImageFilesChange={setImageFiles}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === 3 && (
              <StepThree
                selectedTemplate={selectedTemplate}
                description={description}
                vmCount={vmCount}
                imageFiles={imageFiles}
                isTemplateVisible={isTemplateVisible}
                onVisibilityChange={setIsTemplateVisible}
                onSubmit={handleSubmit}
                onBack={goToPreviousStep}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

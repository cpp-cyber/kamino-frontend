import { 
  PodTemplate, 
  PodTemplateResponse, 
  DeployedPod, 
  DeployedPodResponse,
  User,
  UserLogin,
  UserProfileResponse,
  SessionResponse,
  VirtualMachine,
  VirtualMachinesResponse,
  ProxmoxResourcesResponse,
  UnpublishedPodTemplate
} from './types'

// Request deduplication cache
const requestCache = new Map<string, { promise: Promise<unknown>; timestamp: number }>()
const CACHE_DURATION = 5000 // 5 seconds for deduplication

// Helper function to handle request deduplication
async function deduplicatedFetch<T>(key: string, fetchFn: () => Promise<Response>): Promise<T> {
  const now = Date.now()
  const cached = requestCache.get(key)
  
  // Return existing promise if one is in flight or recently completed
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.promise as Promise<T>
  }
  
  // Create new request
  const promise = fetchFn().then(async (response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.json()
  })
  
  // Cache the promise
  requestCache.set(key, { promise, timestamp: now })
  
  // Clean up cache after completion
  promise.finally(() => {
    setTimeout(() => {
      const entry = requestCache.get(key)
      if (entry && entry.timestamp === now) {
        requestCache.delete(key)
      }
    }, CACHE_DURATION)
  })
  
  return promise
}

// User profile API
export async function getUserProfile(): Promise<UserLogin> {
  const data: UserProfileResponse = await deduplicatedFetch(
    'userProfile',
    () => fetch('/api/profile', { credentials: 'include' })
  )
  return {
    username: data.username,
    isAdmin: data.isAdmin
  }
}

// Check session status
export async function checkSession(): Promise<UserLogin | null> {
  try {
    const response = await fetch('/api/session', {
      credentials: 'include',
    })
    
    if (!response.ok) {
      return null
    }

    const data: SessionResponse = await response.json()
    if (data.authenticated && data.username) {
      return {
        username: data.username,
        isAdmin: data.isAdmin || false
      }
    }
    
    return null
  } catch (error) {
    console.error('Session check failed:', error)
    return null
  }
}

export async function logoutUser(): Promise<void> {
  const response = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error(`Failed to logout: ${response.status} ${response.statusText}`)
  }
}

export async function getPodTemplates(): Promise<PodTemplate[]> {
  const data: PodTemplateResponse = await deduplicatedFetch(
    'podTemplates',
    () => fetch('/api/proxmox/templates', { cache: 'no-store' })
  )
  console.log('Fetched pod templates:', data.templates)
  return data.templates || []
}

export async function getAllPodTemplates(): Promise<PodTemplate[]> {
  const data: PodTemplateResponse = await deduplicatedFetch(
    'podTemplates',
    () => fetch('/api/admin/proxmox/templates', { cache: 'no-store' })
  )
  console.log('Fetched pod templates:', data.templates)
  return data.templates || []
}

export async function deployPod(templateName: string): Promise<void> {
  const response = await fetch(`/api/proxmox/templates/clone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "template_name": templateName })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to deploy pod: ${response.status} ${response.statusText}`)
  }
}

export async function getDeployedPods(): Promise<DeployedPod[]> {
  const data: DeployedPodResponse = await deduplicatedFetch(
    'deployedPods',
    () => fetch('/api/proxmox/pods', { cache: 'no-store' })
  )
  return data.pods || []
}

export async function getAllDeployedPods(): Promise<DeployedPod[]> {
  const data: { pods: DeployedPod[] } = await deduplicatedFetch(
    'allDeployedPods',
    () => fetch('/api/admin/proxmox/pods/all', { cache: 'no-store', credentials: 'include' })
  )
  return data.pods || []
}

export async function deletePod(podName: string): Promise<void> {
  const response = await fetch(`/api/proxmox/pods/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "pod_id": podName })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to delete pod: ${response.status} ${response.statusText}`)
  }
}

// Get all virtual machines
export async function getVirtualMachines(): Promise<VirtualMachine[]> {
  const data: VirtualMachinesResponse = await deduplicatedFetch(
    'virtualMachines',
    () => fetch('/api/admin/proxmox/virtualmachines', { cache: 'no-store', credentials: 'include' })
  )
  return data.virtual_machines || []
}

// Power on a virtual machine
export async function startVM(vmid: number, node: string): Promise<void> {
  const response = await fetch(`/api/admin/proxmox/virtualmachines/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "vmid": vmid, "node": node })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to start VM: ${response.status} ${response.statusText}`)
  }
}

// Stop a virtual machine
export async function stopVM(vmid: number, node: string): Promise<void> {
  const response = await fetch(`/api/admin/proxmox/virtualmachines/shutdown`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "vmid": vmid, "node": node })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to stop VM: ${response.status} ${response.statusText}`)
  }
}

// Get Proxmox resources (nodes and cluster stats)
export async function getProxmoxResources(): Promise<ProxmoxResourcesResponse> {
  return await deduplicatedFetch(
    'proxmoxResources',
    () => fetch('/api/admin/proxmox/resources', { cache: 'no-store', credentials: 'include' })
  )
}

// Get all users from Active Directory
export async function getAllUsers(): Promise<User[]> {
  const data: { users: User[] } = await deduplicatedFetch(
    'allUsers',
    () => fetch('/api/admin/users', { cache: 'no-store', credentials: 'include' })
  )
  console.log('Fetched users:', data.users)
  return data.users || []
}

// Delete a single user
export async function deleteUser(username: string): Promise<void> {
  const response = await fetch(`/api/admin/users/delete`, {
    method: 'DELETE',
    credentials: 'include',
    body: JSON.stringify({ "username": username })
  })

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`)
  }
}

export async function publishTemplate(template: PodTemplate): Promise<void> {
  const response = await fetch(`/api/admin/proxmox/templates/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template)
  })

  if (!response.ok) {
    throw new Error(`Failed to create template: ${response.status} ${response.statusText}`)
  }
}

export async function updateTemplate(template: PodTemplate): Promise<void> {
  const response = await fetch(`/api/admin/proxmox/templates/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template)
  })

  if (!response.ok) {
    throw new Error(`Failed to update template: ${response.status} ${response.statusText}`)
  }
}

export async function getUnpublishedTemplates(): Promise<UnpublishedPodTemplate[]> {
  const data: { templates: UnpublishedPodTemplate[] } = await deduplicatedFetch(
    'unpublishedTemplates',
    () => fetch('/api/admin/proxmox/templates/unpublished', { cache: 'no-store', credentials: 'include' })
  )
  return data.templates || []
}

// Upload template image file
export async function uploadTemplateImage(file: File): Promise<string> {
  // Validate file size on frontend
  if (file.size === 0) {
    throw new Error('File is empty')
  }

  // Validate file type on frontend (basic check)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`)
  }

  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch('/api/admin/proxmox/templates/image/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to upload image: ${response.status} ${response.statusText} - ${errorText}`)
  }
  
  const data = await response.json()
  return data.filename
}

export async function toggleTemplateVisibility(templateName: string): Promise<void> {
  const response = await fetch(`/api/admin/proxmox/templates/toggle`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ template_name: templateName })
  })

  if (!response.ok) {
    throw new Error(`Failed to toggle template visibility: ${response.status} ${response.statusText}`)
  }
}
import { 
  PodTemplate, 
  PodTemplateResponse, 
  DeployedPod, 
  DeployedPodResponse,
  UserLogin,
  GetGroupsResponse,
  SessionResponse,
  VirtualMachine,
  VirtualMachinesResponse,
  ProxmoxResourcesResponse,
  UnpublishedPodTemplate,
  GetUsersResponse,
  DashboardResponse
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

// Check session status
export async function checkSession(): Promise<UserLogin | null> {
  try {
    const response = await fetch('/api/v1/session', {
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
  const response = await fetch('/api/v1/logout', {
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
    () => fetch('/api/v1/templates', { cache: 'no-store' })
  )
  console.log('Fetched pod templates:', data.templates)
  return data.templates || []
}

export async function getAllPodTemplates(): Promise<PodTemplate[]> {
  const data: PodTemplateResponse = await deduplicatedFetch(
    'podTemplates',
    () => fetch('/api/v1/admin/templates', { cache: 'no-store' })
  )
  console.log('Fetched pod templates:', data.templates)
  return data.templates || []
}

export async function deployPod(templateName: string): Promise<void> {
  const response = await fetch(`/api/v1/template/clone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "template": templateName })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to deploy pod: ${response.status} ${response.statusText}`)
  }
}

export async function getDeployedPods(): Promise<DeployedPod[]> {
  const data: DeployedPodResponse = await deduplicatedFetch(
    'deployedPods',
    () => fetch('/api/v1/pods', { cache: 'no-store' })
  )
  return data.pods || []
}

export async function getAllDeployedPods(): Promise<DeployedPod[]> {
  const data: { pods: DeployedPod[] } = await deduplicatedFetch(
    'allDeployedPods',
    () => fetch('/api/v1/admin/pods', { cache: 'no-store', credentials: 'include' })
  )
  return data.pods || []
}

export async function deletePod(podName: string): Promise<void> {
  const response = await fetch(`/api/v1/pod/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "pod": podName })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to delete pod: ${response.status} ${response.statusText}`)
  }
}

// Get all virtual machines
export async function getVirtualMachines(): Promise<VirtualMachine[]> {
  const data: VirtualMachinesResponse = await deduplicatedFetch(
    'virtualMachines',
    () => fetch('/api/v1/admin/vms', { cache: 'no-store', credentials: 'include' })
  )
  return data.vms || []
}

// Power on a virtual machine
export async function startVM(vmid: number, node: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/vm/start`, {
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

// Shutdown a virtual machine
export async function shutdownVM(vmid: number, node: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/vm/shutdown`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "vmid": vmid, "node": node })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to shutdown VM: ${response.status} ${response.statusText}`)
  }
}

// Reboot a virtual machine
export async function rebootVM(vmid: number, node: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/vm/reboot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "vmid": vmid, "node": node })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to reboot VM: ${response.status} ${response.statusText}`)
  }
}

// Get Proxmox resources (nodes and cluster stats)
export async function getProxmoxResources(): Promise<ProxmoxResourcesResponse> {
  return await deduplicatedFetch(
    'proxmoxResources',
    () => fetch('/api/v1/admin/cluster', { cache: 'no-store', credentials: 'include' })
  )
}

// Get unified dashboard data
export async function getDashboardData(): Promise<DashboardResponse> {
  return await deduplicatedFetch(
    'dashboardData',
    () => fetch('/api/v1/admin/dashboard', { cache: 'no-store', credentials: 'include' })
  )
}

// Get all users from Active Directory
export async function getAllUsers(): Promise<GetUsersResponse> {
  const data: GetUsersResponse = await deduplicatedFetch(
    'allUsers',
    () => fetch('/api/v1/admin/users', { cache: 'no-store', credentials: 'include' })
  )
  console.log('Fetched users:', data.users)
  return data
}

// Delete a single user
export async function deleteUser(username: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/users/delete`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ "username": username })
  })

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`)
  }
}

export async function publishTemplate(template: PodTemplate): Promise<void> {
  const response = await fetch(`/api/v1/admin/template/publish`, {
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
  const response = await fetch(`/api/v1/admin/template/update`, {
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

export async function deleteTemplate(templateName: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/template/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ template: templateName })
  })

  if (!response.ok) {
    throw new Error(`Failed to delete template: ${response.status} ${response.statusText}`)
  }
}

export async function getUnpublishedTemplates(): Promise<UnpublishedPodTemplate[]> {
  const data: { templates: string[] } = await deduplicatedFetch(
    'unpublishedTemplates',
    () => fetch('/api/v1/admin/templates/unpublished', { cache: 'no-store', credentials: 'include' })
  )
  return data.templates.map(name => ({ name })) || []
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

  const response = await fetch('/api/v1/admin/template/image/upload', {
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
  const response = await fetch(`/api/v1/admin/template/visibility`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ template: templateName })
  })

  if (!response.ok) {
    throw new Error(`Failed to toggle template visibility: ${response.status} ${response.statusText}`)
  }
}

// Get all Kamino Groups from Active Directory
export async function getGroups(): Promise<GetGroupsResponse> {
  const data: GetGroupsResponse = await deduplicatedFetch(
    'allGroups',
    () => fetch('/api/v1/admin/groups', { cache: 'no-store', credentials: 'include' })
  )
  console.log('Fetched groups:', data.groups)
  return data
}

// Delete a single group
export async function deleteGroup(groupName: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/group/delete`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ "group": groupName })
  })

  if (!response.ok) {
    throw new Error(`Failed to delete group: ${response.status} ${response.statusText}`)
  }
}

// Create a new group
export async function createGroup(groupName: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/group/create`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ "group": groupName })
  })

  if (!response.ok) {
    throw new Error(`Failed to create group: ${response.status} ${response.statusText}`)
  }
}
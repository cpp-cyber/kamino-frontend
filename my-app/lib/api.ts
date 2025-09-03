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
  DashboardResponse,
  ClonePodRequest,
  CreateUsersRequest,
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

// =============================================================================
// HEALTH & AUTHENTICATION ENDPOINTS
// =============================================================================

// Check API health status
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch('/api/v1/health')
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

// User registration
export async function registerUser(username: string, password: string): Promise<void> {
  const response = await fetch('/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Registration failed: ${response.status} ${response.statusText} - ${errorText}`)
  }
}

// User login
export async function loginUser(username: string, password: string): Promise<UserLogin> {
  const response = await fetch('/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
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

// User logout
export async function logoutUser(): Promise<void> {
  const response = await fetch('/api/v1/logout', {
    method: 'POST',
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error(`Failed to logout: ${response.status} ${response.statusText}`)
  }
}

// =============================================================================
// USER POD & TEMPLATE ENDPOINTS
// =============================================================================

// Get user's deployed pods
export async function getDeployedPods(): Promise<DeployedPod[]> {
  const data: DeployedPodResponse = await deduplicatedFetch(
    'deployedPods',
    () => fetch('/api/v1/pods', { cache: 'no-store' })
  )
  return data.pods || []
}

// Get available pod templates for user
export async function getPodTemplates(): Promise<PodTemplate[]> {
  const data: PodTemplateResponse = await deduplicatedFetch(
    'podTemplates',
    () => fetch('/api/v1/templates', { cache: 'no-store' })
  )
  console.log('Fetched pod templates:', data.templates)
  return data.templates || []
}

// Clone/deploy a pod template
export async function deployPod(templateName: string): Promise<void> {
  const response = await fetch(`/api/v1/templates/clone`, {
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

// Delete user's pod
export async function deletePod(podNames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/pods/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "pods": podNames })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to delete pod: ${response.status} ${response.statusText}`)
  }
}

// =============================================================================
// ADMIN DASHBOARD ENDPOINTS
// =============================================================================

// Get unified dashboard data
export async function getDashboardData(): Promise<DashboardResponse> {
  return await deduplicatedFetch(
    'dashboardData',
    () => fetch('/api/v1/admin/dashboard', { cache: 'no-store', credentials: 'include' })
  )
}

// Get Proxmox resources (nodes and cluster stats)
export async function getProxmoxResources(): Promise<ProxmoxResourcesResponse> {
  return await deduplicatedFetch(
    'proxmoxResources',
    () => fetch('/api/v1/admin/cluster', { cache: 'no-store', credentials: 'include' })
  )
}

// =============================================================================
// ADMIN USER MANAGEMENT ENDPOINTS
// =============================================================================

// Get all users from Active Directory
export async function getAllUsers(): Promise<GetUsersResponse> {
  const data: GetUsersResponse = await deduplicatedFetch(
    'allUsers',
    () => fetch('/api/v1/admin/users', { cache: 'no-store', credentials: 'include' })
  )
  console.log('Fetched users:', data.users)
  return data
}

// Create new users (accepts array for bulk creation)
export async function createUsers(users: CreateUsersRequest[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ "users": users })
  })

  if (!response.ok) {
    throw new Error(`Failed to create users: ${response.status} ${response.statusText}`)
  }
}

// Delete users (accepts array for bulk deletion)
export async function deleteUsers(usernames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/users/delete`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "usernames": usernames })
  })

  if (!response.ok) {
    throw new Error(`Failed to delete users: ${response.status} ${response.statusText}`)
  }
}

// Enable users (accepts array for bulk operation)
export async function enableUsers(usernames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/users/enable`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "usernames": usernames })
  })

  if (!response.ok) {
    throw new Error(`Failed to enable users: ${response.status} ${response.statusText}`)
  }
}

// Disable users (accepts array for bulk operation)
export async function disableUsers(usernames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/users/disable`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "usernames": usernames })
  })

  if (!response.ok) {
    throw new Error(`Failed to disable users: ${response.status} ${response.statusText}`)
  }
}

// Update user groups
export async function updateUserGroups(username: string, groups: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/user/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ "username": username, "groups": groups })
  })

  if (!response.ok) {
    throw new Error(`Failed to update user groups: ${response.status} ${response.statusText}`)
  }
}

// =============================================================================
// ADMIN GROUP MANAGEMENT ENDPOINTS
// =============================================================================

// Get all Kamino Groups from Active Directory
export async function getGroups(): Promise<GetGroupsResponse> {
  const data: GetGroupsResponse = await deduplicatedFetch(
    'allGroups',
    () => fetch('/api/v1/admin/groups', { cache: 'no-store', credentials: 'include' })
  )
  console.log('Fetched groups:', data.groups)
  return data
}

// Create new groups (accepts array for bulk creation)
export async function createGroups(groupNames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/groups/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "groups": groupNames })
  })

  if (!response.ok) {
    throw new Error(`Failed to create groups: ${response.status} ${response.statusText}`)
  }
}

// Add users to groups (bulk operation)
export async function addUsersToGroups(usernames: string[], groupName: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/groups/members/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ 
      "group": groupName,
      "usernames": usernames
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to add users to group: ${response.status} ${response.statusText}`)
  }
}

// Remove users from groups (bulk operation)
export async function removeUsersFromGroups(usernames: string[], groupName: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/groups/members/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ 
      "group": groupName,
      "usernames": usernames
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to remove users from group: ${response.status} ${response.statusText}`)
  }
}

// Rename an existing group
export async function renameGroup(oldName: string, newName: string): Promise<void> {
  console.log(`Renaming group from "${oldName}" to "${newName}"`)

  const response = await fetch(`/api/v1/admin/groups/rename`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "old_name": oldName, "new_name": newName })
  })

  if (!response.ok) {
    throw new Error(`Failed to rename group: ${response.status} ${response.statusText}`)
  }
}

// Delete groups (accepts array for bulk deletion)
export async function deleteGroups(groupNames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/groups/delete`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "groups": groupNames })
  })

  if (!response.ok) {
    throw new Error(`Failed to delete groups: ${response.status} ${response.statusText}`)
  }
}

// =============================================================================
// ADMIN VIRTUAL MACHINE ENDPOINTS
// =============================================================================

// Get all virtual machines
export async function getVirtualMachines(): Promise<VirtualMachine[]> {
  const data: VirtualMachinesResponse = await deduplicatedFetch(
    'virtualMachines',
    () => fetch('/api/v1/admin/vms', { cache: 'no-store', credentials: 'include' })
  )
  return data.vms || []
}

// Start a virtual machine
export async function startVM(vmid: number, node: string): Promise<void> {
  const response = await fetch(`/api/v1/admin/vm/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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
    credentials: 'include',
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
    credentials: 'include',
    body: JSON.stringify({ "vmid": vmid, "node": node })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to reboot VM: ${response.status} ${response.statusText}`)
  }
}

// =============================================================================
// ADMIN POD MANAGEMENT ENDPOINTS
// =============================================================================

// Get all deployed pods (admin view)
export async function getAllDeployedPods(): Promise<DeployedPod[]> {
  const data: { pods: DeployedPod[] } = await deduplicatedFetch(
    'allDeployedPods',
    () => fetch('/api/v1/admin/pods', { cache: 'no-store', credentials: 'include' })
  )
  return data.pods || []
}

// Delete pods (admin - accepts array for bulk deletion)
export async function adminDeletePods(podNames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/pods/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ "pods": podNames })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to delete pods: ${response.status} ${response.statusText}`)
  }
}

// =============================================================================
// ADMIN TEMPLATE MANAGEMENT ENDPOINTS
// =============================================================================

// Get all pod templates (admin view)
export async function getAllPodTemplates(): Promise<PodTemplate[]> {
  const data: PodTemplateResponse = await deduplicatedFetch(
    'allPodTemplates',
    () => fetch('/api/v1/admin/templates', { cache: 'no-store', credentials: 'include' })
  )
  console.log('Fetched admin pod templates:', data.templates)
  return data.templates || []
}

// Get unpublished templates
export async function getUnpublishedTemplates(): Promise<UnpublishedPodTemplate[]> {
  const data: { templates: string[] } = await deduplicatedFetch(
    'unpublishedTemplates',
    () => fetch('/api/v1/admin/templates/unpublished', { cache: 'no-store', credentials: 'include' })
  )
  return data.templates.map(name => ({ name })) || []
}

// Publish template
export async function publishTemplate(templates: PodTemplate[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/template/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ "templates": templates })
  })

  if (!response.ok) {
    throw new Error(`Failed to publish templates: ${response.status} ${response.statusText}`)
  }
}

// Delete templates (accepts array for bulk deletion)
export async function deleteTemplates(templateNames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/templates/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ "templates": templateNames })
  })

  if (!response.ok) {
    throw new Error(`Failed to delete templates: ${response.status} ${response.statusText}`)
  }
}

// Toggle template visibility (accepts array for bulk operation)
export async function toggleTemplateVisibility(templateNames: string[]): Promise<void> {
  const response = await fetch(`/api/v1/admin/templates/visibility`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ "templates": templateNames })
  })

  if (!response.ok) {
    throw new Error(`Failed to toggle template visibility: ${response.status} ${response.statusText}`)
  }
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

  const response = await fetch('/api/v1/admin/templates/image/upload', {
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

// Clone pod templates to users/groups (accepts array for bulk cloning)
export async function clonePodTemplates(template: string, usernames: string[], groups: string[]): Promise<void> {
  const response = await fetch('/api/v1/admin/templates/clone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      "template": template,
      "usernames": usernames,
      "groups": groups
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to clone pod templates: ${response.status} ${response.statusText}`)
  }
}

// =============================================================================
// LEGACY COMPATIBILITY FUNCTIONS (Single Operations)
// =============================================================================

// Legacy single user operations (for backward compatibility)
export async function deleteUser(username: string): Promise<void> {
  return deleteUsers([username])
}

export async function enableUser(username: string): Promise<void> {
  return enableUsers([username])
}

export async function disableUser(username: string): Promise<void> {
  return disableUsers([username])
}

export async function bulkAddUsersToGroup(usernames: string[], groupName: string): Promise<void> {
  return addUsersToGroups(usernames, groupName)
}

export async function bulkRemoveUsersFromGroup(usernames: string[], groupName: string): Promise<void> {
  return removeUsersFromGroups(usernames, groupName)
}

export async function bulkDeleteUsers(usernames: string[]): Promise<void> {
  return deleteUsers(usernames)
}
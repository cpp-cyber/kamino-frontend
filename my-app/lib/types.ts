export interface PodTemplate {
  name: string
  vms: VirtualMachine[]
  description?: string
  icon?: string
  created_at?: string
  deployments?: number
  status?: string
}

export interface PodTemplateResponse {
  templates: PodTemplate[]
}

export interface DeployedPod {
  name: string
  vms: VirtualMachine[]
  description?: string
  icon?: string
  deployed_at?: string
}

export interface DeployedPodResponse {
  pods: DeployedPod[]
}

export interface User {
  id?: string
  username: string
  groups: string[]
  created_at?: string
  last_login?: string | null
  isAdmin: boolean
  // Actual field names from the API response
  createdDate?: string
  lastLogin?: string
  // Additional potential field names from Active Directory
  whenCreated?: string
  lastLogon?: string
  when_created?: string
  last_logon?: string
  createdAt?: string
  created?: string
}

export interface UserLogin {
  username: string
  isAdmin: boolean
}

export interface UserProfileResponse {
  username: string
  isAdmin: boolean
}

export interface SessionResponse {
  authenticated: boolean
  username?: string
  isAdmin?: boolean
}

// Virtual Machine types for the admin VMs page
export interface VirtualMachine {
  cpu: number
  maxcpu: number
  mem: number
  maxmem: number
  type: string
  id: string
  name: string
  node: string
  pool: string
  status: string
  uptime: number
  vmid: number
  disk: number
  maxdisk: number
  template: number
  diskread: number
  diskwrite: number
  netin: number
  netout: number
  tags?: string
}

export interface VirtualMachinesResponse {
  virtual_machines: VirtualMachine[]
  virtual_machine_count: number
  running_count: number
}

// Proxmox Resources types for nodes monitoring
export interface ProxmoxNode {
  node_name: string
  cpu_usage: number
  memory_total: number
  memory_used: number
  storage_total: number
  storage_used: number
}

export interface ProxmoxCluster {
  total_cpu_usage: number
  total_memory_total: number
  total_memory_used: number
  total_storage_total: number
  total_storage_used: number
}

export interface ProxmoxResourcesResponse {
  nodes: ProxmoxNode[]
  cluster: ProxmoxCluster
}

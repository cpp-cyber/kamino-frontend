export interface PodTemplate {
  name: string
  description?: string
  image?: string
  image_path?: string
  visible?: boolean
  vm_count: number
  deployments?: number 
  created_at?: string
}

export interface UnpublishedPodTemplate {
  name: string
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
  template?: PodTemplate
}

export interface DeployedPodResponse {
  pods: DeployedPod[]
}

export interface User {
  name: string
  created_at: string
  enabled: boolean
  is_admin: boolean
  groups: Group[]
}

export interface Group {
  name: string
  can_modify?: boolean
  created_at?: string
  user_count?: number
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
  vms: VirtualMachine[]
}

export interface GetUsersResponse {
  users: User[]
  count: number
  admin_count: number
  disabled_count: number
}

export interface Resources {
  cpu_usage: number
  memory_used: number
  memory_total: number
  storage_used: number
  storage_total: number
}

export interface Node {
  name: string
  resources: Resources
}

export interface Cluster {
  total: Resources
  nodes: Node[]
}

export interface ProxmoxResourcesResponse {
  cluster: Cluster
}

export interface DashboardStats {
  users: number
  groups: number
  published_templates: number
  deployed_pods: number
  vms: number
  cluster: Cluster
}

export interface DashboardResponse {
  stats: DashboardStats
}

export interface GetGroupsResponse {
  groups: Group[]
  count: number
}

export interface ClonePodRequest {
  template: string
  usernames: string[]
  groups: string[]
}

export interface CreateUsersRequest {
  username: string
  password: string
}
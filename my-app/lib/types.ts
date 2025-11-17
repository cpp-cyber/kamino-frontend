export interface PodTemplate {
  name: string;
  description?: string;
  authors?: string;
  image?: string;
  image_path?: string;
  template_visible?: boolean;
  pod_visible?: boolean;
  vms_visible?: boolean;
  vm_count: number;
  deployments?: number;
  created_at?: string;
}

export interface UnpublishedPodTemplate {
  name: string;
}

export interface PodTemplateResponse {
  templates: PodTemplate[];
}

export interface DeployedPod {
  name: string;
  vms: VirtualMachine[];
  description?: string;
  icon?: string;
  deployed_at?: string;
  template?: PodTemplate;
}

export interface DeployedPodResponse {
  pods: DeployedPod[];
}

export interface User {
  name: string;
  groups: string[];
}

export interface Group {
  name: string;
  user_count?: number;
  comment?: string;
}

export interface UserLogin {
  username: string;
  isAdmin: boolean;
  isCreator?: boolean;
}

export interface UserProfileResponse {
  username: string;
  isAdmin: boolean;
  isCreator?: boolean;
}

export interface SessionResponse {
  authenticated: boolean;
  username?: string;
  isAdmin?: boolean;
  isCreator?: boolean;
}

// Virtual Machine types for the admin VMs page
export interface VirtualMachine {
  cpu: number;
  maxcpu: number;
  mem: number;
  maxmem: number;
  type: string;
  id: string;
  name: string;
  node: string;
  pool: string;
  status: string;
  uptime: number;
  vmid: number;
  disk: number;
  maxdisk: number;
  template: number;
  diskread: number;
  diskwrite: number;
  netin: number;
  netout: number;
  tags?: string;
}

export interface VirtualMachinesResponse {
  vms: VirtualMachine[];
}

export interface GetUsersResponse {
  users: User[];
  count: number;
}

export interface Resources {
  cpu_usage: number;
  memory_used: number;
  memory_total: number;
  storage_used: number;
  storage_total: number;
}

export interface Node {
  name: string;
  resources: Resources;
}

export interface Cluster {
  total: Resources;
  nodes: Node[];
}

export interface ProxmoxResourcesResponse {
  cluster: Cluster;
}

export interface DashboardStats {
  users: number;
  groups: number;
  published_templates: number;
  deployed_pods: number;
  vms: number;
  cluster: Cluster;
}

export interface DashboardResponse {
  stats: DashboardStats;
}

export interface GetGroupsResponse {
  groups: Group[];
  count: number;
}

export interface ClonePodRequest {
  template: string;
  usernames: string[];
  groups: string[];
}

export interface CreateUsersRequest {
  username: string;
  password: string;
}

export interface UserDashboardResponse {
  pods: DeployedPod[];
  templates: PodTemplate[];
  user_info: User;
}

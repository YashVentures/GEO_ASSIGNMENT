export type ProjectStatus = 'Active' | 'Pending' | 'Completed' | 'On Hold';

export interface Project {
  id: string;
  projectName: string;
  latitude: number;
  longitude: number;
  status: ProjectStatus;
  lastUpdated: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: keyof Project | null;
  direction: SortDirection;
}

export interface FilterConfig {
  search: string;
  status: ProjectStatus | 'All';
}

import type { Project, ProjectStatus } from '../types';

const projectPrefixes = [
  'Solar Farm', 'Wind Turbine', 'Hydro Plant', 'Geothermal Station',
  'Pipeline', 'Transmission Line', 'Substation', 'Reservoir',
  'Mining Site', 'Oil Rig', 'Gas Plant', 'Power Grid',
  'Survey Point', 'Weather Station', 'Seismic Monitor', 'Water Treatment',
  'Desalination Plant', 'Nuclear Facility', 'Biomass Plant', 'Tidal Generator'
];

const locations = [
  'North', 'South', 'East', 'West', 'Central',
  'Upper', 'Lower', 'Coastal', 'Mountain', 'Valley',
  'Desert', 'Forest', 'Plains', 'Highland', 'Lowland'
];

const regions = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
  'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
  'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron'
];

const statuses: ProjectStatus[] = ['Active', 'Pending', 'Completed', 'On Hold'];

// Generate random coordinates within reasonable bounds (world coverage)
const generateCoordinates = (index: number): { lat: number; lng: number } => {
  // Use index-based distribution to spread points globally
  // This creates a more realistic distribution than pure random
  const latBase = -60 + (index % 120);
  const lngBase = -180 + ((index * 7) % 360);

  // Add some randomness
  const lat = Math.max(-85, Math.min(85, latBase + (Math.random() - 0.5) * 10));
  const lng = lngBase + (Math.random() - 0.5) * 10;

  return {
    lat: parseFloat(lat.toFixed(6)),
    lng: parseFloat((lng > 180 ? lng - 360 : lng < -180 ? lng + 360 : lng).toFixed(6))
  };
};

const generateRandomDate = (): string => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const generateProjectName = (index: number): string => {
  const prefix = projectPrefixes[index % projectPrefixes.length];
  const location = locations[Math.floor(index / projectPrefixes.length) % locations.length];
  const region = regions[Math.floor(index / (projectPrefixes.length * locations.length)) % regions.length];
  const number = Math.floor(index / (projectPrefixes.length * locations.length * regions.length)) + 1;

  return `${prefix} ${location} ${region}-${number.toString().padStart(3, '0')}`;
};

// Generate 5500 projects (5k+ rows as required)
export const generateMockData = (count: number = 5500): Project[] => {
  const projects: Project[] = [];

  for (let i = 0; i < count; i++) {
    const coords = generateCoordinates(i);
    projects.push({
      id: `proj-${i.toString().padStart(5, '0')}`,
      projectName: generateProjectName(i),
      latitude: coords.lat,
      longitude: coords.lng,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: generateRandomDate()
    });
  }

  return projects;
};

// Simulated API response with pagination
export interface PaginatedResponse {
  data: Project[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Mock API service - simulates network delay
export const fetchProjects = async (
  page: number = 1,
  pageSize: number = 50
): Promise<PaginatedResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  const allData = generateMockData();
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: allData.slice(startIndex, endIndex),
    total: allData.length,
    page,
    pageSize,
    totalPages: Math.ceil(allData.length / pageSize)
  };
};

// Fetch all data at once (for filtering/sorting on client side)
export const fetchAllProjects = async (): Promise<Project[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return generateMockData();
};

// Cache the generated data to avoid regenerating on every call
let cachedData: Project[] | null = null;

export const getCachedProjects = (): Project[] => {
  if (!cachedData) {
    cachedData = generateMockData();
  }
  return cachedData;
};

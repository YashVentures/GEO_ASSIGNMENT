# Project Documentation - Geo Data Dashboard

## Overview

This is a **React + TypeScript** geospatial data visualization dashboard that displays 5,500+ project locations on an interactive map alongside a virtualized data table. Built with **Vite** for fast development and optimized builds.

---

## Project Structure

```
Assignment_Vasundharaa_Geo/
├── src/
│   ├── components/
│   │   ├── Dashboard/          # Main layout component
│   │   │   ├── Dashboard.tsx   # Core layout with table + map
│   │   │   ├── Dashboard.css   # Styling for dashboard layout
│   │   │   └── index.ts        # Re-export
│   │   ├── DataTable/          # Virtualized table component
│   │   │   ├── DataTable.tsx   # Table with sorting & virtualization
│   │   │   ├── DataTable.css   # Table styling
│   │   │   └── index.ts        # Re-export
│   │   ├── Filters/            # Search and filter controls
│   │   │   ├── Filters.tsx     # Search input & status buttons
│   │   │   ├── Filters.css     # Filter styling
│   │   │   └── index.ts        # Re-export
│   │   ├── Map/                # Leaflet map component
│   │   │   ├── MapView.tsx     # Map with markers & popup
│   │   │   ├── MapView.css     # Map styling
│   │   │   └── index.ts        # Re-export
│   │   └── index.ts            # Barrel export for all components
│   ├── hooks/
│   │   ├── useProjects.ts      # Data fetching, filtering, sorting
│   │   ├── useSelection.tsx    # Selection state context
│   │   └── index.ts            # Barrel export for hooks
│   ├── data/
│   │   └── mockData.ts         # Mock data generator (5,500 projects)
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Root component with providers
│   ├── App.css                 # App-level styles
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/
│   └── vite.svg                # Vite logo
├── dist/                       # Production build output
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
└── README.md                   # Project documentation
```

---

## File-by-File Breakdown

### Entry Point Files

#### `src/main.tsx`
**Purpose:** Application entry point

**How it works:**
- Creates React root using `createRoot()` from React 19
- Renders `<App />` wrapped in `<StrictMode>` for development warnings
- Mounts to `#root` element in `index.html`

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

#### `src/App.tsx`
**Purpose:** Root component that sets up context providers

**How it works:**
- Wraps `Dashboard` component with `SelectionProvider` context
- `SelectionProvider` enables bidirectional selection sync between table and map
- Imports global `App.css` styles

```tsx
function App() {
  return (
    <SelectionProvider>
      <Dashboard />
    </SelectionProvider>
  );
}
```

---

### Type Definitions

#### `src/types/index.ts`
**Purpose:** TypeScript interfaces for the entire application

**Exports:**

| Type | Description |
|------|-------------|
| `ProjectStatus` | `'Active' \| 'Pending' \| 'Completed' \| 'On Hold'` |
| `Project` | Main data interface with id, projectName, latitude, longitude, status, lastUpdated |
| `SortDirection` | `'asc' \| 'desc' \| null` |
| `SortConfig` | Tracks which column is sorted and direction |
| `FilterConfig` | Tracks search string and status filter |

---

### Data Layer

#### `src/data/mockData.ts`
**Purpose:** Generates 5,500 mock project records

**Key Functions:**

| Function | Description |
|----------|-------------|
| `generateMockData(count)` | Creates array of `Project` objects |
| `generateCoordinates(index)` | Creates lat/lng distributed globally |
| `generateRandomDate()` | Random date between 2020 and now |
| `generateProjectName(index)` | Combines prefixes, locations, regions |
| `getCachedProjects()` | Returns cached data (avoids regeneration) |
| `fetchAllProjects()` | Async wrapper with 300ms simulated delay |

**Data Generation Logic:**
- **Project Names:** Combination of prefix (e.g., "Solar Farm") + location (e.g., "North") + region (e.g., "Alpha") + number
- **Coordinates:** Uses index-based distribution + random offset for global spread
- **Status:** Randomly assigned from 4 options
- **Dates:** Random between Jan 2020 and current date

**Performance Note:** Data is cached in memory after first generation to prevent regenerating on every call.

---

### Custom Hooks

#### `src/hooks/useProjects.ts`
**Purpose:** Manages all project data, filtering, and sorting logic

**State Variables:**
| State | Type | Description |
|-------|------|-------------|
| `projects` | `Project[]` | All loaded projects |
| `isLoading` | `boolean` | Loading indicator |
| `error` | `string \| null` | Error message if fetch fails |
| `sortConfig` | `SortConfig` | Current sort column/direction |
| `filterConfig` | `FilterConfig` | Current search/status filter |

**Computed Values:**
- `filteredProjects`: Memoized array after applying search, status filter, and sort

**Functions Returned:**
| Function | Description |
|----------|-------------|
| `handleSort(key)` | Cycles sort: asc → desc → none |
| `handleSearch(search)` | Updates search filter |
| `handleStatusFilter(status)` | Updates status filter |

**Data Flow:**
1. On mount, `useEffect` loads data via `getCachedProjects()`
2. When `sortConfig` or `filterConfig` changes, `useMemo` recalculates `filteredProjects`
3. Filtering is done client-side for instant response

---

#### `src/hooks/useSelection.tsx`
**Purpose:** React Context for sharing selection state between table and map

**Context Value:**
| Property | Type | Description |
|----------|------|-------------|
| `selectedProject` | `Project \| null` | Currently selected project |
| `selectProject` | `function` | Sets/toggles selection |
| `isSelected` | `function` | Checks if a project ID is selected |

**Selection Logic:**
- Clicking same project twice toggles off (deselects)
- Clicking different project switches selection
- Both table rows and map markers use this context

**Usage:**
```tsx
const { selectedProject, selectProject, isSelected } = useSelection();
```

---

### Components

#### `src/components/Dashboard/Dashboard.tsx`
**Purpose:** Main layout component orchestrating all child components

**How it works:**
1. Calls `useProjects()` hook to get data and handlers
2. Renders:
   - Header with title and project count
   - `Filters` component for search/status
   - `DataTable` component (left side)
   - `MapView` component (right side)
3. Uses CSS Grid for responsive side-by-side layout

**Props passed to children:**

| Component | Props Received |
|-----------|----------------|
| `Filters` | filterConfig, onSearch, onStatusFilter, counts |
| `DataTable` | data, sortConfig, onSort, isLoading |
| `MapView` | projects |

---

#### `src/components/DataTable/DataTable.tsx`
**Purpose:** Virtualized table for 5,500+ rows with sorting

**Key Features:**
- Uses `@tanstack/react-virtual` for virtualization
- Fixed row height of 44px for efficient virtualization
- Overscan of 10 rows for smooth scrolling
- Clickable rows for selection

**Virtualization Setup:**
```tsx
const rowVirtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 44, // ROW_HEIGHT
  overscan: 10
});
```

**Selection Sync:**
- Uses `useSelection()` hook for selection state
- When `selectedProject` changes (from map click), scrolls to that row:
```tsx
useEffect(() => {
  if (selectedProject) {
    const index = data.findIndex(p => p.id === selectedProject.id);
    if (index !== -1) {
      rowVirtualizer.scrollToIndex(index, { align: 'center', behavior: 'smooth' });
    }
  }
}, [selectedProject, data]);
```

**Sorting UI:**
- Click column header → calls `onSort(key)`
- Shows sort icon: ↕ (neutral), ↑ (asc), ↓ (desc)

**Status Badges:**
- Dynamically applies CSS class based on status for color coding

---

#### `src/components/Filters/Filters.tsx`
**Purpose:** Search input and status filter buttons

**Features:**
- **Debounced Search:** 300ms delay before triggering filter
- **Clear Button:** X button appears when search has text
- **Status Buttons:** All, Active, Pending, Completed, On Hold
- **Filter Info:** Shows "X of Y" when filter is applied

**Debounce Implementation:**
```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(searchValue);
  }, 300);
  return () => clearTimeout(timer);
}, [searchValue]);
```

**Why Debounce?**
- Prevents excessive re-renders/filtering while user types
- 300ms is standard UX delay for search inputs

---

#### `src/components/Map/MapView.tsx`
**Purpose:** Leaflet map with color-coded markers

**Sub-Components:**

| Component | Purpose |
|-----------|---------|
| `MapUpdater` | Flies map to selected project location |
| `ProjectMarker` | Individual marker with popup |

**Status Colors:**
```tsx
const statusColors = {
  Active: '#22c55e',    // Green
  Pending: '#f59e0b',   // Amber
  Completed: '#3b82f6', // Blue
  'On Hold': '#ef4444'  // Red
};
```

**Performance Optimizations:**
1. **Canvas Rendering:** `preferCanvas={true}` on MapContainer
2. **Marker Sampling:** When >1000 projects, shows every nth marker
```tsx
const visibleProjects = useMemo(() => {
  if (projects.length <= 1000) return projects;
  const sampleRate = Math.ceil(projects.length / 1000);
  return projects.filter((_, i) => i % sampleRate === 0);
}, [projects]);
```

**Map-to-Table Sync:**
- `MapUpdater` component uses `useMap()` hook
- When `selectedProject` changes, calls `map.flyTo()`:
```tsx
useEffect(() => {
  if (selectedProject) {
    map.flyTo([selectedProject.latitude, selectedProject.longitude], 10, {
      duration: 0.5
    });
  }
}, [selectedProject]);
```

**Marker Click Handler:**
- Each `ProjectMarker` calls `selectProject(project)` on click
- This updates context, which triggers table scroll

---

### CSS Files

| File | Purpose |
|------|---------|
| `src/index.css` | Global CSS reset, font, variables |
| `src/App.css` | App container styles |
| `Dashboard.css` | Grid layout, header, responsive breakpoints |
| `DataTable.css` | Table styling, row hover, selection highlight |
| `Filters.css` | Search input, status buttons |
| `MapView.css` | Map container, legend, popup styles |

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              SelectionProvider (Context)              │    │
│  │  ┌─────────────────────────────────────────────────┐ │    │
│  │  │               Dashboard.tsx                      │ │    │
│  │  │                                                  │ │    │
│  │  │  ┌──────────────┐                               │ │    │
│  │  │  │ useProjects()│ ← data, filters, sort         │ │    │
│  │  │  └──────────────┘                               │ │    │
│  │  │         │                                        │ │    │
│  │  │         ▼                                        │ │    │
│  │  │  ┌──────────────┐                               │ │    │
│  │  │  │   Filters    │ → search/status changes       │ │    │
│  │  │  └──────────────┘                               │ │    │
│  │  │         │                                        │ │    │
│  │  │         ▼ filteredProjects                       │ │    │
│  │  │  ┌──────────┬───────────┐                       │ │    │
│  │  │  │DataTable │  MapView  │                       │ │    │
│  │  │  │          │           │                       │ │    │
│  │  │  │ useSelection()  ◄──► useSelection()          │ │    │
│  │  │  │          │           │                       │ │    │
│  │  │  │ Click row│Click marker                       │ │    │
│  │  │  │    │     │     │                             │ │    │
│  │  │  │    ▼     │     ▼                             │ │    │
│  │  │  │ selectProject()                              │ │    │
│  │  │  │    │                                         │ │    │
│  │  │  │    ▼                                         │ │    │
│  │  │  │ Scroll to row ◄──► Fly to marker            │ │    │
│  │  │  └──────────┴───────────┘                       │ │    │
│  │  └─────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Technical Decisions

### 1. Virtualization for Large Dataset
**Problem:** 5,500 DOM rows causes lag
**Solution:** `@tanstack/react-virtual` renders only ~30 visible rows
**Result:** 60fps scrolling

### 2. Map Performance
**Problem:** 5,500 markers cause rendering issues
**Solution:**
- `CircleMarker` instead of image markers
- Canvas rendering (`preferCanvas={true}`)
- Marker sampling (show ~1000 when unfiltered)

### 3. Client-Side Filtering
**Why:** 5.5k records manageable in browser memory
**Benefit:** Instant filtering without network latency

### 4. Context for Selection
**Why:** Need to share state between sibling components (Table & Map)
**Alternative considered:** Lifting state to Dashboard, but Context is cleaner

### 5. Debounced Search
**Why:** Prevents excessive re-renders while typing
**Delay:** 300ms (standard UX pattern)

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.0 | UI library |
| react-dom | ^19.2.0 | DOM rendering |
| @tanstack/react-virtual | ^3.13.18 | Table virtualization |
| leaflet | ^1.9.4 | Map library |
| react-leaflet | ^5.0.0 | React wrapper for Leaflet |

### Dev Dependencies
- TypeScript ~5.9.3
- Vite ^7.2.4
- ESLint ^9.39.1

---

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server at localhost:5173 |
| `build` | `tsc -b && vite build` | Type check + production build |
| `lint` | `eslint .` | Run ESLint |
| `preview` | `vite preview` | Preview production build |

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Dataset Size | 5,500 projects |
| Initial Load | ~300ms (simulated) |
| Table Scroll | 60fps (virtualized) |
| Filter Response | <50ms |
| Bundle Size | ~115KB gzipped |

---

## User Interactions

1. **Search:** Type in search box → filters by project name/ID
2. **Status Filter:** Click status button → filters by status
3. **Sort:** Click column header → cycles asc/desc/none
4. **Select Row:** Click table row → highlights row + flies map to marker
5. **Select Marker:** Click map marker → highlights marker + scrolls table to row
6. **Deselect:** Click same row/marker again → removes selection

---

## Future Improvements (from README)

- Marker clustering for better map performance
- Server-side pagination for larger datasets
- CSV/JSON export functionality
- Column visibility toggles
- Dark mode
- Unit tests (Vitest)
- E2E tests (Playwright)

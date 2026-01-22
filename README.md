# Geo Data Dashboard

A React-based geospatial data visualization dashboard that displays 5,500+ project locations on an interactive map alongside a virtualized data table.

## Features

- **Data Table**: Virtualized table handling 5,500+ rows without lag
  - Sortable columns (Project Name, Latitude, Longitude, Status, Last Updated)
  - Client-side search filtering
  - Status-based filtering (Active, Pending, Completed, On Hold)

- **Interactive Map**: Leaflet-powered map visualization
  - Color-coded markers by project status
  - Popup details on marker click
  - Automatic sampling for performance (shows ~1000 markers from large datasets)

- **Bidirectional Highlighting**:
  - Click a table row → map flies to that marker and highlights it
  - Click a map marker → table scrolls to that row and highlights it
  - Click again to deselect

## Tech Stack

| Category | Choice | Reasoning |
|----------|--------|-----------|
| Framework | React + Vite | Fast development server, optimized builds, modern tooling |
| Language | TypeScript | Type safety, better IDE support, self-documenting code |
| Map Library | Leaflet + react-leaflet | Lightweight, well-documented, free OpenStreetMap tiles |
| Virtualization | @tanstack/react-virtual | Best-in-class performance for large lists, framework-agnostic |
| UI Styling | Custom CSS | Minimal bundle size, full control, no external dependencies |
| State Management | React Context + Hooks | Simple, sufficient for this use case, no external libraries needed |

## Architecture Decisions

### 1. Performance Optimization for 5k+ Rows

**Problem**: Rendering 5,500 DOM elements simultaneously causes lag.

**Solution**:
- Used `@tanstack/react-virtual` for table virtualization - only renders visible rows (~20-30)
- Row height is fixed at 44px for efficient virtualization
- Overscan of 10 rows provides smooth scrolling experience

### 2. Map Performance

**Problem**: 5,500 markers on a map can cause rendering issues.

**Solution**:
- Used `CircleMarker` instead of image-based markers (better performance)
- Enabled `preferCanvas={true}` on MapContainer for canvas rendering
- Implemented marker sampling - shows ~1000 representative markers when viewing full dataset
- When filters are applied (reducing dataset), all markers are shown

### 3. State Management

**Problem**: Need to share selection state between table and map components.

**Solution**:
- Created `SelectionProvider` context for shared state
- `useSelection` hook provides clean API for components
- Separate `useProjects` hook handles data fetching, filtering, and sorting
- Clear separation between UI logic and data logic

### 4. Data Architecture

**Mock Data Design**:
- Generated 5,500 unique projects with realistic names
- Coordinates distributed globally using deterministic + random algorithm
- Four status types with random distribution
- Dates ranging from 2020 to present

**Why Client-Side Filtering**:
- Dataset size (5.5k) is manageable in memory
- Instant filtering response without network latency
- Simplified architecture for demo purposes

### 5. UI/UX Decisions

- **Debounced Search**: 300ms delay prevents excessive re-renders while typing
- **Sort Cycling**: Click column header cycles through: ascending → descending → none
- **Visual Feedback**: Highlighted rows/markers use blue theme for clear selection indication
- **Responsive Layout**: Grid layout adapts from side-by-side to stacked on smaller screens

## Project Structure

```
src/
├── components/
│   ├── Dashboard/        # Main layout component
│   ├── DataTable/        # Virtualized table with sorting
│   ├── Filters/          # Search and status filters
│   └── Map/              # Leaflet map with markers
├── hooks/
│   ├── useProjects.ts    # Data fetching, filtering, sorting logic
│   └── useSelection.tsx  # Shared selection state (Context)
├── data/
│   └── mockData.ts       # Mock data generator (5,500 projects)
├── types/
│   └── index.ts          # TypeScript interfaces
└── App.tsx               # Root component with providers
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended 20.19+ for Vite)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The development server runs at `http://localhost:5173` by default.

## Usage

1. **Browse Data**: Scroll through the virtualized table to view projects
2. **Search**: Type in the search box to filter by project name
3. **Filter by Status**: Click status buttons to filter (All, Active, Pending, etc.)
4. **Sort**: Click column headers to sort (↕ neutral, ↑ asc, ↓ desc)
5. **Select**: Click a row or marker to highlight and sync views
6. **Map Navigation**: Use scroll wheel to zoom, drag to pan

## Performance Metrics

| Metric | Value |
|--------|-------|
| Dataset Size | 5,500 projects |
| Initial Load | ~300ms (simulated API delay) |
| Table Scroll | 60fps (virtualized) |
| Filter Response | <50ms |
| Bundle Size | ~115KB gzipped |

## Screenshots

### Dashboard Overview
The main dashboard shows the data table on the left and the interactive map on the right.

### Filtering
Status filters and search work in real-time to narrow down results.

### Selection Sync
Clicking a row highlights the corresponding marker on the map, and vice versa.

<<<<<<< HEAD
---
=======
---
>>>>>>> 2ad14584d42381b081ff6c7df2a551f6b752bc6a

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, Popup } from 'react-leaflet';
import type { Project } from '../../types';
import { useSelection } from '../../hooks';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

interface MapViewProps {
  projects: Project[];
}

// Status colors for markers
const statusColors: Record<string, string> = {
  Active: '#22c55e',
  Pending: '#f59e0b',
  Completed: '#3b82f6',
  'On Hold': '#ef4444'
};

// Component to handle map view changes when selection changes
const MapUpdater = ({ selectedProject }: { selectedProject: Project | null }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedProject) {
      map.flyTo([selectedProject.latitude, selectedProject.longitude], 10, {
        duration: 0.5
      });
    }
  }, [selectedProject, map]);

  return null;
};

// Individual marker component for performance
const ProjectMarker = ({
  project,
  isSelected,
  onSelect
}: {
  project: Project;
  isSelected: boolean;
  onSelect: (project: Project) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(project);
  }, [project, onSelect]);

  return (
    <CircleMarker
      center={[project.latitude, project.longitude]}
      radius={isSelected ? 12 : 6}
      pathOptions={{
        fillColor: statusColors[project.status],
        fillOpacity: isSelected ? 1 : 0.7,
        color: isSelected ? '#1e3a8a' : statusColors[project.status],
        weight: isSelected ? 3 : 1
      }}
      eventHandlers={{
        click: handleClick
      }}
    >
      <Popup>
        <div className="marker-popup">
          <h4>{project.projectName}</h4>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`popup-status status-${project.status.toLowerCase().replace(' ', '-')}`}>
              {project.status}
            </span>
          </p>
          <p>
            <strong>Coordinates:</strong> {project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}
          </p>
          <p>
            <strong>Last Updated:</strong> {project.lastUpdated}
          </p>
        </div>
      </Popup>
    </CircleMarker>
  );
};

export const MapView = ({ projects }: MapViewProps) => {
  const { selectedProject, selectProject, isSelected } = useSelection();
  const mapRef = useRef(null);

  // Limit visible markers for performance - show all when filtered, limit when showing all
  const visibleProjects = useMemo(() => {
    // If we have a selection or filter is applied (fewer items), show all
    if (selectedProject || projects.length <= 1000) {
      return projects;
    }
    // For large unfiltered sets, sample markers for performance
    // Show every nth marker to keep around 1000 visible
    const sampleRate = Math.ceil(projects.length / 1000);
    return projects.filter((_, i) => i % sampleRate === 0);
  }, [projects, selectedProject]);

  // Center map based on data or default to world view
  const center = useMemo((): [number, number] => {
    if (selectedProject) {
      return [selectedProject.latitude, selectedProject.longitude];
    }
    if (projects.length > 0) {
      // Calculate centroid of visible projects
      const lats = projects.slice(0, 100).map(p => p.latitude);
      const lngs = projects.slice(0, 100).map(p => p.longitude);
      return [
        lats.reduce((a, b) => a + b, 0) / lats.length,
        lngs.reduce((a, b) => a + b, 0) / lngs.length
      ];
    }
    return [20, 0]; // Default world center
  }, [projects, selectedProject]);

  return (
    <div className="map-container">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={2}
        className="leaflet-map"
        scrollWheelZoom={true}
        preferCanvas={true} // Better performance for many markers
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater selectedProject={selectedProject} />

        {visibleProjects.map(project => (
          <ProjectMarker
            key={project.id}
            project={project}
            isSelected={isSelected(project.id)}
            onSelect={selectProject}
          />
        ))}
      </MapContainer>

      <div className="map-legend">
        <div className="legend-title">Status Legend</div>
        <div className="legend-items">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: color }} />
              {status}
            </div>
          ))}
        </div>
        {projects.length > 1000 && !selectedProject && (
          <div className="map-note">
            Showing {visibleProjects.length.toLocaleString()} of {projects.length.toLocaleString()} markers
          </div>
        )}
      </div>
    </div>
  );
};

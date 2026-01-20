import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Project, SortConfig } from '../../types';
import { useSelection } from '../../hooks';
import './DataTable.css';

interface DataTableProps {
  data: Project[];
  sortConfig: SortConfig;
  onSort: (key: keyof Project) => void;
  isLoading: boolean;
}

const ROW_HEIGHT = 44;

export const DataTable = ({ data, sortConfig, onSort, isLoading }: DataTableProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { selectedProject, selectProject, isSelected } = useSelection();

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10
  });

  // Scroll to selected row when selection changes from map
  useEffect(() => {
    if (selectedProject) {
      const index = data.findIndex(p => p.id === selectedProject.id);
      if (index !== -1) {
        rowVirtualizer.scrollToIndex(index, { align: 'center', behavior: 'smooth' });
      }
    }
  }, [selectedProject, data, rowVirtualizer]);

  const getSortIcon = (key: keyof Project) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getStatusClass = (status: string) => {
    return `status-badge status-${status.toLowerCase().replace(' ', '-')}`;
  };

  if (isLoading) {
    return (
      <div className="table-container loading">
        <div className="spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <div className="header-cell" onClick={() => onSort('projectName')}>
          Project Name {getSortIcon('projectName')}
        </div>
        <div className="header-cell" onClick={() => onSort('latitude')}>
          Latitude {getSortIcon('latitude')}
        </div>
        <div className="header-cell" onClick={() => onSort('longitude')}>
          Longitude {getSortIcon('longitude')}
        </div>
        <div className="header-cell" onClick={() => onSort('status')}>
          Status {getSortIcon('status')}
        </div>
        <div className="header-cell" onClick={() => onSort('lastUpdated')}>
          Last Updated {getSortIcon('lastUpdated')}
        </div>
      </div>

      <div
        ref={parentRef}
        className="table-container"
        style={{ height: '100%', overflow: 'auto' }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const project = data[virtualRow.index];
            const selected = isSelected(project.id);

            return (
              <div
                key={project.id}
                className={`table-row ${selected ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
                onClick={() => selectProject(project)}
              >
                <div className="cell project-name" title={project.projectName}>
                  {project.projectName}
                </div>
                <div className="cell">{project.latitude.toFixed(4)}</div>
                <div className="cell">{project.longitude.toFixed(4)}</div>
                <div className="cell">
                  <span className={getStatusClass(project.status)}>
                    {project.status}
                  </span>
                </div>
                <div className="cell">{project.lastUpdated}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="table-footer">
        Showing {data.length.toLocaleString()} projects
      </div>
    </div>
  );
};

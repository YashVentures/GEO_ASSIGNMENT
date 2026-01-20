import { DataTable } from '../DataTable';
import { Filters } from '../Filters';
import { MapView } from '../Map';
import { useProjects } from '../../hooks';
import './Dashboard.css';

export const Dashboard = () => {
  const {
    projects,
    filteredProjects,
    isLoading,
    sortConfig,
    filterConfig,
    handleSort,
    handleSearch,
    handleStatusFilter
  } = useProjects();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Geo Data Dashboard</h1>
        <p className="header-subtitle">
          Interactive visualization of {projects.length.toLocaleString()} geo-spatial projects
        </p>
      </header>

      <div className="dashboard-filters">
        <Filters
          filterConfig={filterConfig}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          totalCount={projects.length}
          filteredCount={filteredProjects.length}
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-table">
          <DataTable
            data={filteredProjects}
            sortConfig={sortConfig}
            onSort={handleSort}
            isLoading={isLoading}
          />
        </div>

        <div className="dashboard-map">
          <MapView projects={filteredProjects} />
        </div>
      </div>
    </div>
  );
};

import { useState, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Project } from '../types';

interface SelectionContextType {
  selectedProject: Project | null;
  selectProject: (project: Project | null) => void;
  isSelected: (projectId: string) => boolean;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

interface SelectionProviderProps {
  children: ReactNode;
}

export const SelectionProvider = ({ children }: SelectionProviderProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectProject = useCallback((project: Project | null) => {
    setSelectedProject(prev => {
      // Toggle off if clicking the same project
      if (prev?.id === project?.id) {
        return null;
      }
      return project;
    });
  }, []);

  const isSelected = useCallback((projectId: string): boolean => {
    return selectedProject?.id === projectId;
  }, [selectedProject]);

  return (
    <SelectionContext.Provider value={{ selectedProject, selectProject, isSelected }}>
      {children}
    </SelectionContext.Provider>
  );
};

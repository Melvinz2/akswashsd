
import { Project } from '../types';
import { INITIAL_PROJECTS } from '../constants';

const PROJECTS_KEY = 'codevault_projects_db';

/**
 * Initialize projects from LocalStorage or seed with Initial Data
 */
export const getProjects = async (): Promise<Project[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const storedProjects = localStorage.getItem(PROJECTS_KEY);
  
  if (!storedProjects) {
    // Seed initial data
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }

  try {
    return JSON.parse(storedProjects) as Project[];
  } catch (e) {
    // Fallback if data is corrupt
    return INITIAL_PROJECTS;
  }
};

/**
 * Add a new project to the "Database"
 */
export const addProject = async (newProject: Omit<Project, 'id'>): Promise<Project> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const projects = await getProjects();
  
  const projectWithId: Project = {
    ...newProject,
    id: `p-${Date.now()}`, // Generate simple unique ID
  };

  const updatedProjects = [projectWithId, ...projects]; // Add to top
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));

  return projectWithId;
};

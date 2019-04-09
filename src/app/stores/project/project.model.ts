import { ID } from '@datorama/akita';

export interface Project {
  id: ID;
}

/**
 * A factory function that creates Projects
 */
export function createProject(params: Partial<Project>) {
  return {

  } as Project;
}

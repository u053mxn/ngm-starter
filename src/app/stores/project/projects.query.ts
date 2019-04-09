import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ProjectsStore, ProjectsState } from './projects.store';
import { Project } from './project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsQuery extends QueryEntity<ProjectsState, Project> {

  constructor(protected store: ProjectsStore) {
    super(store);
  }

}

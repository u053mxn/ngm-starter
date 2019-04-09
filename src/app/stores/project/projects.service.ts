import { Injectable } from '@angular/core';
import {HashMap, ID} from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { ProjectsStore } from './projects.store';
import { Project } from './project.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  constructor(private projectsStore: ProjectsStore,
              private http: HttpClient) {
  }

  get() {
    return this.http.get('https://api.com').pipe(tap((entities: HashMap<Project>) => {
      this.projectsStore.set(entities);
    }));
  }

  add(project: Project) {
    this.projectsStore.add(project);
  }

  update(id, project: Partial<Project>) {
    this.projectsStore.update(id, project);
  }

  remove(id: ID) {
    this.projectsStore.remove(id);
  }
}

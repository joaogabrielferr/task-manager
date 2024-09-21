import { Routes } from '@angular/router';
import { TasksComponent } from './modules/task/pages/tasks/tasks.component';

export const routes: Routes = [
  {
    path:'',
    component:TasksComponent
  },
  {
    path:'tasks',
    component:TasksComponent
  }
];

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskViewComponent } from './task-view/task-view.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskAddComponent } from './task-add/task-add.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskListResolver } from '@app/core/resolvers';
import { TaskComponent } from './task.component';

const routes: Routes = [
  {
    path: '', component: TaskComponent, children: [
      { path: 'list', component: TaskListComponent, resolve: { tasks: TaskListResolver } },
      { path: 'view/:id', component: TaskViewComponent },
      { path: 'edit/:id', component: TaskEditComponent },
      { path: 'add', component: TaskAddComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }

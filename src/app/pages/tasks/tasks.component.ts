import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TaskService } from '../../task/task.service';
import { ProgressStatus, Task } from '../../task/task.model';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatButtonModule} from '@angular/material/button';
import { Store } from '@ngrx/store';
import { taskActions } from '../../task/state/task.actions';
import { getTasksSelector, getTasksStatus } from '../../task/state/task.selectors';
import { TaskState, TaskStatus } from '../../task/state/task.reducer';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule,DragDropModule,MatIconModule,NgxSkeletonLoaderModule,MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit,OnDestroy {

  private taskService = inject(TaskService);
  store = inject(Store);

  TaskProgress = ProgressStatus;
  TasksLoadingStatus = TaskStatus;

  tasks: Task[] = [];
  tasksSubscription: Subscription = this.store.select(getTasksSelector).subscribe((tasks:Task[])=>this.tasks = tasks);

  loadingStatus: TaskStatus = TaskStatus.pending;
  loadingStatusSubscription: Subscription = this.store.select(getTasksStatus).subscribe((status=>this.loadingStatus = status));



  ngOnInit(): void {
    this.store.dispatch(taskActions.getTasks());
  }


  ngOnDestroy(): void {
    if(this.tasksSubscription)this.tasksSubscription.unsubscribe();
    if(this.loadingStatusSubscription)this.loadingStatusSubscription.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
     let newTasksOrder = [...this.tasks];
      moveItemInArray(newTasksOrder, event.previousIndex, event.currentIndex);
      this.store.dispatch(taskActions.updateTasksOrder({tasks:newTasksOrder}));
  }


}

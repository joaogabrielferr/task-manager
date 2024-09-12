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
import { getTasksAndOrderSelector, getTasksStatus } from '../../task/state/task.selectors';
import { TaskStatus } from '../../task/state/task.reducer';
import { TaskFormComponent } from "../../components/task-form/task-form.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, NgxSkeletonLoaderModule, MatButtonModule, TaskFormComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit,OnDestroy {

  store = inject(Store);

  TaskProgress = ProgressStatus;
  TasksLoadingStatus = TaskStatus;

  tasks: {
    entities:Task[],
    tasksOrder:number[]
  } = {
    entities:[],
    tasksOrder:[]
  };

  taskList: Array<Task> = new Array();

  //subscribing manually to be able to use function moveItemInArray after dragging and dropping a task
  tasksSubscription: Subscription = this.store.select(getTasksAndOrderSelector).subscribe((tasks)=>{
    const entities = tasks.entities;
    const order = tasks.tasksOrder;
    this.taskList = new Array(order.length);
    order.forEach((id,index)=>{
      this.taskList[index] = entities[id];
    });

  });

  loadingStatus: TaskStatus = TaskStatus.pending;
  loadingStatusSubscription: Subscription = this.store.select(getTasksStatus).subscribe((status=>this.loadingStatus = status));

  isTaskFormOpened: boolean = false;

  ngOnInit(): void {
    this.store.dispatch(taskActions.getTasks());
  }

  ngOnDestroy(): void {
    if(this.tasksSubscription)this.tasksSubscription.unsubscribe();
    if(this.loadingStatusSubscription)this.loadingStatusSubscription.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {

      moveItemInArray(this.taskList, event.previousIndex, event.currentIndex);
      // console.log("new list:",this.taskList);
      const newTaskOrder = this.taskList.map((task)=>task.id);
      this.store.dispatch(taskActions.updateTasksOrder({tasksIds:newTaskOrder}));
  }

  toggleFormView(){
    this.isTaskFormOpened = !this.isTaskFormOpened;
  }

}

import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TaskService } from '../../task/task.service';
import { ProgressStatus, Task } from '../../task/task.model';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule,CdkDragPreview } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatButtonModule} from '@angular/material/button';
import { Store } from '@ngrx/store';
import { taskActions } from '../../task/state/task.actions';
import { getSelectedTask, getTasksAndOrderSelector, getTasksStatus } from '../../task/state/task.selectors';
import { SelectedTask, TaskStatus } from '../../task/state/task.reducer';
import { TaskFormComponent } from "../../components/task-form/task-form.component";
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, NgxSkeletonLoaderModule, MatButtonModule, TaskFormComponent, CdkDragPreview, MatMenuModule, MatProgressSpinnerModule, ConfirmationModalComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit,OnDestroy {

  store = inject(Store);
  readonly dialog = inject(MatDialog);

  private unsubscribeAll: Subject<any> = new Subject<any>();

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
  loadingStatus: TaskStatus = TaskStatus.pending;
  selectedTask: SelectedTask | null = null;
  isTaskFormOpened: boolean = false;

  ngOnInit(): void {
    this.store.dispatch(taskActions.getTasks());

    //subscribing manually to be able to use function moveItemInArray after dragging and dropping a task
    this.store.select(getTasksAndOrderSelector).
      pipe(
      takeUntil(this.unsubscribeAll)
      ).subscribe((tasks)=>{
      const entities = tasks.entities;
      const order = tasks.tasksOrder;
      this.taskList = new Array(order.length);
      order.forEach((id,index)=>{
        this.taskList[index] = entities[id];
      });
    });

    this.store.select(getTasksStatus).pipe(
      takeUntil(this.unsubscribeAll)
      ).subscribe((status=>this.loadingStatus = status));

    this.store.select(getSelectedTask).pipe(
      takeUntil(this.unsubscribeAll)
      ).subscribe((t)=>this.selectedTask = t);

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.taskList, event.previousIndex, event.currentIndex);
      const newTaskOrder = this.taskList.map((task)=>task.id);
      this.store.dispatch(taskActions.updateTasksOrder({tasksIds:newTaskOrder}));
  }

  toggleFormView(){
    this.isTaskFormOpened = !this.isTaskFormOpened;
  }

  changeStatus(task:Task,newStatus:ProgressStatus){
    this.store.dispatch(taskActions.changeProgressStatus({selectedTaskId:task.id,newStatus}));
  }

  getProgressStatusName(status:ProgressStatus){
    switch(status){
      case ProgressStatus.TO_DO:
        return 'TO DO';
      case ProgressStatus.IN_PROGRESS:
        return 'IN PROGRESS';
      case ProgressStatus.DONE:
        return 'DONE';
    }
  }

  removeTask(id:number){
    this.store.dispatch(taskActions.deleteSelectedTask({id}));
  }

  openDialog(id:number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data: {title: "Delete task", text:"Do you really want to delete this task?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeTask(id);
      }
    });
  }

}

import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TaskService } from '../../task/task.service';
import { Status, Task } from '../../task/task.model';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule,DragDropModule,MatIconModule,NgxSkeletonLoaderModule,MatButtonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit,OnDestroy {

  StatusEnum = Status;

  private taskService = inject(TaskService);

  tasks: Task[] = [];
  tasksSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.tasksSubscription = this.taskService.getTasks().subscribe(tasks=>{
      this.tasks = tasks;
      console.log("new value:",this.tasks);
    })
  }


  ngOnDestroy(): void {
    if(this.tasksSubscription){
      this.tasksSubscription.unsubscribe();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
      this.taskService.updateTasksOrder(this.tasks);
  }

  getStatus(status:Status){

  }

}

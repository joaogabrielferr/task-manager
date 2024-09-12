import { Inject, Injectable } from "@angular/core";
import { ProgressStatus, Task } from "./task.model";
import { BehaviorSubject, delay, of } from "rxjs";

@Injectable({
  providedIn:'root'
})
export class TaskService{

  private db = {
    tasks:[
      {
        id:1,
        title:'task 1',
        description:'this is task 1',
        status:ProgressStatus.TO_DO,
        priority:1
      } as Task,
      {
        id:2,
        title:'task 2',
        description:'this is task 2',
        status:ProgressStatus.IN_PROGRESS,
        priority:1
      } as Task,
      {
        id:3,
        title:'task 3',
        description:'this is task 3',
        status:ProgressStatus.DONE,
        priority:2
      } as Task,
    ]
  }


  getTasks(){
    return of(this.db.tasks).pipe(delay(1000));
  }

  addTask(task:Task){
    const newTask = {...task};
    const tasks = this.db.tasks;
    let biggestId = 0;
    tasks.forEach((task)=>{
      biggestId = Math.max(biggestId,task.id);
    });

    newTask.id = biggestId + 1;
    this.db.tasks = [newTask,...this.db.tasks];

    return of(newTask).pipe(delay(1000));
  }

}

import { Inject, Injectable } from "@angular/core";
import { ProgressStatus, Task } from "./task.model";
import { BehaviorSubject, delay, of } from "rxjs";

@Injectable({
  providedIn:'root'
})
export class TaskService{

  private _tasks$ = new BehaviorSubject(
    [
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
  );

  tasks$ = this._tasks$.asObservable();

  getTasks(){
    return this.tasks$.pipe(delay(1000));
  }
}

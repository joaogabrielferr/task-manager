import { Inject, Injectable } from "@angular/core";
import { Status, Task } from "./task.model";
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
        status:Status.TO_DO,
        priority:1
      } as Task,
      {
        id:2,
        title:'task 2',
        description:'this is task 2',
        status:Status.IN_PROGRESS,
        priority:1
      } as Task,
      {
        id:3,
        title:'task 3',
        description:'this is task 3',
        status:Status.DONE,
        priority:2
      } as Task,
    ]
  );

  tasks$ = this._tasks$.asObservable();

  getTasks(){
    return this.tasks$.pipe(delay(1000));
  }

  updateTasksOrder(tasks:Task[]){
    this._tasks$.next([...tasks]);
  }

}

import { Inject, Injectable } from "@angular/core";
import { ProgressStatus, Task } from "./task.model";
import { BehaviorSubject, delay, Observable, of, switchMap, throwError } from "rxjs";
import { TaskStatus } from "./state/task.reducer";

export interface DB{
  tasks:Task[],
  taskOrder:number[]
}

@Injectable({
  providedIn:'root'
})
export class TaskService{

  private readonly LOCAL_STORAGE_KEY = 'task-service';

  constructor(){
    const string = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if(!string){
      const welcomeTask1 = {
        title:'New added tasks appear on this list',
        id:1,
        status:ProgressStatus.DONE,
      } as Task;
      const welcomeTask2 = {
        title:'Drag and drop tasks to change their order',
        id:2,
        status:ProgressStatus.TO_DO,
      } as Task;
      localStorage.setItem(this.LOCAL_STORAGE_KEY,JSON.stringify({tasks:[welcomeTask1,welcomeTask2],taskOrder:[2,1]} as DB));
    }
  }

  saveToLocalStorage(item: DB){
    localStorage.setItem(this.LOCAL_STORAGE_KEY,JSON.stringify(item));
  }

  getTasks():Observable<DB>{
    const data_string = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if(!data_string){
      throwError(()=>new Error('no tasks'));
    }
    const data: DB = JSON.parse(data_string!);
    return of({tasks:data.tasks,taskOrder:data.taskOrder}).pipe(delay(1000));
  }

  addTask(task:Task):Observable<Task>{
    const newTask = {...task};
    return this.getTasks().pipe(
      switchMap((data:DB)=>{
        const newState = {...data};
        let biggestId = 1;
        if(newState.tasks.length){
          newState.tasks.forEach(t=>
            {
              biggestId = Math.max(biggestId,t.id)
            });
          }
        newTask.id = biggestId + 1;
        if(!newState.taskOrder)newState.taskOrder = [];
        newState.taskOrder.unshift(newTask.id);
        if(!newState.tasks)newState.tasks = [];
        newState.tasks.push(newTask);
        this.saveToLocalStorage(newState);
        return of(newTask);
      })
    )
  }

  updateTaskOrder(order:number[]):Observable<number[]>{
    return this.getTasks().pipe(
      switchMap((data:DB)=>{
        const newState = {...data};
        newState.taskOrder = order;
        this.saveToLocalStorage(newState);
        return of(newState.taskOrder);
      })
    );
  }

  changeTaskStatus(selectedTaskId:number,newStatus:ProgressStatus):Observable<Task>{
    return this.getTasks().pipe(
      switchMap((data:DB)=>{
        const newState = {...data};
        let index = newState.tasks.findIndex(t=>t.id == selectedTaskId)!;
        newState.tasks[index].status = newStatus;
        this.saveToLocalStorage(newState);
        return of(newState.tasks[index]).pipe(delay(1000));
      })
    )

  };

  deleteTask(id:number){
    return this.getTasks().pipe(
      switchMap((data:DB)=>{
        const newState = {...data};
        let index = newState.tasks.findIndex(t=>t.id == id)!;
        newState.tasks.splice(index,1);
        const indexOder = newState.taskOrder.findIndex(t=>t === id);
        newState.taskOrder.splice(indexOder,1);
        this.saveToLocalStorage(newState);
        return of(id).pipe(delay(1000));
      })
    );
  }


}

import { createReducer, on } from "@ngrx/store";
import { ProgressStatus, Task } from "../task.model";
import { taskActions } from "./task.actions";

export enum TaskStatus{
  loading = 'loading',
  pending = 'pending',
  error = 'error',
  success = 'success'
}

export interface TaskState{
  tasks: Task[];
  error: '' | null;
  status: TaskStatus;
}

const inititalState: TaskState = {
  error:null,
  status:TaskStatus.pending,
  tasks:[]
}

export const taskReducer = createReducer(inititalState,
  on(taskActions.getTasks,(currentState)=>{
    return {
      ...currentState,
      status:TaskStatus.loading,
    };
  }),
  on(taskActions.getTasksSuccess,(currentState,tasksObj)=>{
    return {
      ...currentState,
      tasks: tasksObj.tasks,
      status:TaskStatus.success
    }
  }),
  on(taskActions.getTasksFailure,(currentState,error)=>{
    return {
      ...currentState,
      status:TaskStatus.error
    };
  }),
  on(taskActions.updateTasksOrder,(currentState,newTaskOrderObj)=>{
    return {
      ...currentState,
      tasks:newTaskOrderObj.tasks
    };
  })
)

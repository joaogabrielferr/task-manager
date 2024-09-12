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
  tasks: {[id:number]:Task};
  tasksOrder: number[];
  error: any | null;
  status: TaskStatus;
  selectedTaskId:number | null;
  selectedTaskError: any | null;
  selectedTaskStatus: TaskStatus;
}

const inititalState: TaskState = {
  error:null,
  status:TaskStatus.pending,
  tasks:{},
  tasksOrder:[],
  selectedTaskId: null,
  selectedTaskError:null,
  selectedTaskStatus: TaskStatus.pending
}

export const taskReducer = createReducer(inititalState,


  on(taskActions.getTasks,(currentState)=>{
    return {
      ...currentState,
      status:TaskStatus.loading,
    };
  }),


  on(taskActions.getTasksSuccess,(currentState,tasksObj)=>{
    const tasksById = tasksObj.tasks.reduce((entities,task)=>{
      return {...entities,[task.id]:task};
    },{});

    const tasksOrder = tasksObj.tasks.map(task=>task.id);

    return {
      ...currentState,
      tasks: tasksById,
      tasksOrder:tasksOrder,
      status:TaskStatus.success
    }
  }),


  on(taskActions.getTasksFailure,(currentState,error)=>{
    return {
      ...currentState,
      status:TaskStatus.error,
      error: error.error
    };
  }),


  on(taskActions.updateTasksOrder,(currentState,newTaskOrder)=>{
    return {
      ...currentState,
      tasksOrder:newTaskOrder.tasksIds
    };
  }),


  on(taskActions.addTask,(currentState,task)=>{
    return {
      ...currentState,
      selectedTaskStatus: TaskStatus.loading
    };
  }),


  on(taskActions.addTaskSuccess,(currentState,newTask)=>{
    console.log("task added:",newTask);
    return {
      ...currentState,
      tasks:{...currentState.tasks,[newTask.id]:newTask},
      tasksOrder:[newTask.id,...currentState.tasksOrder],
      selectedTaskStatus:TaskStatus.success
    }
  }),



  on(taskActions.addTaskFailure,(currentState,error)=>{
    return {
      ...currentState,
      selectedTaskError:error,
      selectedTaskStatus:TaskStatus.error
    }
  }),


)

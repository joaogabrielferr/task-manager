import { createReducer, on } from "@ngrx/store";
import { ProgressStatus, Task } from "../task.model";
import { taskActions } from "./task.actions";
import { DB } from "../task.service";
import { Action } from "rxjs/internal/scheduler/Action";

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
  selectedTaskChangeProgressStatus:TaskStatus;
  selectedTaskDeleteStatus:TaskStatus;
}

const inititalState: TaskState = {
  error:null,
  status:TaskStatus.pending,
  tasks:{},
  tasksOrder:[],
  selectedTaskId: null,
  selectedTaskError:null,
  selectedTaskStatus: TaskStatus.pending,
  selectedTaskChangeProgressStatus: TaskStatus.pending,
  selectedTaskDeleteStatus: TaskStatus.pending
}

export const taskReducer = createReducer(inititalState,


  on(taskActions.getTasks,(currentState)=>{
    return {
      ...currentState,
      status:TaskStatus.loading,
    };
  }),


  on(taskActions.getTasksSuccess,(currentState,payload)=>{

    const tasksById = payload.data.tasks.reduce((entities,task)=>{
      return {...entities,[task.id]:task};
    },{});

    return {
      ...currentState,
      tasks: tasksById,
      tasksOrder:payload.data.taskOrder,
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

  on(taskActions.updateTasksOrderSuccess,(currentState,taskOrderObj)=>{
    return {
      ...currentState,
      tasksOrder:taskOrderObj.taskOrder
    }
  }),

  on(taskActions.addTask,(currentState,task)=>{
    return {
      ...currentState,
      selectedTaskStatus: TaskStatus.loading
    };
  }),


  on(taskActions.addTaskSuccess,(currentState,newTask)=>{
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

  on(taskActions.changeProgressStatus,(currentState,newStatusObj)=>{
    return {
      ...currentState,
      selectedTaskId:newStatusObj.selectedTaskId,
      selectedTaskChangeProgressStatus:TaskStatus.loading
    }
  }),

  on(taskActions.changeProgressStatusSuccess,(currentState,task:Task)=>{
    return {
      ...currentState,
      tasks:{
        ...currentState.tasks,
        [task.id]:task
      },
      selectedTaskChangeProgressStatus:TaskStatus.success
    }
  }),

  on(taskActions.deleteSelectedTask,(currentState,payload)=>{
    return {
      ...currentState,
      selectedTaskId:payload.id,
      selectedTaskDeleteStatus:TaskStatus.loading
    }
  }),

  on(taskActions.deleteSelectedTaskSuccess,(currentState,payload)=>{
    const taskList = {...currentState.tasks};
    let taskOrder = [...currentState.tasksOrder];
    delete taskList[payload.id];
    const index = taskOrder.findIndex(t=>t === payload.id);
    taskOrder.splice(index,1);
    return {
      ...currentState,
      tasks:taskList,
      tasksOrder:taskOrder,
      selectedTaskId:null,
      selectedTaskDeleteStatus:TaskStatus.success
    }
  }),


  on(taskActions.deleteSelectedTaskFailure,(currentState,payload)=>{
    return {
      ...currentState,
      selectedTaskId:null,
      selectedTaskDeleteStatus:TaskStatus.error
    }
  }),



)

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


export interface SelectedTask{
  id:number | null;
  status: TaskStatus; // Consolidated status for selected task
  error:any; // Error specific to the selected task
  changeProgressStatus: TaskStatus; // Status for progress changes
  deleteStatus: TaskStatus; // Status for task deletion

}

export interface TaskState{
  tasks: {[id:number]:Task};
  tasksOrder: number[];
  error: any | null;
  status: TaskStatus;
  selectedTask: SelectedTask;
}



const inititalState: TaskState = {
  error:null,
  status:TaskStatus.pending,
  tasks:{},
  tasksOrder:[],
  selectedTask:{
    id:null,
    status:TaskStatus.pending,
    error:null,
    changeProgressStatus:TaskStatus.pending,
    deleteStatus:TaskStatus.pending
  } as SelectedTask
}

export const taskReducer = createReducer(inititalState,


  on(taskActions.getTasks,(currentState)=>{
    return {
      ...currentState,
      status:TaskStatus.loading,
    };
  }),


  on(taskActions.getTasksSuccess,(currentState,payload)=>{

    //create object where tasks are indexed by their id
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
      selectedTask:{...currentState.selectedTask,status:TaskStatus.loading}
    };
  }),


  on(taskActions.addTaskSuccess,(currentState,newTask)=>{
    return {
      ...currentState,
      tasks:{...currentState.tasks,[newTask.id]:newTask},
      tasksOrder:[newTask.id,...currentState.tasksOrder],
      selectedTask:{...currentState.selectedTask,id:newTask.id,status:TaskStatus.success}
    }
  }),



  on(taskActions.addTaskFailure,(currentState,error)=>{
    return {
      ...currentState,
      selectedTask:{...currentState.selectedTask,status:TaskStatus.error,error}
    }
  }),

  on(taskActions.changeProgressStatus,(currentState,payload)=>{
    return {
      ...currentState,
      selectedTask:{
        ...currentState.selectedTask,
        id:payload.selectedTaskId,
        changeProgressStatus:TaskStatus.loading
      }
    }
  }),

  on(taskActions.changeProgressStatusSuccess,(currentState,task:Task)=>{
    return {
      ...currentState,
      tasks:{
        ...currentState.tasks,
        [task.id]:task
      },
      selectedTask:{...currentState.selectedTask,changeProgressStatus:TaskStatus.success}
    }
  }),

  on(taskActions.deleteSelectedTask,(currentState,payload)=>{
    return {
      ...currentState,
      selectedTask:{...currentState.selectedTask,id:payload.id,deleteStatus:TaskStatus.loading}
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
      selectedTask:{...currentState.selectedTask,deleteStatus:TaskStatus.success}
    }
  }),


  on(taskActions.deleteSelectedTaskFailure,(currentState,payload)=>{
    return {
      ...currentState,
      selectedTask:{...currentState.selectedTask,deleteStatus:TaskStatus.error}
    }
  }),



)

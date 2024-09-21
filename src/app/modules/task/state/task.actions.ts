import { createAction, props } from "@ngrx/store";
import { ProgressStatus, Task } from "../task.model";
import { DB } from "../task.service";
import { TaskStatus } from "./task.reducer";

const getTasks = createAction('[Tasks] Get Tasks');
const getTasksSuccess = createAction('[Tasks] Get Tasks Success',props<{data:DB}>());
const getTasksFailure = createAction('[Tasks] Get Tasks Failure',props<{error:any}>());

const updateTasksOrder = createAction('[Tasks] Update Tasks Order',props<{tasksIds:number[]}>());
const updateTasksOrderSuccess = createAction('[Tasks] Update Tasks Order Success',props<{taskOrder:number[]}>());

const addTask = createAction('[Task] Add Task',props<Task>());
const addTaskSuccess = createAction('[Task] Add Task Success',props<Task>());
const addTaskFailure = createAction('[Task] Add Task Failure',props<{error:any}>());

const changeProgressStatus = createAction('[Task] Change Progress Status',props<{selectedTaskId:number,newStatus:ProgressStatus}>());
const changeProgressStatusSuccess = createAction('[Task] Change Progress Status Success',props<Task>());

const deleteSelectedTask = createAction('[Tasks] Delete selected task',props<{id:number}>());
const deleteSelectedTaskSuccess = createAction('[Tasks] Delete selected task Success',props<{id:number}>());
const deleteSelectedTaskFailure = createAction('[Tasks] Delete selected task Failure',props<{error:any}>());


const editTask = createAction('[Task] Edit Task',props<Task>());

export const taskActions = {
  getTasks,
  getTasksSuccess,
  getTasksFailure,
  updateTasksOrder,
  updateTasksOrderSuccess,
  addTask,
  addTaskSuccess,
  addTaskFailure,
  editTask,
  changeProgressStatus,
  changeProgressStatusSuccess,
  deleteSelectedTask,
  deleteSelectedTaskSuccess,
  deleteSelectedTaskFailure
};

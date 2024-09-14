import { createAction, props } from "@ngrx/store";
import { Task } from "../task.model";
import { DB } from "../task.service";

const getTasks = createAction('[Tasks] Get Tasks');
const getTasksSuccess = createAction('[Tasks] Get Tasks Success',props<{data:DB}>());
const getTasksFailure = createAction('[Tasks] Get Tasks Failure',props<{error:any}>());
const updateTasksOrder = createAction('[Tasks] Update Tasks Order',props<{tasksIds:number[]}>());
const updateTasksOrderSuccess = createAction('[Tasks] Update Tasks Order Success',props<{taskOrder:number[]}>());
const addTask = createAction('[Task] Add Task',props<Task>());
const addTaskSuccess = createAction('[Task] Add Task Success',props<Task>())
const addTaskFailure = createAction('[Task] Add Task Failure',props<{error:any}>())

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
  editTask
};

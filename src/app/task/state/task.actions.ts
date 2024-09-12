import { createAction, props } from "@ngrx/store";
import { Task } from "../task.model";

const getTasks = createAction('[Tasks] Get Tasks');
const getTasksSuccess = createAction('[Tasks] Get Tasks Success',props<{tasks:Task[]}>());
const getTasksFailure = createAction('[Tasks] Get Tasks Failure',props<{error:any}>());
const updateTasksOrder = createAction('[Tasks] Update Tasks Order',props<{tasksIds:number[]}>());
const addTask = createAction('[Task] Add Task',props<Task>());
const addTaskSuccess = createAction('[Task] Add Task Success',props<Task>())
const addTaskFailure = createAction('[Task] Add Task Failure',props<{error:any}>())

const editTask = createAction('[Task] Edit Task',props<Task>());

export const taskActions = {
  getTasks,
  getTasksSuccess,
  getTasksFailure,
  updateTasksOrder,
  addTask,
  addTaskSuccess,
  addTaskFailure,
  editTask
};

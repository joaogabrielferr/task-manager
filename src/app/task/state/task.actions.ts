import { createAction, props } from "@ngrx/store";
import { Task } from "../task.model";

const getTasks = createAction('[Tasks] Get Tasks');
const getTasksSuccess = createAction('[Tasks] Get Tasks Success',props<{tasks:Task[]}>());
const getTasksFailure = createAction('[Tasks] Get Tasks Failure',props<{error:any}>());
const updateTasksOrder = createAction('[Tasks] Update Tasks Order',props<{tasks:Task[]}>());

export const taskActions = {
  getTasks,
  getTasksSuccess,
  getTasksFailure,
  updateTasksOrder
};

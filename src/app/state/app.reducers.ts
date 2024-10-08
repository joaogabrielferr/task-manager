import { ActionReducerMap } from "@ngrx/store";
import { IAppState } from "./app.state";
import { taskReducer } from "../modules/task/state/task.reducer";

export const appReducers: ActionReducerMap<IAppState> = {
  tasks:taskReducer
};

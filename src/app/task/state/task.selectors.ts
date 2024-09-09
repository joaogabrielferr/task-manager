import { IAppState } from "../../state/app.state";

export const getTasksSelector = (appState: IAppState) =>{
  return appState.tasks.tasks;
};

export const getTasksStatus = (appState:IAppState)=>{
  return appState.tasks.status;
}

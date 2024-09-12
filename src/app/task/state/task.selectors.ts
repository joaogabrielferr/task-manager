import { IAppState } from "../../state/app.state";

export const getTasksAndOrderSelector = (appState: IAppState) =>{
  return {
    entities:appState.tasks.tasks,
    tasksOrder:appState.tasks.tasksOrder
  };
};

export const getTasksStatus = (appState:IAppState)=>{
  return appState.tasks.status;
}

export const getSelectedTask = (appState:IAppState)=>{
  const id = appState.tasks.selectedTaskId;
  return id ? appState.tasks.tasks[id] : null;
}

export const getSelectedTaskStatus = (appState:IAppState)=>{
  return appState.tasks.selectedTaskStatus;
}

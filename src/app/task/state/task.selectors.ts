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
  if(!id)return null;
  const task = appState.tasks.tasks[id];
  const status = appState.tasks.selectedTaskChangeProgressStatus;
  return {task,changeProgressStatus:status};

}

export const getSelectedTaskStatus = (appState:IAppState)=>{
  return appState.tasks.selectedTaskStatus;
}

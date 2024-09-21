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
  // const id = appState.tasks.selectedTaskId;
  const selectedTask = appState.tasks?.selectedTask;
  return selectedTask;
  // const task = appState.tasks.tasks[id];
  // const changeProgressStatus = appState.tasks.selectedTaskChangeProgressStatus;
  // const deleteTaskStatus = appState.tasks.selectedTaskDeleteStatus;
  // return {task,changeProgressStatus,deleteTaskStatus};

}

// export const getSelectedTaskStatus = (appState:IAppState)=>{
//   return appState.tasks.selectedTaskStatus;
// }

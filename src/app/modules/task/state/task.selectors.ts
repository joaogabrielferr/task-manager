import { createSelector } from "@ngrx/store";
import { IAppState } from "../../../state/app.state";

export const selectTasksState = (state: IAppState) => state.tasks;

export const getTasksAndOrderSelector = createSelector(
  selectTasksState,
  (tasksState) => ({
    entities: tasksState.tasks,
    tasksOrder: tasksState.tasksOrder
  })
);

export const selectTasksStatus = (appState:IAppState)=>{
  return appState.tasks.status;
}

export const getTasksStatus = createSelector(selectTasksState,(state)=>state.status);

export const getSelectedTask = createSelector(selectTasksState,(state)=>state.selectedTask);


// export const getSelectedTask = (appState:IAppState)=>{
//   // const id = appState.tasks.selectedTaskId;
//   const selectedTask = appState.tasks?.selectedTask;
//   return selectedTask;
//   // const task = appState.tasks.tasks[id];
//   // const changeProgressStatus = appState.tasks.selectedTaskChangeProgressStatus;
//   // const deleteTaskStatus = appState.tasks.selectedTaskDeleteStatus;
//   // return {task,changeProgressStatus,deleteTaskStatus};

// }

// export const getSelectedTaskStatus = (appState:IAppState)=>{
//   return appState.tasks.selectedTaskStatus;
// }

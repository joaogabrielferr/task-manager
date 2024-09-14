import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TaskService } from "../task.service";
import { inject } from "@angular/core";
import { taskActions } from "./task.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";

export const getTasksEffect = createEffect(
  (actions$ = inject(Actions), taskService = inject(TaskService))=>{
    return actions$.pipe(
      ofType(taskActions.getTasks),
      switchMap(()=>{
        return taskService.getTasks().pipe(
          map(data => taskActions.getTasksSuccess({data})),
          catchError(err=> of(taskActions.getTasksFailure({error:err}))),
        )
      })
    )
  }
,{functional:true})

export const addTaskEffect = createEffect(
  (actions$ = inject(Actions),taskService = inject(TaskService)) =>{
    return actions$.pipe(
      ofType(taskActions.addTask),
      switchMap((task)=>{
        return taskService.addTask(task).pipe(
          map(task => taskActions.addTaskSuccess(task)),
          catchError(err => of(taskActions.addTaskFailure({error:err})))
        )
      })
    )

  },{functional:true}
);

export const updateTaskOrderEffect = createEffect(
  (actions$ = inject(Actions),taskService = inject(TaskService))=>{
    return actions$.pipe(
      ofType(taskActions.updateTasksOrder),
      switchMap((taskOrder)=>{
        return taskService.updateTaskOrder(taskOrder.tasksIds).pipe(
          map(order=> taskActions.updateTasksOrderSuccess({taskOrder:order}))
        )
      })
    );
  },{functional:true}
);

export const changeTaskProgressStatusEffect = createEffect(
  (actions$ = inject(Actions),taskService = inject(TaskService))=>{
    return actions$.pipe(
      ofType(taskActions.changeProgressStatus),
      switchMap((newTaskObj)=>{
        return taskService.changeTaskStatus(newTaskObj.selectedTaskId,newTaskObj.newStatus).pipe(
          map(task => taskActions.changeProgressStatusSuccess(task))
        )
      })
    );
  }
  ,{functional:true});

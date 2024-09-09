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
          map(tasks => taskActions.getTasksSuccess({tasks})),
          catchError(err=> of(taskActions.getTasksFailure({error:err}))),
        )
      })
    )
  }
,{functional:true})

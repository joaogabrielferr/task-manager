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
        console.log("calling get task on service");
        return taskService.getTasks().pipe(
          map(tasks => taskActions.getTasksSuccess({tasks})),
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

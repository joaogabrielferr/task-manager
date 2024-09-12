import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProgressStatus, Task } from '../../task/task.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskStatus } from '../../task/state/task.reducer';
import { taskActions } from '../../task/state/task.actions';
import { getSelectedTask, getSelectedTaskStatus } from '../../task/state/task.selectors';
import { map, Observable, Subscription, tap } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,
    MatFormFieldModule,MatInputModule,MatSelectModule,MatSliderModule,MatIconModule,
    MatButtonModule,MatProgressSpinnerModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnChanges{

  store = inject(Store);
  formBulder = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);

  @Input()
  task!: Task;

  taskStatus!:TaskStatus;
  taskStatusSubscription = this.store.select(getSelectedTaskStatus).subscribe((status)=>{
    this.taskStatus = status;
    if(this.taskStatus === TaskStatus.success){
      this.openSnackBar("Task added!","close");
    }
  });

  TaskStatusEnum = TaskStatus;

  form: FormGroup = this.formBulder.group({
    title:['',Validators.required],
    description:[''],
    priority:[1]
  });

  ngOnChanges(changes: SimpleChanges): void {
      if(this.task?.id){
        this.updateForm();
      }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  updateForm(){
    Object.keys(this.form.controls).forEach((control)=>{
      if(this.task[control as keyof Task]){
        this.form.get(control)?.setValue(this.task[control as keyof Task]);
      }
    })
  }


  isControlInvalid(control:string){
    return this.form?.get(control)?.invalid;
  }

  addTask(){
    if(this.form.invalid)return;
    const raw = this.form.getRawValue();
    if(!this.task)this.task = {} as Task;
    this.task.title = raw['title'];
    this.task.description = raw['description'];
    this.task.priority = raw['priority'];
    this.task.status = ProgressStatus.TO_DO;

    this.task.id ? this.store.dispatch(taskActions.editTask(this.task)) : this.store.dispatch(taskActions.addTask(this.task));

  }

}

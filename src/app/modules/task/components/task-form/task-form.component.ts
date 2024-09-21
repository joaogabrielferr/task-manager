import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ProgressStatus, Task } from '../../task.model';
import { TaskStatus } from '../../state/task.reducer';
import { getSelectedTask } from '../../state/task.selectors';
import { taskActions } from '../../state/task.actions';


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

  addTaskCalled:boolean = false;

  taskStatusSubscription = this.store.select(getSelectedTask).subscribe((selectedTask)=>{
    this.taskStatus = selectedTask?.status;
    if(this.taskStatus === TaskStatus.success && this.addTaskCalled){
      this.openSnackBar("Task added!","close");
      this.addTaskCalled = false;
    }
  });

  TaskStatusEnum = TaskStatus;

  form: FormGroup = this.formBulder.group({
    title:['',Validators.required],
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
    this.task.status = ProgressStatus.TO_DO;
    this.addTaskCalled = true;
    this.task.id ? this.store.dispatch(taskActions.editTask(this.task)) : this.store.dispatch(taskActions.addTask(this.task));

  }

}

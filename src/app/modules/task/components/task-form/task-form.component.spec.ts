import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { taskActions } from '../../state/task.actions';
import { Task } from '../../task.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getSelectedTask } from '../../state/task.selectors';
import { SelectedTask, TaskStatus } from '../../state/task.reducer';
import { MatSnackBar } from '@angular/material/snack-bar';


describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  let mockStore: MockStore;

  let mockGetSelectedTaskSelector: any;



  beforeEach(async () => {


    await TestBed.configureTestingModule({
      imports: [TaskFormComponent,ReactiveFormsModule,NoopAnimationsModule],
      providers:[provideMockStore()]
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;

    mockGetSelectedTaskSelector = mockStore.overrideSelector(getSelectedTask, {
      id:1,
      status:TaskStatus.pending
    } as SelectedTask);

    fixture.detectChanges();

    spyOn(mockStore, 'dispatch').and.callFake(() => {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch action after calling addTask',()=>{

    component.form.get('title')?.setValue('test task');

    const createTaskButton = fixture.debugElement.query(By.css('[data-testid="add-new-task-form"]'));

    createTaskButton.triggerEventHandler('click',null);

    fixture.detectChanges();

    expect(mockStore.dispatch).toHaveBeenCalledWith(taskActions.addTask({ title:'test task',status:0 } as Task));

  });

  it('should open snack bar after status of selected task is set to success',waitForAsync(()=>{

    spyOn(component, 'openSnackBar').and.callThrough();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      component.addTaskCalled = true;

      mockGetSelectedTaskSelector.setResult({
        id:1,
        status:TaskStatus.success
      } as SelectedTask);

      mockStore.refreshState();
      fixture.detectChanges();

      console.log(component.taskStatus);
      expect(component.openSnackBar).toHaveBeenCalledWith("Task added!","close");

    });

  }));

});

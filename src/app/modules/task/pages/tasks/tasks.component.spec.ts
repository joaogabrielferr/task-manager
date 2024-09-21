import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { TasksComponent } from './tasks.component';
import { MemoizedSelector, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMenuModule } from '@angular/material/menu';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SelectedTask, TaskState, TaskStatus } from '../../state/task.reducer';
import { taskActions } from '../../state/task.actions';
import { getSelectedTask, getTasksAndOrderSelector, getTasksStatus } from '../../state/task.selectors';
import { of, Subject } from 'rxjs';
import { Task } from '../../task.model';
import { By } from '@angular/platform-browser';
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  let mockStore: MockStore<TaskState>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  let mockGetTasksSelector: any;



  beforeEach(async () => {

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [TasksComponent,NoopAnimationsModule],
      providers:[
        provideMockStore(),
        { provide: MatDialog, useValue: dialogSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;

    mockGetTasksSelector = mockStore.overrideSelector(getTasksAndOrderSelector, {
      entities: {
        1: { id: 1, title: 'task' } as Task
      },
      tasksOrder: [1]
    });

    mockStore.overrideSelector(getTasksStatus,TaskStatus.success);

    mockStore.overrideSelector(getSelectedTask,{} as SelectedTask);


    fixture.detectChanges();
    spyOn(mockStore, 'dispatch').and.callFake(() => {});
  });


  afterEach(() => {
    TestBed.inject(MockStore)?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('render a list of tasks', waitForAsync(() => {

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.taskList.length).toBe(1);

      expect(
        fixture.debugElement.queryAll(By.css('.example-box')).length
      ).toBe(1);

      mockGetTasksSelector.setResult({
        entities: {
          1: { id: 1, title: 'task' } as Task,
          2: {id: 2,title:'other task'} as Task
        },
        tasksOrder: [1,2]
      });

      mockStore.refreshState();

      fixture.detectChanges();

      expect(component.taskList.length).toBe(2);

      expect(
        fixture.debugElement.queryAll(By.css('.example-box')).length
      ).toBe(2);


    });

  }));

  it('should remove task and update template',()=>{

    spyOn(component, 'openDialog').and.callThrough();

    const afterClosedSubject = new Subject<boolean>();

    // Set up the dialog to return a controllable Subject after closing
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: afterClosedSubject.asObservable() });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));

    deleteButton.triggerEventHandler('click', null);

    fixture.detectChanges();

    //in before each i mock the selector returning a single task with id 1
    expect(component.openDialog).toHaveBeenCalledWith(1);

    // Simulate confirming the dialog (true result)
    afterClosedSubject.next(true);
    afterClosedSubject.complete();

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmationModalComponent, {
      data: { title: 'Delete task', text: 'Do you really want to delete this task?' }
    });

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      taskActions.deleteSelectedTask({ id: 1 })
    );

  });

  it('should show task form when clicking on add new task',()=>{

    spyOn(component, 'toggleFormView').and.callThrough();

    let taskForm = fixture.debugElement.query(By.css('app-task-form'));
    expect(taskForm).toBeNull();

    const createTaskButton = fixture.debugElement.query(By.css('[data-testid="create-task"]'));

    createTaskButton.triggerEventHandler('click',null);

    fixture.detectChanges();

    expect(component.toggleFormView).toHaveBeenCalled();

    taskForm = fixture.debugElement.query(By.css('app-task-form'));
    expect(taskForm).toBeTruthy();


  });

});

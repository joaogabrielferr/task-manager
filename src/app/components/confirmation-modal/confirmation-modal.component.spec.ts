import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  let dialogSpy: jasmine.SpyObj<MatDialogRef<ConfirmationModalComponent>>;

  beforeEach(async () => {

    dialogSpy = jasmine.createSpyObj('MatDialog', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent],
      providers:[{ provide: MatDialogRef, useValue: dialogSpy},{provide: MAT_DIALOG_DATA,useValue:{}}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

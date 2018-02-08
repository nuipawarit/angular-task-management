import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPenddingTaskComponent } from './approval-pendding-task.component';

describe('ApprovalPenddingTaskComponent', () => {
  let component: ApprovalPenddingTaskComponent;
  let fixture: ComponentFixture<ApprovalPenddingTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalPenddingTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalPenddingTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

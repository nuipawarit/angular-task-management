import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskByOwnerComponent } from './task-by-owner.component';

describe('TaskByOwnerComponent', () => {
  let component: TaskByOwnerComponent;
  let fixture: ComponentFixture<TaskByOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskByOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskByOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

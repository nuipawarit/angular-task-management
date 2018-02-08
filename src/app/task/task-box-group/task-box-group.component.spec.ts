import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskBoxGroupComponent } from './task-box-group.component';

describe('TaskBoxGroupComponent', () => {
  let component: TaskBoxGroupComponent;
  let fixture: ComponentFixture<TaskBoxGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskBoxGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskBoxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

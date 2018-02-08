import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskColumnsComponent } from './task-columns.component';

describe('TaskColumnsComponent', () => {
  let component: TaskColumnsComponent;
  let fixture: ComponentFixture<TaskColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyTaskBoxComponent } from './empty-task-box.component';

describe('EmptyTaskBoxComponent', () => {
  let component: EmptyTaskBoxComponent;
  let fixture: ComponentFixture<EmptyTaskBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyTaskBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyTaskBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

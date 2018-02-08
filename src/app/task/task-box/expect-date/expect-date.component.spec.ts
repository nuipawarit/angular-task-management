import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectDateComponent } from './expect-date.component';

describe('ExpectDateComponent', () => {
  let component: ExpectDateComponent;
  let fixture: ComponentFixture<ExpectDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

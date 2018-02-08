import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestZoneComponent } from './test-zone.component';

describe('TestZoneComponent', () => {
  let component: TestZoneComponent;
  let fixture: ComponentFixture<TestZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

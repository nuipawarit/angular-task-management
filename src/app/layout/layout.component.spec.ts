import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppModule} from '../app.module';
import {LayoutComponent} from './layout.component';
import {UserDataService} from '../service/user-data/user-data.service';
import {mockUserData} from '../mock/mock-user-data';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;

    // UserDataService actually injected into the component
    let userDataService = fixture.debugElement.injector.get(UserDataService);

    // Setup spy on the `getQuote` method
    let spy = spyOn(userDataService, 'getUserData')
       .and.returnValue(Promise.resolve(mockUserData));

    // Get the Twain quote element by CSS selector (e.g., by class name)
    // de = fixture.debugElement.query(By.css('.twain'));
    // el = de.nativeElement;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

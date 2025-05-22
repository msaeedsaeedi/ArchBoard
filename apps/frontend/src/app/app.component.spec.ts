import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ButtonModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render toggle dark mode button', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p-button')?.getAttribute('label')).toEqual('Toggle Dark Mode');
  });
  
  it('should toggle dark mode class when toggleDarkMode is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const htmlElement = document.createElement('html');
    document.querySelector = jasmine.createSpy('querySelector').and.returnValue(htmlElement);
    
    app.toggleDarkMode();
    expect(htmlElement.classList.contains('p-dark')).toBeTrue();
    
    app.toggleDarkMode();
    expect(htmlElement.classList.contains('p-dark')).toBeFalse();
  });
});

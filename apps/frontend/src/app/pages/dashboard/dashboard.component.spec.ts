import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toggle dark mode button', () => {
    const buttonEl = fixture.nativeElement.querySelector('button');
    expect(buttonEl?.textContent?.trim()).toBe('Toggle Dark Mode');
  });

  it('should toggle dark mode class on <html> when toggleDarkMode is called', () => {
    const htmlElement = document.documentElement;

    htmlElement.classList.remove('p-dark');
    component.toggleDarkMode();
    expect(htmlElement.classList.contains('p-dark')).toBeTrue();

    component.toggleDarkMode();
    expect(htmlElement.classList.contains('p-dark')).toBeFalse();
  });
});

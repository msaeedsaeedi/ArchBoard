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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toggle dark mode button', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p-button')?.getAttribute('label')).toEqual('Toggle Dark Mode');
  });

  it('should toggle dark mode class when toggleDarkMode is called', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.componentInstance;
    const htmlElement = document.createElement('html');
    document.querySelector = jasmine.createSpy('querySelector').and.returnValue(htmlElement);

    app.toggleDarkMode();
    expect(htmlElement.classList.contains('p-dark')).toBeTrue();

    app.toggleDarkMode();
    expect(htmlElement.classList.contains('p-dark')).toBeFalse();
  });
});

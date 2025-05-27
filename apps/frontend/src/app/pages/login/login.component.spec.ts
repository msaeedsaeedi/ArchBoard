import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a label and input for username', () => {
    const label = compiled.querySelector('label[for="username"]');
    const input = compiled.querySelector('#username');
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('should have a label and input for password', () => {
    const label = compiled.querySelector('label[for="password"]');
    const input = compiled.querySelector('#password');
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('should have a login button with correct type and text', () => {
    const button = compiled.querySelector('button[type="submit"]');
    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe('Login');
  });

  it('should have an invalid form when username and password are empty', () => {
    component.loginForm.setValue({ username: '', password: '' });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should have a valid form when both fields are filled', () => {
    component.loginForm.setValue({ username: 'admin', password: '123' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should disable the login button when the form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    fixture.detectChanges();
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('should enable the login button when the form is valid', () => {
    component.loginForm.setValue({ username: 'admin', password: '123' });
    fixture.detectChanges();
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBeFalse();
  });

  it('should call onLogin when form is submitted and valid', () => {
    spyOn(component, 'onLogin');
    component.loginForm.setValue({ username: 'admin', password: '123' });
    fixture.detectChanges();

    const form = compiled.querySelector('form')!;
    form.dispatchEvent(new Event('submit'));

    expect(component.onLogin).toHaveBeenCalled();
  });
});

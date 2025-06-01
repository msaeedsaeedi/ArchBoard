import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AuthService);
  toast = inject(ToastService);

  loading = signal<boolean>(false);
  signInWithGoogleLink: string = `${environment.apiUrl}/auth/google`;

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  async onLogin() {
    this.loading.set(true);

    this.authService
      .login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Login', 'Successfully Logged In');
          this.router.navigate(['dashboard']);
        },
        error: (err: Error) => {
          this.toast.error('Login', err.message);
        },
      });
  }
}

import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AuthService);
  toast = inject(ToastService);

  loading = signal<boolean>(false);

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  async onLogin() {
    this.loading.set(true);

    try {
      await this.authService.login(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value,
      );

      this.toast.success('Login', 'Successfully Logged In');
      this.router.navigate(['dashboard']);
    } catch (error) {
      this.toast.error('Login', error as string);
    } finally {
      this.loading.set(false);
    }
  }
}

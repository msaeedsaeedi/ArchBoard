import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';
import { matchValidator } from '../../utils/match.validator';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, InputTextModule, FloatLabelModule, ButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  router = inject(Router);
  authService = inject(AuthService);
  toast = inject(ToastService);

  loading = signal<boolean>(false);
  continueWithGoogleLink: string = `${environment.apiUrl}/auth/google`;

  signupForm = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, matchValidator('confirmPassword', true)],
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required, matchValidator('password')],
    }),
  });

  async onSignup() {
    this.loading.set(true);
  }
}

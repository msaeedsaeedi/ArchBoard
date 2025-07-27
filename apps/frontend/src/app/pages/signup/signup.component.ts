import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { environment } from '@environment';
import { matchValidator } from '@utils/match.validator';
import { finalize } from 'rxjs';
import { passwordValidator } from '@utils/password.validator';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    PasswordModule,
    DividerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  router = inject(Router);
  authService = inject(AuthService);
  toast = inject(ToastService);

  loading = signal<boolean>(false);
  continueWithGoogleLink = `${environment.apiUrl}/auth/google`;

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
      validators: [
        Validators.required,
        matchValidator('confirmPassword', true),
        passwordValidator(),
      ],
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required, matchValidator('password')],
    }),
  });

  async onSignup() {
    this.loading.set(true);
    this.authService
      .signup(
        this.signupForm.controls.fullName.value,
        this.signupForm.controls.email.value,
        this.signupForm.controls.password.value,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('Signup', 'Successfully Signed up');
          this.router.navigate(['dashboard']);
        },
        error: (err: Error) => {
          this.toast.error('Signup', err.message);
        },
      });
  }
}

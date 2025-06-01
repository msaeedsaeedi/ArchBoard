import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  router = inject(Router);
  toast = inject(ToastService);

  constructor() {}

  public isLoggedIn(): Observable<boolean> {
    return this.http
      .get(`${environment.apiUrl}/auth`, {
        withCredentials: true,
      })
      .pipe(
        catchError(() => of(false)),
        map(() => true),
      );
  }

  public login(email: string, password: string): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == 401) {
            return throwError(() => new Error('Invalid email or password.'));
          } else {
            console.error(error);
            return throwError(() => new Error('Login failed. Please try again later.'));
          }
        }),
      );
  }

  public signup(fullName: string, email: string, password: string): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}/auth/signup`,
        {
          fullName,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == HttpStatusCode.Conflict)
            return throwError(() => new Error('Account Already Exists!'));
          if (error.status == HttpStatusCode.BadRequest)
            return throwError(() => new Error('Internal Error Occured'));
          return throwError(() => new Error('Signup failed. Please try again later.'));
        }),
      );
  }

  public logout(): void {
    this.http
      .post<void>(`${environment.apiUrl}/auth/logout`, null, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['login']);
        },
        error: () => {
          this.toast.error('Error', 'Something went wrong');
        },
      });
  }
}

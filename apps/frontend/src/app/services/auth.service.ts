import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError, timer } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  constructor() {}

  public isLoggedIn(): Observable<boolean> {
    return this.http
      .get<void>(`${environment.apiUrl}/auth`, {
        withCredentials: true,
      })
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  public login(username: string, password: string): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}/auth/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == 401) {
            return throwError(() => new Error('Invalid username or password.'));
          } else {
            console.error(error);
            return throwError(() => new Error('Login failed. Please try again later.'));
          }
        }),
      );
  }

  public logout(): Promise<void> {
    return new Promise((resolve) => timer(2000).subscribe((_) => resolve()));
  }
}

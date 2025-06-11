import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { Board } from '../types/board';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private http = inject(HttpClient);

  get(): Observable<Board[]> {
    return this.http.get<Board[]>(`${environment.apiUrl}/board`, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Something went wrong. Please try again later'));
      }),
    );
  }

  update(id: number, title: string, description?: string): Observable<boolean> {
    return this.http
      .patch(`${environment.apiUrl}/board/${id}`, { title, description }, { withCredentials: true })
      .pipe(
        map(() => true),
        catchError(() =>
          throwError(() => new Error('Something went wrong. Please try again later.')),
        ),
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete(`${environment.apiUrl}/board/${id}`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() =>
        throwError(() => new Error('Unable to delete Board. Please try again later.')),
      ),
    );
  }

  create(title: string, description: string | null): Observable<string> {
    return this.http
      .post<{ slug: string }>(
        `${environment.apiUrl}/board`,
        {
          title,
          description,
        },
        { withCredentials: true },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == HttpStatusCode.Conflict)
            return throwError(() => Error('Board Already Exists'));
          if (error.status == HttpStatusCode.BadRequest)
            return throwError(() => new Error('Internal Error Occured'));
          return throwError(() => new Error('Board Creation Failed. Please try again later'));
        }),
        map((value) => value.slug),
      );
  }

  addCollaborator(boardId: number, collaboratorEmail: string, role: string): Observable<boolean> {
    return this.http
      .post(
        `${environment.apiUrl}/board/${boardId}/collaborators`,
        {
          email: collaboratorEmail,
          role,
        },
        { withCredentials: true },
      )
      .pipe(
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          if (error.status == HttpStatusCode.Conflict)
            return throwError(() => new Error('Collaborator Already Exists'));
          if (error.status == HttpStatusCode.NotFound)
            return throwError(() => new Error('Collaborator Not Found'));
          if (error.status == HttpStatusCode.Unauthorized)
            return throwError(() => new Error('Board Not found'));
          return throwError(() => new Error('Failed to add collaborator. Please try again later'));
        }),
      );
  }
}

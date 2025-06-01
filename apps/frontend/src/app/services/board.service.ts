import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  http = inject(HttpClient);

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
}

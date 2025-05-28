import { Injectable } from '@angular/core';
import { delay, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = false;

  constructor() {}

  public isLoggedIn(): boolean {
    return this.loggedIn === true;
  }

  public login(username: string, password: string): Promise<void> {
    this.loggedIn = true;
    if (username === 'admin' && password === '123')
      return new Promise((resolve) => timer(2000).subscribe((_) => resolve()));
    return new Promise((_, reject) =>
      timer(2000).subscribe((_) => reject('Invalid Username or Password')),
    );
  }

  public logout(): Promise<void> {
    this.loggedIn = false;
    return new Promise((resolve) => timer(2000).subscribe((_) => resolve()));
  }
}

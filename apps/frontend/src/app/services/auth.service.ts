import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: boolean = true;

  constructor() {}

  public isLoggedIn(): boolean {
    return this.loggedIn === true;
  }

  public login(username: string, password: string): void {
    this.loggedIn = true;
  }

  public logout(): void {
    this.loggedIn = false;
  }
}

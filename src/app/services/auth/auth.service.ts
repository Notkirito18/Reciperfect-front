import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Profile, User } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { GlobalsService } from '../globals.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | any>(null);
  expirationTimer: any;
  sessionEndingTimer: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  register(username: string, email: string, password: string) {
    return this.http
      .post(
        environment.url + 'auth/register',
        {
          username,
          email,
          password,
        },
        { headers: { key: environment.serverKey }, observe: 'response' }
      )
      .pipe(
        tap((result: any) => {
          this.handleAuth(
            result.body.email,
            result.body.userId,
            result.headers.get('authToken'),
            parseInt(result.headers.get('expires-in')),
            result.username
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post(
        environment.url + 'auth/login',
        { email, password },
        { headers: { key: environment.serverKey }, observe: 'response' }
      )
      .pipe(
        tap((result: any) => {
          console.log('result', result);

          this.handleAuth(
            result.body.email,
            result.body._id,
            result.headers.get('authToken'),
            result.headers.get('expires-in'),
            result.body.username,
            result.body.profile
          );
        })
      );
  }

  //* handle logging in / auto logout (local storage)
  private handleAuth(
    email: string | null,
    _id: string,
    token: string | undefined,
    expIn: number,
    username: string,
    profile?: Profile
  ) {
    if (email && token) {
      const expDate = new Date(new Date().getTime() + expIn * 1000);
      const user = new User(email, _id, token, expDate, username, profile);
      this.user.next(user);
      this.autoLogout(expIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
    }
  }

  autoLogin() {
    const userData: {
      email: string;
      _id: string;
      _token: string;
      _tokenExpirationDate: string;
      username: string;
      profile: Profile;
    } = JSON.parse(localStorage.getItem('userData') || '{}');

    if (userData) {
      const loadedUser = new User(
        userData.email,
        userData._id,
        userData._token,
        new Date(userData._tokenExpirationDate),
        userData.username,
        userData.profile
      );
      if (loadedUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.autoLogout(expirationDuration);
        this.user.next(loadedUser);
      }
    } else {
      return;
    }
  }

  autoLogout(expDuration: number) {
    this.sessionEndingTimer = setTimeout(() => {
      const snack = this.snackBar.open(
        'Your session is expiring in 1 minute',
        'Renew session',
        {
          duration: 8000,
          panelClass: 'error',
        }
      );
      snack.onAction().subscribe(() => {
        if (this.expirationTimer) {
          clearTimeout(this.expirationTimer);
        }
        this.expirationTimer = setTimeout(() => {
          this.logOut();
        }, expDuration);
      });
    }, expDuration - 60000);

    this.expirationTimer = setTimeout(() => {
      this.logOut();
    }, expDuration);
  }

  logOut() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    this.expirationTimer = null;
    this.router.navigate(['/login']);
  }
}

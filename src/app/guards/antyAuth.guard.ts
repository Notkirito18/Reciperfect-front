import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs/operators';
import { GlobalsService } from '../services/globals.service';

@Injectable({
  providedIn: 'root',
})
export class AntyAuthGuard implements CanActivate {
  constructor(
    private globals: GlobalsService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      map((user) => {
        const isAuth = !!user;
        if (!isAuth) {
          return true;
        } else {
          this.globals.notification.next({
            msg: 'You are already logged in',
            type: 'notError',
          });
          return this.router.createUrlTree(['/profile']);
        }
      })
    );
  }
}

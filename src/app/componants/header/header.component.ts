import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private mediaObserver: MediaObserver,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}
  mediaSubscription!: Subscription;
  screenSize = 'lg';
  scrolled = false;
  loggedIn!: boolean;
  user$!: Subscription;
  ngOnInit(): void {
    // screen Size
    this.mediaSubscription = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.screenSize = result.mqAlias;
      }
    );
    //logged in ?
    this.user$ = this.authService.user.subscribe((user) => {
      if (user) {
        this.loggedIn = true;
      }
    });
  }

  @HostListener('document:scroll')
  scrollFunction() {
    if (
      document.body.scrollTop > 250 ||
      document.documentElement.scrollTop > 250
    ) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    if (this.user$) this.user$.unsubscribe();
  }
}

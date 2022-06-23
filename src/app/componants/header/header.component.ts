import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private mediaObserver: MediaObserver,
    private authService: AuthService,
    private globals: GlobalsService
  ) {}
  mediaSubscription!: Subscription;
  screenSize = 'lg';
  scrolled = false;
  loggedIn!: boolean;
  user$!: Subscription;
  transparent$!: Subscription;
  transparent!: boolean;
  ngOnInit(): void {
    //style
    this.transparent$ = this.globals.headerTransparency.subscribe((bool) => {
      this.transparent = bool;
    });
    //screen size
    this.mediaSubscription = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.screenSize = result.mqAlias;
      }
    );
    //logged in ?
    this.user$ = this.authService.user.subscribe((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  }

  @HostListener('document:scroll')
  scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
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
    if (this.transparent$) this.transparent$.unsubscribe();
    if (this.mediaSubscription) this.mediaSubscription.unsubscribe();
  }
}

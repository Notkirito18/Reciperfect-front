import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private mediaObserver: MediaObserver,
    private authService: AuthService,
    private usersService: UsersService,

    private globals: GlobalsService
  ) {}
  mediaSubscription!: Subscription;
  screenSize = 'lg';
  scrolled = false;
  loggedIn!: boolean;
  user$!: Subscription;
  user!: User;
  transparent$!: Subscription;
  transparent!: boolean;
  profilePic!: string;
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
        this.user = user;
        this.loggedIn = true;
        this.usersService.getUser(user._id).subscribe(
          (userObject) => {
            this.profilePic = userObject.profile?.profilePic
              ? userObject.profile?.profilePic
              : 'https://res.cloudinary.com/notkirito18/image/upload/v1658421093/assets/avth2x05glsetigstvdk_q6f4bi.jpg';
          },
          (error) => {
            console.log(error);
          }
        );
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

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { searchClass } from 'src/app/helpers';
import { GlobalsService } from 'src/app/services/globals.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private mediaObserver: MediaObserver,
    private globals: GlobalsService
  ) {}

  mediaSubscription!: Subscription;
  screenSize = 'lg';
  scrolled = false;
  recipes: any[] = ['', '', '', '', '', ''];
  ngOnInit(): void {
    //header
    this.globals.headerTransparency.next(true);
    //screen size
    this.mediaSubscription = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.screenSize = result.mqAlias;
      }
    );
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
  ngOnDestroy(): void {
    if (this.mediaSubscription) this.mediaSubscription.unsubscribe();
  }
  searchClass = searchClass;
}

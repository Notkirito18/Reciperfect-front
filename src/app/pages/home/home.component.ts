import { Component, HostListener, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { searchClass } from 'src/app/helpers';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private mediaObserver: MediaObserver) {}
  mediaSubscription!: Subscription;
  screenSize = 'lg';
  scrolled = false;
  ngOnInit(): void {
    // screen Size
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

  searchClass = searchClass;
}

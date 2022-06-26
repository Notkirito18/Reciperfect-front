import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { searchClass } from 'src/app/helpers';
import { Recipe } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { RecipesService } from 'src/app/services/recipes/recipes.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private mediaObserver: MediaObserver,
    private globals: GlobalsService,
    private recipesService: RecipesService,
    private authService: AuthService
  ) {}

  mediaSubscription!: Subscription;
  screenSize = 'lg';
  scrolled = false;
  loading = false;
  recipes!: Recipe[];
  ngOnInit(): void {
    //header
    this.globals.headerTransparency.next(true);
    //screen size
    this.mediaSubscription = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.screenSize = result.mqAlias;
      }
    );
    //getting recipes
    this.loading = true;
    this.authService.user.subscribe((user) => {
      this.recipesService.getRecipes(user?._id).subscribe(
        (result: any) => {
          this.loading = false;
          this.recipes = result;
        },
        (error) => {
          console.log(error);
          this.globals.notification.next({ msg: error.msg, type: 'error' });
        }
      );
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
  ngOnDestroy(): void {
    if (this.mediaSubscription) this.mediaSubscription.unsubscribe();
  }
  searchClass = searchClass;
}

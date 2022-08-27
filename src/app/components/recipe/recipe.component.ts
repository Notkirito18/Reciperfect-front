import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { median } from 'src/app/helpers';
import { Recipe, User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { RecipesService } from 'src/app/services/recipes/recipes.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { RateDialogComponent } from '../rate-dialog/rate-dialog.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit, OnDestroy {
  user$!: Subscription;
  user!: User;
  rating = 0;
  liked = false;
  rated = false;
  myRecipe = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private globals: GlobalsService,
    private dialog: MatDialog,
    private recipesService: RecipesService
  ) {}

  @Input() recipe!: Recipe;
  loading = true;

  ngOnInit(): void {
    //* getting user
    this.user$ = this.authService.user.subscribe((user) => {
      this.user = user;
      this.myRecipe = this.recipe.creatorId == user?._id;
      //* setting rating
      if (this.recipe.ratings) {
        const ratingScores = this.recipe.ratings.map(
          (item) => item.ratingScore
        );
        this.rating = median(ratingScores);
      }
      //* setting rated
      if (this.recipe.ratings && this.user)
        this.rated = this.recipe.ratings
          ?.map((item: any) => item.ratorId)
          .includes(this.user._id);
      //* setting liked
      if (this.recipe.likes && this.user) {
        if (this.recipe.likes.includes(this.user._id)) {
          this.liked = true;
        }
      }
      this.loading = false;
    });
  }
  //* going to recipe page
  onCardClick() {
    this.router.navigate(['recipe', this.recipe._id]);
  }
  //* liking recipe
  onLike() {
    if (this.user) {
      const idArr = [this.user._id];
      const newLikes = this.liked
        ? this.recipe.likes?.filter((item) => {
            item != this.user._id;
          })
        : this.recipe.likes?.concat(idArr);
      const updatedRecipe = { ...this.recipe, likes: newLikes };
      this.recipesService
        .updateRecipe(
          this.recipe._id ? this.recipe._id : '',
          updatedRecipe,
          this.user.token ? this.user.token : '',
          this.user._id,
          null
        )
        .subscribe(
          (updatedRecipe) => {
            this.liked = !this.liked;
            this.recipe = updatedRecipe;
          },
          (error) => {
            this.globals.notification.next({
              msg: 'error registering like',
              type: 'error',
            });
            console.log(error);
          }
        );
    } else {
      this.dialog.open(LoginDialogComponent, {
        width: '400px',
        data: { msg: 'Login now to save your favourite recipes' },
      });
    }
  }
  //* rating recipe
  onRate() {
    if (!this.user) {
      this.dialog.open(LoginDialogComponent, {
        width: '400px',
        data: { msg: 'Login now and rate recipes' },
      });
    } else {
      const dialogRef = this.dialog.open(RateDialogComponent, {
        width: '600px',
        data: {
          rated: this.rated,
          rating: this.recipe.ratings?.filter(
            (item: any) => item.ratorId == this.user._id
          )[0]?.ratingScore,
        },
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          let newRatings;
          let newRecipe;
          if (this.rated) {
            //* changing previous rating
            newRatings = this.recipe.ratings?.map((item) => {
              if (item.ratorId == this.user._id) {
                return { ...item, ratingScore: data.rating };
              } else {
                return item;
              }
            });
            newRecipe = { ...this.recipe, ratings: newRatings };
          } else {
            //* giving new rating
            newRatings = [{ ratorId: this.user._id, ratingScore: data.rating }];
            newRecipe = {
              ...this.recipe,
              ratings: this.recipe.ratings?.concat(newRatings),
            };
          }
          //*updating db
          this.recipesService
            .updateRecipe(
              this.recipe._id ? this.recipe._id : '',
              newRecipe,
              this.user.token ? this.user.token : '',
              this.user._id,
              null
            )
            .subscribe(
              (updatedRecipe) => {
                const ratingScores = updatedRecipe.ratings.map(
                  (item: any) => item.ratingScore
                );
                this.rating = median(ratingScores);
                this.recipe = updatedRecipe;
                this.rated = true;
              },
              (error) => {
                this.globals.notification.next({
                  msg: 'error registering rating',
                  type: 'error',
                });
              }
            );
        }
      });
    }
  }

  median = median;

  ngOnDestroy(): void {
    if (this.user$) this.user$.unsubscribe();
  }
}

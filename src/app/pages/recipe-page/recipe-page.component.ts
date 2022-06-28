import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LoginDialogComponent } from 'src/app/componants/login-dialog/login-dialog.component';
import { RateDialogComponent } from 'src/app/componants/rate-dialog/rate-dialog.component';
import { median } from 'src/app/helpers';
import { Recipe, User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { RecipesService } from 'src/app/services/recipes/recipes.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})
export class RecipePageComponent implements OnInit, OnDestroy {
  constructor(
    private recipesService: RecipesService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private globals: GlobalsService,
    private dialog: MatDialog
  ) {}
  user$!: Subscription;
  user!: User;
  id!: string;
  recipe!: Recipe | any;
  imagesPaths!: { path: string }[];
  creatorUsername!: string;
  rating!: number;
  liked = false;
  rated = false;
  ngOnInit(): void {
    //*header
    this.globals.headerTransparency.next(false);
    //*getting recipe
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      //*getting user
      this.user$ = this.authService.user.subscribe((user) => {
        this.user = user;
        this.recipesService.getRecipe(this.id, user?._id).subscribe(
          (recipe) => {
            this.recipe = recipe;
            this.imagesPaths = recipe.imagesSrcs.map((item: string) => {
              return { path: item };
            });
            //* setting rating
            const ratingScores = this.recipe.ratings.map(
              (item: any) => item.ratingScore
            );
            this.rating = median(ratingScores);
            //* setting rated
            if (recipe.ratings && user)
              this.rated = this.recipe.ratings
                ?.map((item: any) => item.ratorId)
                .includes(this.user._id);
            //* setting liked
            if (recipe.likes && user) {
              this.liked = recipe.likes.includes(this.user._id);
            }
            //*getting username
            this.authService.getUserName(recipe.creatorId).subscribe(
              ({ user }) => {
                this.creatorUsername = user.username;
              },
              //* error handling
              (error) => {
                console.log(error);
                this.globals.notification.next({
                  msg: 'Failed to get recipe data',
                  type: 'error',
                });
              }
            );
          },
          //* error handling
          (error) => {
            console.log(error);
            this.globals.notification.next({
              msg: 'Failed to get recipe data',
              type: 'error',
            });
          }
        );
      });
    });
  }

  //* saving recipe
  onLike() {
    if (this.user) {
      const idArr = [this.user._id];
      const newLikes = this.liked
        ? this.recipe.likes?.filter((item: any) => {
            item != this.user._id;
          })
        : this.recipe.likes?.concat(idArr);
      const updatedRecipe = { ...this.recipe, likes: newLikes };
      this.recipesService
        .updateRecipe(
          this.recipe._id ? this.recipe._id : '',
          updatedRecipe,
          this.user.token ? this.user.token : '',
          this.user._id
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
        data: { score: 5 },
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          let newRatings;
          let newRecipe;
          if (this.rated) {
            //* changing previous rating
            newRatings = this.recipe.ratings?.map((item: any) => {
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
              this.user._id
            )
            .subscribe(
              (updatedRecipe) => {
                const ratingScores = updatedRecipe.ratings.map(
                  (item: any) => item.ratingScore
                );
                this.rating = median(ratingScores);
                this.recipe = updatedRecipe;
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { RateDialogComponent } from 'src/app/components/rate-dialog/rate-dialog.component';
import { UserDialogComponent } from 'src/app/components/user-dialog/user-dialog.component';
import { findCommonElement, median } from 'src/app/helpers';
import { Recipe, User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { RecipesService } from 'src/app/services/recipes/recipes.service';
import { UsersService } from 'src/app/services/users/users.service';

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
    private usersService: UsersService,
    private globals: GlobalsService,
    private dialog: MatDialog
  ) {}
  user$!: Subscription;
  user!: User;
  id!: string;
  recipe!: Recipe | any;
  imagesPaths!: { path: string }[];
  creatorUser!: User | undefined;
  rating!: number;
  liked = false;
  rated = false;
  myRecipe = false;
  creatorRecipes!: Recipe[];
  relatedRecipes!: Recipe[];

  median = median;
  findCommonElement = findCommonElement;

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
            this.myRecipe = recipe.creatorId == user?._id;
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
            //*getting user object
            this.usersService.getUser(recipe.creatorId).subscribe(
              (user) => {
                this.creatorUser = user;
                //*getting all recipes
                this.recipesService
                  .getRecipes(user?._id)
                  .subscribe((recipes) => {
                    //setting creato recipes
                    this.creatorRecipes = recipes.filter((rec) => {
                      return (
                        rec.creatorId == this.creatorUser?._id &&
                        rec._id != this.recipe._id
                      );
                    });
                    //setting related recipes
                    this.relatedRecipes = recipes.filter((rec) => {
                      return (
                        this.findCommonElement(rec.tags, this.recipe.tags) &&
                        rec._id != this.recipe._id
                      );
                    });
                  });
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
  creatorClick() {
    if (this.creatorUser) {
      this.usersService.getUser(this.creatorUser?._id).subscribe((user) => {
        this.dialog.open(UserDialogComponent, {
          width: '400px',
          data: { user },
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.user$) this.user$.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { RecipesService } from 'src/app/services/recipes/recipes.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})
export class RecipePageComponent implements OnInit {
  constructor(
    private recipesService: RecipesService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private globals: GlobalsService
  ) {}
  id!: string;
  recipe!: Recipe | any;
  creatorUsername!: string;
  ngOnInit(): void {
    //header
    this.globals.headerTransparency.next(false);
    //getting recipe + creator username
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.authService.user.subscribe((user) => {
        this.recipesService.getRecipe(this.id, user?._id).subscribe(
          (recipe) => {
            this.recipe = recipe;
            //getting username
            this.authService
              .getUserName(recipe.creatorId)
              .subscribe(({ user }) => {
                this.creatorUsername = user.username;
              });
          },
          (error) => {
            console.log(error);
          }
        );
      });
    });
  }
}

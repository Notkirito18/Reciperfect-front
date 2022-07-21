import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ageFromBd } from 'src/app/helpers';
import { Recipe, User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { RecipesService } from 'src/app/services/recipes/recipes.service';

@Component({
  selector: 'app-myspace',
  templateUrl: './myspace.component.html',
  styleUrls: ['./myspace.component.scss'],
})
export class MyspaceComponent implements OnInit {
  constructor(
    private globals: GlobalsService,
    private reciepsService: RecipesService,
    private authService: AuthService
  ) {}
  ageFromBd = ageFromBd;
  recipes!: Recipe[];
  likedRecipes: Recipe[] = [];
  myRecipes: Recipe[] = [];

  user$!: Subscription;
  user!: User;
  ngOnInit(): void {
    //*header
    this.globals.headerTransparency.next(false);
    //*getting user
    this.user$ = this.authService.user.subscribe((user) => {
      console.log(user);

      this.user = user;
      //*getting recipes
      this.reciepsService.getRecipes().subscribe((recipes) => {
        this.recipes = recipes;
        this.myRecipes = recipes.filter((item) => {
          return item.creatorId == user._id;
        });
        this.likedRecipes = recipes.filter((item) =>
          item.likes?.includes(user._id)
        );
      });
    });
  }
}

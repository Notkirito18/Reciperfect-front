import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ageFromBd } from 'src/app/helpers';
import { Recipe, User } from 'src/app/models';
import { RecipesService } from 'src/app/services/recipes/recipes.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    private recipesService: RecipesService,
    private route: ActivatedRoute
  ) {}

  userId!: string;
  user!: User;
  ageFromBd = ageFromBd;
  userRecipes: Recipe[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.usersService.getUser(this.userId).subscribe((user) => {
        this.user = user;
        this.recipesService.getRecipes(user._id).subscribe((recipes) => {
          this.userRecipes = recipes.filter((rec) => {
            return rec.creatorId == user._id;
          });
        });
      });
    });
  }
}

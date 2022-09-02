import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalsService } from './services/globals.service';
import { CustomIconsService } from './services/custom-icons.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ingredient, Recipe } from './models';
import { RecipesService } from './services/recipes/recipes.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private globals: GlobalsService,
    public customIconsLoader: CustomIconsService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private recipeService: RecipesService
  ) {}
  notifier$!: Subscription;

  ngOnInit() {
    //auto login
    this.authService.autoLogin();
    //error notifier
    this.notifier$ = this.globals.notification.subscribe(({ msg, type }) => {
      if (msg && msg.length > 1) {
        this.snackBar.open(msg, '', {
          duration: 4000,
          panelClass: type,
        });
      }
    });
  }
  splitIt(str: string) {
    let result: any = [];
    for (let i = 0; i < str.split('\r\n').length; i++) {
      result = result.concat(str.split('\r\n')[i].split('. '));
    }
    return result.filter((e: string) => e != '');
  }
  getData() {
    const interval = setInterval(() => {
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
      let addedRecipes: string[] = [];
      //* gettting data from spoonacular.com
      this.authService.user.subscribe((user) => {
        this.http
          .get('https://www.themealdb.com/api/json/v1/1/random.php')
          .subscribe((result: any) => {
            const meal: any = result.meals[0];
            const ingredients = [];
            //*setting ingredients
            for (let i = 1; i < 21; i++) {
              if (
                meal['strIngredient' + i] &&
                meal['strIngredient' + i].length > 0
              ) {
                const ingName = meal['strIngredient' + i];
                let index = 1;
                for (let j = 0; j < meal['strMeasure' + i].length; j++) {
                  if (!numbers.includes(meal['strMeasure' + i][j])) {
                    index = j;
                    j = meal['strMeasure' + i].length;
                  }
                }
                const ingAmount: number = eval(
                  meal['strMeasure' + i].slice(0, index)
                )
                  ? eval(meal['strMeasure' + i].slice(0, index))
                  : 1;
                const ingUnit =
                  meal['strMeasure' + i].slice(index) == ''
                    ? 'unit'
                    : meal['strMeasure' + i].slice(index);
                const IngredientToAdd = new Ingredient(
                  ingName,
                  ingUnit,
                  ingAmount
                );
                ingredients.push(IngredientToAdd);
              }
            }
            const recipe = new Recipe(
              meal.strMeal,
              meal.strMeal,
              ingredients,
              this.splitIt(meal.strInstructions),
              [],
              [meal.strMealThumb],
              true,
              user._id,
              new Date(),
              meal.strTags ? meal.strTags.split(' ') : []
            );
            //* adding recipe
            if (!addedRecipes.includes(meal.strMeal)) {
              this.http
                .post(environment.url + 'api/recipes/write', recipe, {
                  headers: {
                    key: environment.serverKey,
                    authToken: user._token,
                    userDataId: user._id,
                  },
                })
                .subscribe(
                  (result: any) => {
                    console.log(result);
                    addedRecipes.push(result.recipe.name);
                  },
                  (error) => {
                    clearInterval(interval);
                    console.log(error);
                  }
                );
            }
          });
      });
    }, 3000);
  }
}

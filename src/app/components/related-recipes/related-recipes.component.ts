import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models';
import { RecipesService } from 'src/app/services/recipes/recipes.service';

@Component({
  selector: 'app-related-recipes',
  templateUrl: './related-recipes.component.html',
  styleUrls: ['./related-recipes.component.scss'],
})
export class RelatedRecipesComponent implements OnInit {
  @Input() tags!: string[];
  constructor(private recipesServie: RecipesService) {}

  recipes!: Recipe[];
  loading: boolean = true;

  ngOnInit(): void {
    //*getting recipes
    this.recipesServie.getRecipes().subscribe(
      (recipes) => {
        this.recipes = recipes;
        if (this.recipes.length > 0) {
          this.loading = false;
        }
      },
      (error) => {
        console.log(error);
        this.recipes = [];
      }
    );
  }
}

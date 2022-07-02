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

  ngOnInit(): void {
    this.recipesServie.getRecipes().subscribe(
      (recipes) => {
        this.recipes = recipes;
      },
      (error) => {
        console.log(error);
        this.recipes = [];
      }
    );
  }
}

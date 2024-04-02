import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/public/interfaces/interfaces';
import { RecipeService } from '../services/recipe/recipe.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];

  showLoadMoreButton = true;

  constructor(private recipeService: RecipeService) {}
  async ngOnInit() {
    await this.getRecipes();
    this.showLoadMoreButton = true;
  }

  async getRecipesLoadMore() {
    const { data, hasMore } = await this.recipeService.getRecipesLoadMore();
    this.showLoadMoreButton = hasMore;
    this.recipes.push(...data);
  }

  async getRecipes() {
    const { data } = await this.recipeService.getRecipes();
    this.recipes.push(...data);
  }
}

import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/public/interfaces/interfaces';
import { RecipeService } from '../services/recipe/recipe.service';

/**
 * Component responsible for displaying a list of recipes.
 */
@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent implements OnInit {
  // Array to store recipes
  recipes: Recipe[] = [];
  // Flag to indicate whether the "Load More" button should be shown
  showLoadMoreButton = true;

  constructor(private recipeService: RecipeService) {}

  /**
   * Lifecycle hook called when the component is initialized.
   * Calls the getRecipes function to fetch recipes.
   */
  async ngOnInit() {
    await this.getRecipes();
    this.showLoadMoreButton = true;
  }

  /**
   * Fetches more recipes from the service and adds them to the recipes array.
   */
  async getRecipesLoadMore() {
    const { data, hasMore } = await this.recipeService.getRecipesLoadMore();
    this.showLoadMoreButton = hasMore;
    this.recipes.push(...data);
  }

  /**
   * Fetches recipes from the service and populates the recipes array.
   */
  async getRecipes() {
    const { data } = await this.recipeService.getRecipes();
    this.recipes.push(...data);
  }
}

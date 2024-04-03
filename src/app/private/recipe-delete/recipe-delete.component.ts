import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/public/interfaces/interfaces';
import { RecipeService } from 'src/app/public/services/recipe/recipe.service';

/**
 * Component for deleting recipes.
 * This component provides functionality for deleting recipes.
 */
@Component({
  selector: 'app-recipe-delete',
  templateUrl: './recipe-delete.component.html',
  styleUrls: ['./recipe-delete.component.css'],
})
export class RecipeDeleteComponent {
  // ID of the recipe to delete
  recipeId: string | null = '';
  // Recipe object to delete
  recipe: Recipe | null = null;

  /**
   * Constructor for RecipeDeleteComponent.
   * @param recipeService Service for interacting with recipes
   * @param route Angular ActivatedRoute for retrieving route parameters
   * @param router Angular router service for navigation
   */

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Subscribe to route parameters to get recipe ID and fetch recipe details
    this.route.paramMap.subscribe(async (params) => {
      this.recipeId = params.get('id');
      this.recipe = await this.recipeService.getRecipeById(this.recipeId!);
    });
  }

  /**
   * Deletes the recipe using the recipe service.
   * Navigates to the recipe list page after deletion.
   */
  async deleteRecipe() {
    await this.recipeService.deleteRecipe(this.recipeId!);
    await this.router.navigate(['/recipes-list']);
  }
}

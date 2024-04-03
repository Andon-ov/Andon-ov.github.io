import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirestoreUser, Recipe } from 'src/app/public/interfaces/interfaces';
import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';
import { RecipeService } from 'src/app/public/services/recipe/recipe.service';
import { UserService } from 'src/app/public/services/user.service';

@Component({
  selector: 'app-user-favorite-recipes',
  templateUrl: './user-favorite-recipes.component.html',
  styleUrls: ['./user-favorite-recipes.component.css'],
})
export class UserFavoriteRecipesComponent implements OnInit {
  // User data
  userData: FirestoreUser | null | undefined;
  // BehaviorSubject to hold favorite recipes
  recipesSubject: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);
  // Flag to indicate if recipes are loading
  isLoadingComments: boolean = true;

  /**
   * @param userService Service for managing user data
   * @param recipeService Service for managing recipes
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    private userService: UserService,
    private recipeService: RecipeService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  ngOnInit(): void {
    // Load favorite recipes on component initialization
    this.loadFavoriteRecipes();
  }

  // Getter for accessing favorite recipes
  get recipes(): Recipe[] {
    return this.recipesSubject.value;
  }

  // Load favorite recipes for the user
  loadFavoriteRecipes() {
    this.userService.userData$.subscribe({
      next: async (value) => {
        if (value) {
          this.userData = value;
          // If user data is available
          if (this.userData) {
            // Initialize an array to store favorite recipes
            const recipes: Recipe[] = [];
            // Iterate through each favorite recipe ID
            for (const recipeId of this.userData.favoriteRecipes) {
              if (recipeId) {
                // Fetch recipe details for each ID
                const recipe = await this.recipeService.getRecipeById(recipeId);
                if (recipe) {
                  // Add fetched recipe to the array
                  recipes.push(recipe);
                }
              }
            }
            // Update BehaviorSubject with the fetched recipes
            this.recipesSubject.next(recipes);
            // Set loading flag to false once recipes are loaded
            this.isLoadingComments = false;
          }
        } else {
          // If user data is not available, handle the error
          const errorMessage = `Cant found user with this UID`;
          this.globalErrorHandler.handleError(errorMessage);
        }
      },
      error: (error) => {
        // Handle error if subscription fails
        this.globalErrorHandler.handleError(error);
      },
    });
  }

  /**
   * Updates the user's list of favorite recipes.
   * @param recipeId The ID of the recipe to update as a favorite.
   */
  async updateFavoriteRecipes(recipeId: string) {
    // Check if recipeId is provided
    if (!recipeId) {
      const errorMessage = 'Recipe data is missing.';
      this.globalErrorHandler.handleError(errorMessage);
      return;
    }
    // Check if userData and recipeId are available
    if (this.userData && recipeId) {
      // Update favorite recipes for the user
      await this.userService.updateFavoriteRecipes(
        recipeId,
        this.userData.uid,
        true
      );
      // Reload favorite recipes after update
      this.loadFavoriteRecipes();
    }
  }
}

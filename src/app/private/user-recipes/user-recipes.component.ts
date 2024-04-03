import { Component, OnInit } from '@angular/core';
import { FirestoreUser, Recipe } from 'src/app/public/interfaces/interfaces';
import { UserService } from 'src/app/public/services/user.service';

import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';
import { RecipeService } from 'src/app/public/services/recipe/recipe.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.css'],
})
export class UserRecipesComponent implements OnInit {
  // User data
  userData: FirestoreUser | null | undefined;
  // List of recipes created by the user
  recipes: Recipe[] = [];
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
    // Subscribe to user data changes
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          // If user data is available, load recipes by user ID
          this.userData = value;
          this.loadRecipesByUID(value.uid);
        } else {
          // If user data is not available, handle the error
          const errorMessage = `Cant found user with this User ID`;
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
   * Loads recipes created by the user.
   * @param uid The user ID.
   */
  async loadRecipesByUID(uid: string): Promise<void> {
    try {
      // Fetch recipes by user ID
      const recipes = await this.recipeService.getRecipeByUID(uid);
      // Update the recipes list
      this.recipes = recipes;
      // Set loading flag to false once recipes are loaded
      if (recipes) {
        this.isLoadingComments = false;
      }
    } catch (error) {
      // Handle error if fetching recipes fails
      this.globalErrorHandler.handleError(error);
    }
  }
}

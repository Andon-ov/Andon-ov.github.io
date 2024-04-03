import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/public/services/recipe/recipe.service';
import { Comments, FirestoreUser, Recipe } from '../interfaces/interfaces';
import { UserService } from 'src/app/public/services/user.service';
import { CommentService } from 'src/app/public/services/comment/comment.service';
import { GlobalErrorHandlerService } from '../services/globalErrorHandler/global-error-handler.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  // The recipe being displayed
  recipe: Recipe | null = null;
  // The ID of the recipe being displayed
  recipeId: string | null = '';
  // Comments associated with the recipe
  comments: Comments[] = [];
  // Flag to toggle display of comment form
  showCommentForm = false;
  // User data
  userData: FirestoreUser | undefined;

  /**
   * @param route Angular ActivatedRoute for retrieving route parameters
   * @param recipeService Service for interacting with recipes
   * @param commentService Service for interacting with comments in Firestore
   * @param userService Service for interacting with user data
   * @param router Angular router service for navigation
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private userService: UserService,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    // Subscribe to route parameters to get the recipe ID
    this.route.paramMap.subscribe(async (params) => {
      this.recipeId = params.get('id');
    });

    // Subscribe to the comment added event to update comments after adding a new comment
    commentService.getCommentAddedObservable().subscribe(async () => {
      console.log('Comment successfully added.');
      await this.loadCommentsForRecipe();
    });
  }

  /**
   * Loads recipe data and associated comments from the server.
   */
  async loadRecipeData() {
    if (this.recipeId) {
      try {
        this.recipe = await this.recipeService.getRecipeById(this.recipeId);
        this.comments = await this.commentService.getCommentsForRecipe(
          this.recipeId
        );
      } catch (error) {
        this.globalErrorHandler.handleError(error);
      }
    }
  }

  /**
   * Navigates to the recipe edit page for the specified recipe.
   */
  async navigateToRecipeEdit() {
    await this.router.navigate(['/dashboard/recipe-edit', this.recipeId]);
  }

  /**
   * Navigates to the recipe delete page for the specified recipe.
   */
  async navigateToRecipeDelete() {
    await this.router.navigate(['/dashboard/recipe-delete', this.recipeId]);
  }

  /**
   * Loads recipe data and comments associated with the recipe on component initialization.
   */
  async ngOnInit(): Promise<void> {
    await this.loadRecipeData();

    // Subscribe to user data changes
    this.userService.userData$.subscribe((userData) => {
      if (userData) {
        this.userData = userData;
      }
    });
  }

  /**
   * Toggles the visibility of the comment form.
   */
  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  /**
   * Navigates to the comment edit page for the specified comment.
   * @param commentId The ID of the comment to edit.
   */
  async navigateToCommentEdit(commentId: string) {
    await this.router.navigate(['/dashboard/comment-edit', commentId]);
  }

  /**
   * Deletes the specified comment and reloads the recipe data.
   * @param id The ID of the comment to delete.
   */
  async deleteComment(id: string) {
    try {
      await this.commentService.deleteComment(id);
      await this.loadRecipeData();
    } catch (error) {
      this.globalErrorHandler.handleError(error);
    }
  }

  /**
   * Updates the likes of the recipe.
   * If the user has already liked the recipe, unlikes it; otherwise, likes it.
   */
  async updateRecipeLikes() {
    if (!this.recipe) {
      const errorMessage = 'Recipe data is missing.';
      this.globalErrorHandler.handleError(errorMessage);

      return;
    }

    if (!this.userData) {
      const errorMessage = 'User is not logged in.';
      this.globalErrorHandler.handleError(errorMessage);
      return;
    }

    let alreadyLiked = this.recipe.likes.includes(this.userData.uid);

    await this.recipeService.updateRecipeLikes(
      this.recipeId!,
      this.userData.uid,
      alreadyLiked
    );

    await this.loadRecipeData();
  }

  /**
   * Updates the list of favorite recipes for the logged-in user.
   */
  async updateFavoriteRecipes() {
    if (!this.recipe) {
      const errorMessage = 'Recipe data is missing.';
      this.globalErrorHandler.handleError(errorMessage);
      return;
    }

    if (this.userData && this.recipeId) {
      let alreadyInFavorite = this.userData.favoriteRecipes.includes(
        this.recipeId
      );

      await this.userService.updateFavoriteRecipes(
        this.recipeId!,
        this.userData.uid,
        alreadyInFavorite
      );

      // Reload recipe data after updating favorite recipes
      await this.loadRecipeData();
    }
  }

  /**
   * Loads comments associated with the current recipe from the server.
   */
  private async loadCommentsForRecipe() {
    if (this.recipeId) {
      this.comments = await this.commentService.getCommentsForRecipe(
        this.recipeId
      );
    }
  }
}

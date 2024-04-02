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
  recipe: Recipe | null = null;
  recipeId: string | null = '';
  comments: Comments[] = [];
  showCommentForm = false;
  userData: FirestoreUser | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private userService: UserService,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {
    this.route.paramMap.subscribe(async (params) => {
      this.recipeId = params.get('id');
    });

    commentService.getCommentAddedObservable().subscribe(async () => {
      console.log('Comment successfully added.');
      await this.loadCommentsForRecipe();
    });
  }

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

  async navigateToRecipeEdit() {
    await this.router.navigate(['/dashboard/recipe-edit', this.recipeId]);
  }

  async navigateToRecipeDelete() {
    await this.router.navigate(['/dashboard/recipe-delete', this.recipeId]);
  }

  async ngOnInit(): Promise<void> {
    await this.loadRecipeData();
    this.userService.userData$.subscribe((userData) => {
      if (userData) {
        this.userData = userData;
      }
    });
  }

  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  async navigateToCommentEdit(commentId: string) {
    await this.router.navigate(['/dashboard/comment-edit', commentId]);
  }

  async deleteComment(id: string) {
    try {
      await this.commentService.deleteComment(id);
      await this.loadRecipeData();
    } catch (error) {
      this.globalErrorHandler.handleError(error);
    }
  }

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

      await this.loadRecipeData();
    }
  }

  private async loadCommentsForRecipe() {
    if (this.recipeId) {
      this.comments = await this.commentService.getCommentsForRecipe(
        this.recipeId
      );
    }
  }
}

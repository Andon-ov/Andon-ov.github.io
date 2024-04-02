import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FirestoreUser, Recipe} from 'src/app/public/interfaces/interfaces';
import {GlobalErrorHandlerService} from 'src/app/public/services/globalErrorHandler/global-error-handler.service';
import {RecipeService} from 'src/app/public/services/recipe/recipe.service';
import {UserService} from 'src/app/public/services/user.service';

@Component({
  selector: 'app-user-favorite-recipes',
  templateUrl: './user-favorite-recipes.component.html',
  styleUrls: ['./user-favorite-recipes.component.css'],
})
export class UserFavoriteRecipesComponent implements OnInit {
  userData: FirestoreUser | null | undefined;
  recipesSubject: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);

  isLoadingComments: boolean = true;

  constructor(
    private userService: UserService,
    private recipeService: RecipeService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteRecipes();
  }

  get recipes(): Recipe[] {
    return this.recipesSubject.value;
  }

  loadFavoriteRecipes() {
    this.userService.userData$.subscribe({
      next: async (value) => {
        if (value) {
          this.userData = value;
          if (this.userData) {
            const recipes: Recipe[] = [];
            for (const recipeId of this.userData.favoriteRecipes) {
              if (recipeId) {
                const recipe = await this.recipeService.getRecipeById(recipeId);
                if (recipe) {
                  recipes.push(recipe);
                }
              }
            }
            this.recipesSubject.next(recipes);
            this.isLoadingComments = false;
          }
        } else {
          const errorMessage = `Cant found user with this UID`;
          this.globalErrorHandler.handleError(errorMessage);
        }
      },
      error: (error) => {
        this.globalErrorHandler.handleError(error);
      },
    });
  }

  async updateFavoriteRecipes(recipeId: string) {
    if (!recipeId) {
      const errorMessage = 'Recipe data is missing.';
      this.globalErrorHandler.handleError(errorMessage);
      return;
    }

    if (this.userData && recipeId) {
      await this.userService.updateFavoriteRecipes(
        recipeId,
        this.userData.uid,
        true
      );
      this.loadFavoriteRecipes();
    }
  }
}

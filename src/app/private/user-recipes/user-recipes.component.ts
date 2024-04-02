import {Component, OnInit} from '@angular/core';
import {FirestoreUser, Recipe} from 'src/app/public/interfaces/interfaces';
import {UserService} from 'src/app/public/services/user.service';

import {GlobalErrorHandlerService} from 'src/app/public/services/globalErrorHandler/global-error-handler.service';
import { RecipeService } from 'src/app/public/services/recipe/recipe.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.component.html',
  styleUrls: ['./user-recipes.component.css'],
})
export class UserRecipesComponent implements OnInit {
  userData: FirestoreUser | null | undefined;
  recipes: Recipe[] = [];
  isLoadingComments: boolean = true;

  constructor(
    private userService: UserService,
    private recipeService: RecipeService,
    private globalErrorHandler: GlobalErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userData = value;
          this.loadRecipesByUID(value.uid);
        } else {
          const errorMessage = `Cant found user with this User ID`;
          this.globalErrorHandler.handleError(errorMessage);
        }
      },
      error: (error) => {
        this.globalErrorHandler.handleError(error);
      },
    });
  }

  async loadRecipesByUID(uid: string): Promise<void> {
    try {
      const recipes = await this.recipeService.getRecipeByUID(uid);
      this.recipes = recipes;

      if (recipes) {
        this.isLoadingComments = false;
      }
    } catch (error) {
      this.globalErrorHandler.handleError(error);
    }
  }
}

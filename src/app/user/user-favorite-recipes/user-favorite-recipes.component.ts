import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Recipe } from 'src/app/shared/interfaces/interfaces';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-favorite-recipes',
  templateUrl: './user-favorite-recipes.component.html',
  styleUrls: ['./user-favorite-recipes.component.css'],
})
export class UserFavoriteRecipesComponent implements OnInit {
  userData: any | null = null;
  recipes: Recipe[] = [];
  emptyRecipes = true;

  constructor(
    private userService: UserService,
    private firestore: Firestore,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          this.userData = value;
        } else {
          console.log(`Cant found user with this UID ${value!.uid}`);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.userData.favoriteRecipes.forEach(async (recipeId: string) => {
      if (recipeId) {
        const recipe = await this.recipeService.getRecipeById(recipeId);
        if (recipe) {
          this.recipes.push(recipe);
        }
      }
    });
  }
}

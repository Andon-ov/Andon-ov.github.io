import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirestoreUser, Recipe } from 'src/app/public/interfaces/interfaces';
import { RecipeService } from 'src/app/public/services/recipe/recipe.service';
import { UserService } from 'src/app/public/services/user.service';

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
    private recipeService: RecipeService
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
          console.log(`Cant found user with this UID`);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async updateFavoriteRecipes(recipeId: string) {
    if (!recipeId) {
      console.error('Recipe data is missing.');
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

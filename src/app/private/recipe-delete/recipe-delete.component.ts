import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/public/interfaces/interfaces';
import { RecipeService } from 'src/app/public/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe-delete',
  templateUrl: './recipe-delete.component.html',
  styleUrls: ['./recipe-delete.component.css'],
})
export class RecipeDeleteComponent {
  recipeId: string | null = '';
  recipe: Recipe | null = null;


  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe(async (params) => {
      const recipeId = params.get('id');
      this.recipeId = recipeId;
      this.recipe = await this.recipeService.getRecipeById(this.recipeId!);
    });
  }
  deleteRecipe() {
    this.recipeService.deleteRecipe(this.recipeId!);
    this.router.navigate(['/recipes-list']);
  }
}

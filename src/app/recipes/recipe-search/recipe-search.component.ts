import { Component } from '@angular/core';
import { Recipe } from 'src/app/shared/interfaces/interfaces';
import { RecipesService } from 'src/app/shared/services/recipes.service';
import { SearchDataService } from 'src/app/shared/services/search-data.service';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css'],
})
export class RecipeSearchComponent {
  recipes: Recipe[] = [];
  result = false;

  constructor(private recipeService: RecipesService,private searchDataService: SearchDataService) {}
  ngOnInit(): void {
    this.getRecipes();
  }

  async getRecipes() {
    const { data } = await this.recipeService.searchRecipesByTitle(this.searchDataService.searchQuery);
    console.log(data);
    if (data.length > 0) {
      this.recipes.push(...data);
      this.result = true;
    } else {
      this.result = false;
    }
  }
}

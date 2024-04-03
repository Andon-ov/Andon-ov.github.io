import { Recipe } from 'src/app/public/interfaces/interfaces';

import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { RecipeService } from '../services/recipe/recipe.service';

/**
 * RecipeSearchComponent is responsible for displaying search results based on the provided search query.
 */
@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css'],
})
export class RecipeSearchComponent {
  // Array to store search results
  recipes: Recipe[] = [];
  // Flag to indicate if search result is available
  result = false;
  // Form group for search form
  searchForm: FormGroup | undefined;

  constructor(
    private recipeService: RecipeService,
    @Inject(ActivatedRoute) private route: ActivatedRoute
  ) {}

  /**
   * Initializes the component and triggers search based on the provided search query in the route parameters.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const searchQuery = params['search'];
      if (searchQuery) {
        this.searchRecipesByTitle(searchQuery);
      }
    });
  }

  /**
   * Searches for recipes by title using the provided search query.
   * @param searchQuery The search query to search recipes by title.
   */
  async searchRecipesByTitle(searchQuery: string) {
    const { data } = await this.recipeService.searchRecipesByTitle(searchQuery);
    // Call service method to search recipes by title
    if (data.length > 0) {
      // Add search results to the recipes array
      this.recipes.push(...data);
      // Set result flag to true if search results are found
      this.result = true;
    } else {
      // Set result flag to false if no search results are found
      this.result = false;
    }
  }
}

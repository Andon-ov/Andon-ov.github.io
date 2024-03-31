import { Recipe } from 'src/app/public/interfaces/interfaces';
import { RecipesService } from 'src/app/public/services/recipes/recipes.service';

import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css'],
})
export class RecipeSearchComponent {
  recipes: Recipe[] = [];
  result = false;
  searchForm: FormGroup | undefined;

  constructor(
    private recipeService: RecipesService,
    @Inject(ActivatedRoute) private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const searchQuery = params['search'];
      if (searchQuery) {
        this.getRecipes(searchQuery);
      }
    });
  }

  async getRecipes(searchQuery: string) {
    const { data } = await this.recipeService.searchRecipesByTitle(searchQuery);
    console.log(data);
    if (data.length > 0) {
      this.recipes.push(...data);
      this.result = true;
    } else {
      this.result = false;
    }
  }
}

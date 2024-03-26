import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/public/interfaces/interfaces';
import { RecipesService } from 'src/app/public/services/recipes/recipes.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];

  showLoadMoreButton = true;

  constructor(private recipeService: RecipesService) {}
  ngOnInit(): void {
    this.getRecipes();
    this.showLoadMoreButton = true;
  }

  async getRecipesLoadMore() {
    const { data, hasMore } = await this.recipeService.getRecipesLoadMore();
    console.log(hasMore);

    this.showLoadMoreButton = hasMore;
    this.recipes.push(...data);
  }

  async getRecipes() {
    const { data} = await this.recipeService.getRecipes();

    this.recipes.push(...data);
  }



}

//! get all recipe functionality
// getRecipes(): void {
//   this.recipeService.getRecipes().subscribe({
//     next: (data) => {
//       this.recipes = data.sort((a, b) => a.title.localeCompare(b.title));
//       // .filter((a) => a.is_active);
//     },
//     error: (error) => {
//       console.error('Error fetching recipes:', error);
//     },
//   });
// }

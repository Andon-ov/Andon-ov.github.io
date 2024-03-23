import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Recipe } from 'src/app/shared/interfaces/interfaces';
import { RecipesService } from 'src/app/shared/services/recipes.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];

  showLoadMoreButton = true;
  lastDoc: any;
  hasMoreRecipesSub: Subscription | undefined;

  hasMoreRecipes = true;

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    this.getRecipesLoadMore();
  }

  async getRecipesLoadMore() {
    const { data, hasMore } = await this.recipeService.getRecipesLoadMore();
    console.log(hasMore);

    this.showLoadMoreButton = hasMore;
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

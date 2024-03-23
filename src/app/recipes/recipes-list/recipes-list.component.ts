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

  hasMoreRecipes$: Observable<boolean> | undefined;
  hasMoreRecipes = true;

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    this.hasMoreRecipes$ = this.recipeService.hasMoreRecipesObservable;

    this.getRecipesLoadMore();
    this.setupHasMoreRecipesSubscription();
  }

  async getRecipesLoadMore() {
    const { data, hasMore } = await this.recipeService.getRecipesLoadMore();
    console.log(hasMore);

    this.showLoadMoreButton = hasMore;
    this.recipes.push(...data);
  }

  setupHasMoreRecipesSubscription(): void {
    this.hasMoreRecipesSub =
      this.recipeService.hasMoreRecipesObservable.subscribe((hasMore) => {
        this.hasMoreRecipes = hasMore;
      });
  }

  ngOnDestroy(): void {
    if (this.hasMoreRecipesSub) {
      this.hasMoreRecipesSub.unsubscribe();
    }
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

// ! pagination
// haveMore(): Observable<boolean> {
//   return this.recipeService.hasMoreRecipesObservable;
// }

// loadRecipes() {
//   this.recipeService.loadRecipes('title', 6).subscribe({
//     next: (data) => {
//       this.recipes = data.sort((a, b) => a.title.localeCompare(b.title));
//     },
//     error: (error) => {
//       console.error('Error fetching recipes:', error);
//     },
//   });
// }

// loadMoreRecipes() {
//   this.recipeService.loadMoreRecipes('title', 6).subscribe({
//     next: (data) => {
//       this.recipes = data.sort((a, b) => a.title.localeCompare(b.title));
//     },
//     error: (error) => {
//       console.error('Error fetching recipes:', error);
//     },
//   });
// }

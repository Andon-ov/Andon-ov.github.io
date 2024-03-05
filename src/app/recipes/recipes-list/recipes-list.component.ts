import {Component, OnInit} from '@angular/core';
import {Recipe} from 'src/app/shared/interfaces/interfaces';
import {RecipesService} from 'src/app/shared/services/recipes.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {

  recipes: Recipe[] = [];


  constructor(private recipeService: RecipesService) {

  }

  ngOnInit(): void {
    this.getRecipes();

  }

  getRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data) => {
        this.recipes = data
          .sort((a, b) => a.title.localeCompare(b.title));
        // .filter((a) => a.is_active);
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
      },
    });
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { RecipeComponent } from './recipe/recipe.component';
import { RouterModule } from '@angular/router';
import { CommentModule } from '../comment/comment.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDeleteComponent } from './recipe-delete/recipe-delete.component';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';


@NgModule({
  declarations: [RecipesListComponent, RecipeCreateComponent, RecipeComponent, RecipeEditComponent, RecipeDeleteComponent, RecipeSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    SharedModule,
    RouterModule,
    CommentModule,
    
  ],
  exports: [RecipesListComponent, RecipeCreateComponent],
})
export class RecipesModule {}

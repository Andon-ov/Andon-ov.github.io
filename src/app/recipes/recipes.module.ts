import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { EditorModule } from '@tinymce/tinymce-angular';
import { RecipeComponent } from './recipe/recipe.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RecipesListComponent, RecipeCreateComponent, RecipeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    EditorModule,
    RouterModule,
  ],
  exports: [RecipesListComponent, RecipeCreateComponent],
})
export class RecipesModule {}

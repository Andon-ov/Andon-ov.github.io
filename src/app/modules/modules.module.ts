import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesModule } from './recipes/recipes.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[RecipesModule]
})
export class ModulesModule { }

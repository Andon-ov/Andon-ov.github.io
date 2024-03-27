import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { userGuard } from './private/user.guard';
import { RegisterComponent } from './public/register/register.component';
import { LoginComponent } from './public/login/login.component';
import { RecipesListComponent } from './public/recipes-list/recipes-list.component';
import { RecipeComponent } from './public/recipe/recipe.component';
import { RecipeSearchComponent } from './public/recipe-search/recipe-search.component';
import { CarouselComponent } from './public/carousel/carousel.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: CarouselComponent },

  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'recipes-list',
    component: RecipesListComponent,
  },

  {
    path: 'recipe-search',
    component: RecipeSearchComponent,
  },

  {
    path: 'recipe/:id',
    component: RecipeComponent,
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./private/private.module').then((m) => m.PrivateModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

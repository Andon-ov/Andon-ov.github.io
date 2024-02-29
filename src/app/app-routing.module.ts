import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './modules/user/register/register.component';
import { LoginComponent } from './modules/user/login/login.component';
import { CarouselComponent } from './shared/carousel/carousel.component';
import { RecipesListComponent } from './modules/recipes/recipes-list/recipes-list.component';
import { RecipeCreateComponent } from './modules/recipes/recipe-create/recipe-create.component';

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
    path: 'recipe-create',
    component: RecipeCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

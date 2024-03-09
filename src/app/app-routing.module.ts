import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { CarouselComponent } from './shared/carousel/carousel.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { RecipeComponent } from './recipes/recipe/recipe.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { UserRecipesComponent } from './user/user-recipes/user-recipes.component';

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
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'dashboard',
    component: UserInfoComponent,
  },
  {
    path: 'user-recipes',
    component: UserRecipesComponent,
  },
  {
    path: 'recipes-list',
    component: RecipesListComponent,
  },
  {
    path: 'recipe-create',
    component: RecipeCreateComponent,
  },

  {
    path: 'recipe/:id',
    component: RecipeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

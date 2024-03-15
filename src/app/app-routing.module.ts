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
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { CommentFormEditComponent } from './comment/comment-form-edit/comment-form-edit.component';

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
    component: DashboardComponent,
    children: [
      {
        path: 'user-recipes',
        component: UserRecipesComponent,
      },

      {
        path: 'recipe-create',
        component: RecipeCreateComponent,
      },

      {
        path: 'recipe-edit/:id',
        component: RecipeEditComponent,
      },
      {
        path: 'user-info',
        component: UserInfoComponent,
      },
    ],
  },

  {
    path: 'recipes-list',
    component: RecipesListComponent,
  },

  {
    path: 'recipe/:id',
    component: RecipeComponent,
  },

  { path: 'comment-edit/:id', component: CommentFormEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

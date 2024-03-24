import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {userGuard} from './user/user.guard';
import {RegisterComponent} from './user/register/register.component';
import {LoginComponent} from './user/login/login.component';
import {ForgotPasswordComponent} from './user/forgot-password/forgot-password.component';
import {UserInfoComponent} from './user/user-info/user-info.component';
import {UserRecipesComponent} from './user/user-recipes/user-recipes.component';
import {DashboardComponent} from './user/dashboard/dashboard.component';
import {UserCommentsComponent} from './user/user-comments/user-comments.component';
import {UserFavoriteRecipesComponent} from './user/user-favorite-recipes/user-favorite-recipes.component';

import {RecipesListComponent} from './recipes/recipes-list/recipes-list.component';
import {RecipeCreateComponent} from './recipes/recipe-create/recipe-create.component';
import {RecipeComponent} from './recipes/recipe/recipe.component';
import {RecipeEditComponent} from './recipes/recipe-edit/recipe-edit.component';
import {RecipeDeleteComponent} from './recipes/recipe-delete/recipe-delete.component';
import {RecipeSearchComponent} from './recipes/recipe-search/recipe-search.component';

import {CarouselComponent} from './shared/carousel/carousel.component';
import {CommentFormEditComponent} from './comment/comment-form-edit/comment-form-edit.component';

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
    canActivate: [userGuard],
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
        path: 'recipe-delete/:id',
        component: RecipeDeleteComponent,
      },
      {
        path: 'user-info',
        component: UserInfoComponent,
      },
      {
        path: 'user-comments',
        component: UserCommentsComponent,
      },
      {
        path: 'user-favorite-recipes',
        component: UserFavoriteRecipesComponent,
      },
    ],
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

  { path: 'comment-edit/:id', component: CommentFormEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

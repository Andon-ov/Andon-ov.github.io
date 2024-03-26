import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {userGuard} from './private/user.guard';
import {RegisterComponent} from './public/register/register.component';
import {LoginComponent} from './public/login/login.component';
import {ForgotPasswordComponent} from './private/forgot-password/forgot-password.component';
import {UserInfoComponent} from './private/user-info/user-info.component';
import {UserRecipesComponent} from './private/user-recipes/user-recipes.component';
import {DashboardComponent} from './private/dashboard/dashboard.component';
import {UserCommentsComponent} from './private/user-comments/user-comments.component';
import {UserFavoriteRecipesComponent} from './private/user-favorite-recipes/user-favorite-recipes.component';

import {RecipesListComponent} from './public/recipes-list/recipes-list.component';
import {RecipeCreateComponent} from './private/recipe-create/recipe-create.component';
import {RecipeComponent} from './public/recipe/recipe.component';
import {RecipeEditComponent} from './private/recipe-edit/recipe-edit.component';
import {RecipeDeleteComponent} from './private/recipe-delete/recipe-delete.component';
import {RecipeSearchComponent} from './public/recipe-search/recipe-search.component';

import {CarouselComponent} from './public/carousel/carousel.component';
import {CommentFormEditComponent} from './private/comment-form-edit/comment-form-edit.component';

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

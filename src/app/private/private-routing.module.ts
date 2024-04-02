import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserRecipesComponent} from './user-recipes/user-recipes.component';
import {RecipeCreateComponent} from './recipe-create/recipe-create.component';
import {RecipeEditComponent} from './recipe-edit/recipe-edit.component';
import {RecipeDeleteComponent} from './recipe-delete/recipe-delete.component';
import {UserInfoComponent} from './user-info/user-info.component';
import {UserCommentsComponent} from './user-comments/user-comments.component';
import {UserFavoriteRecipesComponent} from './user-favorite-recipes/user-favorite-recipes.component';
import {CommentFormEditComponent} from './comment-form-edit/comment-form-edit.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'user-recipes', component: UserRecipesComponent },
      { path: 'recipe-create', component: RecipeCreateComponent },
      {
        path: 'user-favorite-recipes',
        component: UserFavoriteRecipesComponent,
      },
      { path: 'user-comments', component: UserCommentsComponent },
      { path: 'user-info', component: UserInfoComponent },
      { path: 'recipe-edit/:id', component: RecipeEditComponent },
      { path: 'recipe-delete/:id', component: RecipeDeleteComponent },

      { path: 'comment-edit/:id', component: CommentFormEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}

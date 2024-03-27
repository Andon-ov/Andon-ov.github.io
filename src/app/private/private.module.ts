import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from "@angular/router";

import {CommentFormEditComponent} from "./comment-form-edit/comment-form-edit.component";
import {RecipeEditComponent} from "./recipe-edit/recipe-edit.component";
import {RecipeCreateComponent} from "./recipe-create/recipe-create.component";
import {RecipeDeleteComponent} from "./recipe-delete/recipe-delete.component";
import {ImageUploadComponent} from "./image-upload/image-upload.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {UserCommentsComponent} from "./user-comments/user-comments.component";
import {UserFavoriteRecipesComponent} from "./user-favorite-recipes/user-favorite-recipes.component";
import {UserInfoComponent} from "./user-info/user-info.component";
import {UserRecipesComponent} from "./user-recipes/user-recipes.component";
import {PublicModule} from "../public/public.module";
import { PrivateRoutingModule } from './private-routing.module';


@NgModule({
  declarations: [

    CommentFormEditComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    ImageUploadComponent,
    RecipeEditComponent,
    RecipeCreateComponent,
    RecipeDeleteComponent,
    UserCommentsComponent,
    UserFavoriteRecipesComponent,
    UserInfoComponent,
    UserRecipesComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PublicModule, PrivateRoutingModule],
  exports: [

    CommentFormEditComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    ImageUploadComponent,
    RecipeEditComponent,
    RecipeCreateComponent,
    RecipeDeleteComponent,
    UserCommentsComponent,
    UserFavoriteRecipesComponent,
    UserInfoComponent,
    UserRecipesComponent
  ],
})
export class PrivateModule {
}







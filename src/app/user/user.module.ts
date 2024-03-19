import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { TimestampFormatPipe } from '../shared/pipe/timestampFormat/timestamp-format.pipe';
import { UserRecipesComponent } from './user-recipes/user-recipes.component';
import { RecipeCreateComponent } from '../recipes/recipe-create/recipe-create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserCommentsComponent } from './user-comments/user-comments.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    UserInfoComponent,
    TimestampFormatPipe,
    UserRecipesComponent,
    DashboardComponent,
    UserCommentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class UserModule {}

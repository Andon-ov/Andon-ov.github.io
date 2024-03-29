import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import {SafeUrlPipe} from "./pipes/safeUrl/safe-url.pipe";
import {TimestampFormatPipe} from "./pipes/timestampFormat/timestamp-format.pipe";
import {CarouselComponent} from "./carousel/carousel.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ScrollToTopComponent} from "./scroll-to-top/scroll-to-top.component";
import {PrivateModule} from "../private/private.module";
import {CommentFormComponent} from "./comment-form/comment-form.component";
import { ResponsiveClassDirective } from './header/responsive-class.directive';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';


@NgModule({
  declarations: [
    CarouselComponent,
    CommentFormComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,

    SafeUrlPipe,
    TimestampFormatPipe,

    RecipeComponent,
    RecipesListComponent,
    RecipeSearchComponent,
    RegisterComponent,
    ScrollToTopComponent,
    ResponsiveClassDirective,
    AboutUsComponent,
    PrivacyPolicyComponent,
    ContactUsComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CarouselComponent,
    CommentFormComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,

    SafeUrlPipe,
    TimestampFormatPipe,

    RecipeComponent,
    RecipesListComponent,
    RecipeSearchComponent,
    RegisterComponent,
    ScrollToTopComponent,

  ],
})
export class PublicModule {}

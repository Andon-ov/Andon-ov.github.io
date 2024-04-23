import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { SafeUrlPipe } from './pipes/safeUrl/safe-url.pipe';
import { TimestampFormatPipe } from './pipes/timestampFormat/timestamp-format.pipe';
import { CarouselComponent } from './carousel/carousel.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CustomAlertComponent } from './custom-alert/custom-alert.component';
import { LogoSvgComponent } from './logo-svg/logo-svg.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AnimateOnScrollDirective } from './directives/animate-on-scroll.directive';
import { HeroComponent } from './hero/hero.component';

import { CarouselModule } from 'ngx-owl-carousel-o';

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
    AboutUsComponent,
    PrivacyPolicyComponent,
    ContactUsComponent,
    ForgotPasswordComponent,
    CustomAlertComponent,
    LogoSvgComponent,
    PageNotFoundComponent,
    AnimateOnScrollDirective,
    HeroComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // ngx-owl-carousel-o
    CarouselModule,
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
    ForgotPasswordComponent,
    CustomAlertComponent,
    LogoSvgComponent,
  ],
})
export class PublicModule {}

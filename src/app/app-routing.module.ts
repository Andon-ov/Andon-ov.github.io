import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { privateGuard } from './private/private.guard';
import { RegisterComponent } from './public/register/register.component';
import { LoginComponent } from './public/login/login.component';
import { RecipesListComponent } from './public/recipes-list/recipes-list.component';
import { RecipeComponent } from './public/recipe/recipe.component';
import { RecipeSearchComponent } from './public/recipe-search/recipe-search.component';
import { CarouselComponent } from './public/carousel/carousel.component';
import { publicGuard } from './public/public.guard';

import { AboutUsComponent } from './public/about-us/about-us.component';
import { PrivacyPolicyComponent } from './public/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './public/contact-us/contact-us.component';
import { ForgotPasswordComponent } from './public/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';
import { HeroComponent } from './public/hero/hero.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HeroComponent },

  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
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

  {
    path: 'about',
    component: AboutUsComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'contact',
    component: ContactUsComponent,
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./private/private.module').then((m) => m.PrivateModule),
    canActivate: [privateGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

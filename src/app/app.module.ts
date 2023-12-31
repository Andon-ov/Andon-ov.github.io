import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from '@angular/common/http';

import {NotFoundComponent} from './not-found/not-found.component';
import {RouterModule} from '@angular/router';

import {environment} from '../environments/environment';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';

import {CategoriesListComponent} from './categories-list/categories-list.component';
import {CategoryComponent} from './category/category.component';
import {RecipeComponent} from './recipe/recipe.component';

import {FormsModule} from './forms/forms.module';
import {BaseRecipeComponent} from './base-recipe/base-recipe.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CloudinaryModule} from '@cloudinary/ng';


import {BaseListComponent} from './base-list/base-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {SharedModule} from './shared/shared.module';

import {AngularFireAuthModule} from '@angular/fire/compat/auth'
import {AuthModule} from './auth/auth.module';
import { FormErrorCheckService } from './shared/form-error-check.service/form-error-check.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    CategoriesListComponent,
    CategoryComponent,
    RecipeComponent,
    BaseRecipeComponent,
    
    BaseListComponent,

  ],
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthModule,
    // Cloud Firestore
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    // Cloudinary
    CloudinaryModule,
    // Angular Material
    BrowserAnimationsModule,
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, FormErrorCheckService],
  bootstrap: [AppComponent],
})
export class AppModule {
}

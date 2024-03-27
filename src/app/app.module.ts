import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {environment} from '../environments/environment';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';

import {CloudinaryModule} from '@cloudinary/ng';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PublicModule} from "./public/public.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PublicModule,

    // Cloud Firestore
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),

    // Cloudinary
    CloudinaryModule,

    // Bootstrap
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}

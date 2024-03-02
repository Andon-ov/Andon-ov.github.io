import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { CloudinaryModule } from '@cloudinary/ng';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecipesModule } from './recipes/recipes.module';
import { UserModule } from './user/user.module';
import { EditorModule,
   TINYMCE_SCRIPT_SRC 
   } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,

    RecipesModule,
    UserModule,

    // Cloud Firestore
     provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
     provideFirestore(() => getFirestore()),
 
    // Cloudinary
    CloudinaryModule,

    // Bootstrap
    NgbModule,

    // Tiny MCE
    EditorModule

  ],
  providers: [
     // Tiny MCE
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

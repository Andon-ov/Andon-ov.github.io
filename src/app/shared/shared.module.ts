import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { RouterModule } from '@angular/router';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';

@NgModule({
  declarations: [
    CarouselComponent,
    ImageUploadComponent,
    SafeUrlPipe,
    ScrollToTopComponent,
  ],
  imports: [CommonModule, EditorModule, RouterModule],
  exports: [
    CarouselComponent,
    ImageUploadComponent,
    SafeUrlPipe,
    ScrollToTopComponent
  ],
})
export class SharedModule {}

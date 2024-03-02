import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CarouselComponent, ImageUploadComponent],
  imports: [CommonModule, EditorModule,RouterModule],
  exports: [CarouselComponent, ImageUploadComponent],
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';

@NgModule({
  declarations: [CarouselComponent, ImageUploadComponent],
  imports: [CommonModule],
  exports: [CarouselComponent, ImageUploadComponent],
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { RouterModule } from '@angular/router';
import { SafeUrlPipe } from './pipes/safeUrl/safe-url.pipe';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { ResponsiveClassDirective } from './directives/responsiveClass/responsive-class.directive';

@NgModule({
  declarations: [
    CarouselComponent,
    ImageUploadComponent,
    SafeUrlPipe,
    ScrollToTopComponent,
    ResponsiveClassDirective,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    CarouselComponent,
    ImageUploadComponent,
    SafeUrlPipe,
    ScrollToTopComponent,
    ResponsiveClassDirective,
  ],
})
export class SharedModule {}

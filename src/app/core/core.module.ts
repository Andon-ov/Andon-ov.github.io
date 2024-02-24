import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    NavigationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [FooterComponent, HeaderComponent, NavigationComponent,HomeComponent]
})
export class CoreModule { }

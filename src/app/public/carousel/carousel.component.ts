import { Component, AfterViewInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements AfterViewInit {
  autoplayTimeout: number = 7000;

  slidesData = [
    'https://learningherbs.com/wp-content/uploads/2019/08/herbal-first-aid-ointment-01.jpg',

    'https://www.aveeno.com/sites/aveeno_us_2/files/healingherbswithmortaran_687349.jpg',

    'https://cf.ltkcdn.net/diet-and-nutrition/natural-health-remedies/images/orig/298512-2096x1397-herbal-medicine.jpg',

    'https://joanmorais.com/wp-content/uploads/2023/03/herbal-extract.jpg',

    'https://imgix-prod.sgs.com/-/media/sgscorp/images/connectivity-and-products/aromatics-pexels.cdn.en-MU.1.jpg',
  ];

  backgroundColors = [
    'rgba(40, 167, 69, 0.8)',
    'rgba(167, 87, 94, 0.8)',
    'rgba(155, 43, 42, 0.8)',
    'rgba(162, 161, 0, 0.8)',
    'rgba(137, 153, 182, 0.8)',
  ];
  currentBackgroundIndex = 0;

  customOptions: OwlOptions = {
    dots: false,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    items: 1,
    smartSpeed: 450,
    loop: true,
    autoplay: true,
    autoplayTimeout: this.autoplayTimeout,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: false,
  };

  ngAfterViewInit() {
    setInterval(() => {
      this.currentBackgroundIndex =
        (this.currentBackgroundIndex + 1) % this.backgroundColors.length;
    }, this.autoplayTimeout);
  }
}

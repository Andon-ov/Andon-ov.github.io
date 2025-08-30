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

    'https://res.cloudinary.com/dsla98vyk/image/upload/v1756528556/vecteezy_nature-floral-background-in-early-summer-colorful-natural_26769733_p9sox6.jpg',

    'https://res.cloudinary.com/dsla98vyk/image/upload/v1756528250/298512-2096x1397-herbal-medicine_ybmf5s.jpg',

    'https://res.cloudinary.com/dsla98vyk/image/upload/v1756528247/aromatics-pexels.cdn.en-MU.1_obqbsi.jpg',

    'https://res.cloudinary.com/dsla98vyk/image/upload/v1756528247/vecteezy_elegant-white-flowers-with-orange-centers-flourishing-in-a_49092108_x9lgck.jpg',

    'https://res.cloudinary.com/dsla98vyk/image/upload/v1756528245/herbal-extract_dm5cm6.jpg',

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

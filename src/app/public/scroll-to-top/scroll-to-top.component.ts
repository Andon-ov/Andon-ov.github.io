import { Component, HostListener } from '@angular/core';

/**
 * Component responsible for displaying a button to scroll to the top of the page.
 */
@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css'],
})
export class ScrollToTopComponent {
  // Flag to control the visibility of the scroll button
  showScrollButton: boolean = false;

  /**
   * Listener for the window scroll event.
   * It updates the visibility of the scroll button based on the scroll position.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Set showScrollButton to true if the vertical scroll position is greater than 300 pixels
    this.showScrollButton = window.pageYOffset > 300;
  }

  /**
   * Scrolls the window to the top of the page smoothly when the scroll button is clicked.
   */
  scrollToTop() {
    // Scroll to the top of the page with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

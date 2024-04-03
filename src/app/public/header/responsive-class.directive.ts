import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  OnInit,
} from '@angular/core';

/**
 * Directive for adding responsive classes based on window width.
 */
@Directive({
  selector: '[appResponsiveClass]',
})
export class ResponsiveClassDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.checkWidth();
  }

  /**
   * Listener for window resize event.
   */
  @HostListener('window:resize')
  onResize() {
    this.checkWidth();
  }

  /**
   * Checks the window width and adds or removes classes accordingly.
   */
  private checkWidth() {
    if (window.innerWidth < 992) {
      this.renderer.addClass(this.el.nativeElement, 'button');
      this.renderer.addClass(this.el.nativeElement, 'nav-btn');
      this.renderer.addClass(this.el.nativeElement, 'nav-link');

      this.renderer.removeClass(this.el.nativeElement, 'navigation');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'button');
      this.renderer.removeClass(this.el.nativeElement, 'nav-link');
      this.renderer.removeClass(this.el.nativeElement, 'nav-btn');

      this.renderer.addClass(this.el.nativeElement, 'navigation');
    }
  }
}

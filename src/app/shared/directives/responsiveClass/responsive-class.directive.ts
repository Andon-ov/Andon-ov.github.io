import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appResponsiveClass]',
})
export class ResponsiveClassDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:resize')
  onResize() {
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

// nav-btn nav-link dropdown-toggle button

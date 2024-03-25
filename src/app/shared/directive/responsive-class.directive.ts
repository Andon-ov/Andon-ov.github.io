import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';


@Directive({
  selector: '[appResponsiveClass]'
})
export class ResponsiveClassDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 992) {
      this.renderer.addClass(this.el.nativeElement, 'small-screen-class');
      this.renderer.removeClass(this.el.nativeElement, 'large-screen-class');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'small-screen-class');
      this.renderer.addClass(this.el.nativeElement, 'large-screen-class');
    }
  }

}

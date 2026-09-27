import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Moves the element vertically as the page scrolls. `speed` is how much faster
 * (positive) or slower (negative) than the page it moves, e.g. 0.1 = 10% faster.
 * Intended for elements near the top of the page.
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input('appParallax') speed = 0;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private frame = 0;

  ngOnInit() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Scroll events don't need change detection
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
    this.update();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
    cancelAnimationFrame(this.frame);
  }

  private readonly onScroll = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.update();
    });
  };

  private update() {
    const offset = -window.scrollY * this.speed;
    this.el.nativeElement.style.transform = `translate3d(0, ${offset}px, 0)`;
  }
}

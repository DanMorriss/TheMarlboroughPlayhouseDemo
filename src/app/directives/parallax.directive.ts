import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Moves the element vertically as the page scrolls. `speed` is how much faster
 * (positive) or slower (negative) than the page it moves, e.g. 0.1 = 10% faster.
 *
 * By default the offset grows from the top of the page, which suits elements
 * near the top. Set `parallaxFrom="viewport"` for elements further down: they
 * sit in their normal place when centred on screen and drift either side of it.
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input('appParallax') speed = 0;
  @Input() parallaxFrom: 'page' | 'viewport' = 'page';

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private frame = 0;
  private offset = 0;

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
    const element = this.el.nativeElement;

    if (this.parallaxFrom === 'viewport') {
      const rect = element.getBoundingClientRect();
      const centre = rect.top - this.offset + rect.height / 2;
      // Skip work while the element is well off screen
      if (centre < -window.innerHeight || centre > window.innerHeight * 2) return;

      this.offset = (centre - window.innerHeight / 2) * this.speed;
      element.style.transform = `translate3d(0, ${this.offset}px, 0)`;
      return;
    }

    // Stop moving once the element's original position has scrolled out of view,
    // so slow-moving elements don't drift down into later sections
    const bottom = element.getBoundingClientRect().bottom + window.scrollY - this.offset;
    const scroll = Math.min(window.scrollY, bottom);

    this.offset = -scroll * this.speed;
    element.style.transform = `translate3d(0, ${this.offset}px, 0)`;
  }
}

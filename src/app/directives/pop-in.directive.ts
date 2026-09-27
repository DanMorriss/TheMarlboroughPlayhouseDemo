import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Pops the element in the first time it scrolls into view.
 * `appPopIn` is an optional delay in ms, for staggering a group of elements.
 * The animation itself lives in styles.css (.pop-in / .pop-in--visible).
 */
@Directive({
  selector: '[appPopIn]',
  standalone: true,
})
export class PopInDirective implements OnInit, OnDestroy {
  @Input('appPopIn') delay: number | '' = 0;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit() {
    const element = this.el.nativeElement;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    element.classList.add('pop-in');
    element.style.animationDelay = `${this.delay || 0}ms`;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add('pop-in--visible');
        this.observer?.disconnect();
      },
      { threshold: 0.5 }
    );
    this.observer.observe(element);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}

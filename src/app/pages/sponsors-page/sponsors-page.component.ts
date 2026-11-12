import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SPONSORS, Sponsor } from '../../sponsors/sponsors';
import { SponsorDialogComponent } from '../../components/sponsor-dialog/sponsor-dialog.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { layoutBubbles } from './bubble-layout';

// Bubble sizes as a share of the largest, repeated so neighbours differ
const SIZE_PATTERN = [1, 0.75, 0.87, 1, 0.87, 0.75, 0.87];
// Largest bubble diameter on phones and from tablet width up
const MOBILE_MAX = 120;
const DESKTOP_MAX = 200;
const DESKTOP_WIDTH = 720;

@Component({
  selector: 'app-sponsors-page',
  standalone: true,
  imports: [NgOptimizedImage, NavbarComponent, SponsorDialogComponent],
  templateUrl: './sponsors-page.component.html',
  styleUrl: './sponsors-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorsPageComponent {
  readonly sponsors = SPONSORS;
  readonly selected = signal<Sponsor | null>(null);

  // Float timing per bubble; negative delay starts each one part-way through
  readonly floats = SPONSORS.map((_, i) => ({ duration: 6 + ((i * 7) % 5), delay: -((i * 1.7) % 6) }));

  private readonly width = signal(0);

  readonly layout = computed(() => {
    const width = this.width();
    if (!width) return null;
    const max = width >= DESKTOP_WIDTH ? DESKTOP_MAX : MOBILE_MAX;
    const specs = SPONSORS.map((sponsor, i) => ({
      size: Math.round(max * SIZE_PATTERN[i % SIZE_PATTERN.length]),
      group: sponsor.colour,
    }));
    return layoutBubbles(specs, width);
  });

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');

  constructor() {
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    // Lay out straight away, then re-pack whenever the space changes width
    afterNextRender(() => {
      const list = this.list().nativeElement;
      const update = (width: number) => {
        if (width !== this.width()) zone.run(() => this.width.set(width));
      };
      update(list.clientWidth);

      const observer = new ResizeObserver(([entry]) => update(Math.round(entry.contentRect.width)));
      observer.observe(list);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

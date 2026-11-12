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
  /** The bubble the open dialog grows out of and shrinks back into */
  readonly origin = signal<HTMLElement | null>(null);
  /** Sponsor whose bubble is re-forming after its dialog closed */
  readonly returning = signal<Sponsor | null>(null);

  // Angles (deg) of the streaks that spray out when a bubble pops; seven, evenly spaced
  readonly drops = Array.from({ length: 7 }, (_, i) => Math.round((360 / 7) * i));

  // Deeper versions of each logo's circle colour, so droplets show up on the page
  readonly burstColours: Record<string, string> = {
    peach: '#E8897A',
    green: '#6FAF96',
    yellow: '#E9BE5F',
    blue: '#5F8DB8',
    pink: '#E7A3B0',
    lavender: '#7B8FCC',
    taupe: '#9C8F7C',
  };

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

  open(sponsor: Sponsor, bubble: HTMLElement) {
    if (this.selected()) return;
    this.returning.set(null);
    this.origin.set(bubble);
    this.selected.set(sponsor);
  }

  // The dialog has shrunk back into the bubble, so re-form it
  onDialogClosed() {
    this.returning.set(this.selected());
    this.selected.set(null);
  }

  onBodyAnimationEnd(event: AnimationEvent, sponsor: Sponsor) {
    if (event.animationName.includes('sponsor-bubble-return') && this.returning() === sponsor) {
      this.returning.set(null);
    }
  }

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

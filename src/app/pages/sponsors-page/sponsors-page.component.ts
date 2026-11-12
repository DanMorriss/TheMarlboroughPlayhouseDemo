import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SPONSORS, Sponsor } from '../../sponsors/sponsors';
import { SponsorDialogComponent } from '../../components/sponsor-dialog/sponsor-dialog.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

// Repeating patterns so neighbouring bubbles differ in size and drift out of step
const SIZES = ['lg', 'sm', 'md', 'lg', 'md', 'sm', 'md'];
const OFFSETS = [0, 36, -12, 24, -24, 12, 40, -6];

interface Bubble {
  sponsor: Sponsor;
  size: string;
  offset: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-sponsors-page',
  standalone: true,
  imports: [NgOptimizedImage, NavbarComponent, SponsorDialogComponent],
  templateUrl: './sponsors-page.component.html',
  styleUrl: './sponsors-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorsPageComponent {
  readonly bubbles: Bubble[] = SPONSORS.map((sponsor, i) => ({
    sponsor,
    size: SIZES[i % SIZES.length],
    offset: OFFSETS[i % OFFSETS.length],
    duration: 6 + ((i * 7) % 5),
    // Negative delay starts each bubble part-way through its float
    delay: -((i * 1.7) % 6),
  }));

  readonly selected = signal<Sponsor | null>(null);
}

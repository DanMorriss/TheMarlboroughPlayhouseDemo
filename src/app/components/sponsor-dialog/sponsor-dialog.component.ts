import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, output, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Sponsor } from '../../sponsors/sponsors';

/**
 * Modal card with a sponsor's description and contact links. Uses a native
 * <dialog> so focus trapping, Escape to close and focus return come for free.
 */
@Component({
  selector: 'app-sponsor-dialog',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './sponsor-dialog.component.html',
  styleUrl: './sponsor-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorDialogComponent {
  readonly sponsor = input<Sponsor | null>(null);
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  // "+44" form for tel: links so they work from anywhere
  readonly phoneHref = computed(() => {
    const phone = this.sponsor()?.phone;
    return phone ? `tel:+44${phone.replace(/\s/g, '').replace(/^0/, '')}` : null;
  });

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.sponsor() && !dialog.open) {
        dialog.showModal();
      } else if (!this.sponsor() && dialog.open) {
        dialog.close();
      }
    });
  }

  close() {
    this.dialog().nativeElement.close();
  }

  // Clicks on the dialog element itself (not its contents) land on the backdrop
  onDialogClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.close();
  }
}

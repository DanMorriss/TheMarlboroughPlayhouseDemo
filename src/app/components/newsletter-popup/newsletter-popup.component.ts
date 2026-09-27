import { Component, ElementRef, OnDestroy, ViewChild, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConsentService } from '../../consent/consent.service';
import { NewsletterService } from '../../newsletter/newsletter.service';

// How long after the cookie banner is answered before the popup opens by itself
const AUTO_OPEN_DELAY_MS = 15000;

@Component({
  selector: 'app-newsletter-popup',
  standalone: true,
  templateUrl: './newsletter-popup.component.html',
  styleUrl: './newsletter-popup.component.css',
})
export class NewsletterPopupComponent implements OnDestroy {
  private readonly newsletter = inject(NewsletterService);
  private readonly consent = inject(ConsentService);
  private readonly router = inject(Router);

  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;

  readonly status = signal<'idle' | 'sending' | 'success' | 'error'>('idle');
  private autoOpenTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Show or hide the native dialog to match the service
    effect(() => {
      const dialog = this.dialog.nativeElement;
      if (this.newsletter.popupOpen() && !dialog.open) {
        if (!this.newsletter.hasSubscribed()) this.status.set('idle');
        dialog.showModal();
      } else if (!this.newsletter.popupOpen() && dialog.open) {
        dialog.close();
      }
    }, { allowSignalWrites: true });

    // Open once by itself, a while after the cookie banner has been answered
    effect(() => {
      clearTimeout(this.autoOpenTimer);
      if (this.consent.bannerOpen() || !this.newsletter.shouldAutoOpen()) return;
      this.autoOpenTimer = setTimeout(() => {
        // Don't interrupt someone in the middle of booking an event
        if (!this.router.url.startsWith('/events/') && !this.consent.bannerOpen()) {
          this.newsletter.open();
        }
      }, AUTO_OPEN_DELAY_MS);
    });
  }

  ngOnDestroy() {
    clearTimeout(this.autoOpenTimer);
  }

  /** Fired by the dialog when closed any way (Escape, close button, "No thanks"). */
  onClosed() {
    if (this.newsletter.popupOpen()) this.newsletter.dismiss();
  }

  close() {
    this.newsletter.dismiss();
  }

  /** Clicking the dimmed area outside the popup closes it. */
  onBackdropClick(event: MouseEvent) {
    if (event.target === this.dialog.nativeElement) this.close();
  }

  async submit(event: Event, email: string) {
    event.preventDefault();
    this.status.set('sending');
    try {
      await this.newsletter.subscribe(email.trim());
      this.status.set('success');
    } catch {
      this.status.set('error');
    }
  }
}

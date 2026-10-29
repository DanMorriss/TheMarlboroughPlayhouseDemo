import { Component, ElementRef, OnDestroy, ViewChild, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConsentService } from '../../consent/consent.service';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { NewsletterFormComponent } from '../newsletter-form/newsletter-form.component';

// How long after the cookie banner is answered before the popup opens by itself
const AUTO_OPEN_DELAY_MS = 15000;

@Component({
  selector: 'app-newsletter-popup',
  standalone: true,
  imports: [NewsletterFormComponent],
  templateUrl: './newsletter-popup.component.html',
  styleUrl: './newsletter-popup.component.css',
})
export class NewsletterPopupComponent implements OnDestroy {
  private readonly newsletter = inject(NewsletterService);
  private readonly consent = inject(ConsentService);
  private readonly router = inject(Router);

  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;

  readonly subscribed = signal(false);
  private autoOpenTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Show or hide the native dialog to match the service
    effect(() => {
      const dialog = this.dialog.nativeElement;
      if (this.newsletter.popupOpen() && !dialog.open) {
        // Always open on a fresh form, so people can sign up again or with another email
        this.signUpAgain();
        dialog.showModal();
      } else if (!this.newsletter.popupOpen() && dialog.open) {
        dialog.close();
      }
    }, { allowSignalWrites: true });

    // Open once by itself, a while after cookies are accepted. Visitors who reject
    // cookies aren't prompted, but can still sign up from the footer link.
    effect(() => {
      clearTimeout(this.autoOpenTimer);
      if (this.consent.consent() !== 'accepted' || this.consent.bannerOpen() || !this.newsletter.shouldAutoOpen()) {
        return;
      }
      this.autoOpenTimer = setTimeout(() => {
        // Don't interrupt someone in the middle of booking an event, or repeat the
        // mailing list page's own form
        const url = this.router.url;
        if (!url.startsWith('/events/') && !url.startsWith('/mailing-list') && !this.consent.bannerOpen()) {
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

  /** Back to an empty sign-up form (the email field is new each time it's shown). */
  signUpAgain() {
    this.subscribed.set(false);
  }

  /** Clicking the dimmed area outside the popup closes it. */
  onBackdropClick(event: MouseEvent) {
    if (event.target === this.dialog.nativeElement) this.close();
  }
}

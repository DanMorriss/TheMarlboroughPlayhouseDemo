import { ChangeDetectionStrategy, Component, ElementRef, effect, signal, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsletterFormComponent } from '../../components/newsletter-form/newsletter-form.component';

/**
 * Mailing list sign-up page to share on social media. Only reached by direct link,
 * so it isn't in the nav.
 */
@Component({
  selector: 'app-mailing-list-page',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, NewsletterFormComponent],
  templateUrl: './mailing-list-page.component.html',
  styleUrl: './mailing-list-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailingListPageComponent {
  readonly subscribed = signal(false);

  private readonly thanksHeading = viewChild<ElementRef<HTMLElement>>('thanksHeading');

  constructor() {
    // The form disappears once signed up, so move focus to the thank-you message
    effect(() => this.thanksHeading()?.nativeElement.focus());
  }
}

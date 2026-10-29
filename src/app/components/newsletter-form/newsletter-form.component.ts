import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { NewsletterService } from '../../newsletter/newsletter.service';

/** Email field and button for joining the mailing list. Used by the popup and the mailing list page. */
@Component({
  selector: 'app-newsletter-form',
  standalone: true,
  templateUrl: './newsletter-form.component.html',
  styleUrl: './newsletter-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterFormComponent {
  private readonly newsletter = inject(NewsletterService);

  /** Keeps ids unique if more than one form is on screen. */
  readonly inputId = input('newsletter-email');
  readonly subscribed = output<void>();

  readonly status = signal<'idle' | 'sending' | 'error'>('idle');

  async submit(event: Event, email: string) {
    event.preventDefault();
    this.status.set('sending');
    try {
      await this.newsletter.subscribe(email.trim());
      this.status.set('idle');
      this.subscribed.emit();
    } catch {
      this.status.set('error');
    }
  }
}

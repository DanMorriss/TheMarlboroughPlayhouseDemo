import { Injectable, signal } from '@angular/core';

// The MailerLite embedded form's submit address. Posting to it directly (it allows
// requests from any site) means the sign-up works without MailerLite's scripts or cookies.
const MAILERLITE_FORM_URL = 'https://assets.mailerlite.com/jsonp/1677758/forms/160425041031333415/subscribe';

const STORAGE_KEY = 'tmph-newsletter';
type NewsletterState = 'dismissed' | 'subscribed';

/** Mailing list sign-up: whether the popup is open, and sending the email to MailerLite. */
@Injectable({ providedIn: 'root' })
export class NewsletterService {
  readonly popupOpen = signal(false);

  open() {
    this.popupOpen.set(true);
  }

  /** Closed without signing up: don't open automatically again. */
  dismiss() {
    this.popupOpen.set(false);
    if (!this.hasSubscribed()) this.remember('dismissed');
  }

  /** Whether the popup may open by itself (visitor hasn't signed up or said no thanks). */
  shouldAutoOpen(): boolean {
    return this.stored() === null;
  }

  hasSubscribed(): boolean {
    return this.stored() === 'subscribed';
  }

  async subscribe(email: string): Promise<void> {
    const body = new URLSearchParams({ 'fields[email]': email, 'ml-submit': '1', anticsrf: 'true' });
    const response = await fetch(MAILERLITE_FORM_URL, { method: 'POST', body });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success === false) {
      throw new Error('Sign-up failed');
    }
    this.remember('subscribed');
  }

  private stored(): NewsletterState | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'dismissed' || value === 'subscribed' ? value : null;
    } catch {
      return null;
    }
  }

  private remember(state: NewsletterState) {
    try {
      localStorage.setItem(STORAGE_KEY, state);
    } catch {
      // Storage unavailable: the popup may show again next visit
    }
  }
}

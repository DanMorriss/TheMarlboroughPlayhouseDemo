import { Injectable, signal } from '@angular/core';

export type Consent = 'accepted' | 'rejected';

const STORAGE_KEY = 'tmph-cookie-consent';
const MAILERLITE_ACCOUNT = '1677758';

/**
 * Remembers whether the visitor accepted optional cookies, and only loads
 * MailerLite's tracking script (which stores a visitor id) once they have.
 * Storing the choice itself is allowed without consent.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  readonly consent = signal<Consent | null>(readStoredConsent());
  readonly bannerOpen = signal(this.consent() === null);

  private mailerLiteLoaded = false;

  constructor() {
    if (this.consent() === 'accepted') this.loadMailerLite();
  }

  accept() {
    this.save('accepted');
    this.loadMailerLite();
  }

  reject() {
    const hadAccepted = this.consent() === 'accepted';
    this.save('rejected');
    if (hadAccepted) {
      // Remove what MailerLite stored, then reload so its script is no longer running
      clearMailerLiteStorage();
      window.location.reload();
    }
  }

  /** Re-open the banner so the visitor can change their choice (footer link). */
  openSettings() {
    this.bannerOpen.set(true);
  }

  private save(consent: Consent) {
    this.consent.set(consent);
    this.bannerOpen.set(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ consent, date: new Date().toISOString() }));
    } catch {
      // Storage unavailable (e.g. private browsing): the choice lasts for this visit only
    }
  }

  private loadMailerLite() {
    if (this.mailerLiteLoaded) return;
    this.mailerLiteLoaded = true;

    // MailerLite's standard "Universal" snippet
    const w = window as unknown as { ml?: { (...args: unknown[]): void; q?: unknown[][] } };
    w.ml =
      w.ml ??
      Object.assign((...args: unknown[]) => (w.ml!.q = w.ml!.q ?? []).push(args), { q: [] as unknown[][] });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://assets.mailerlite.com/js/universal.js';
    document.head.appendChild(script);
    w.ml('account', MAILERLITE_ACCOUNT);
  }
}

function readStoredConsent(): Consent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return stored?.consent === 'accepted' || stored?.consent === 'rejected' ? stored.consent : null;
  } catch {
    return null;
  }
}

function clearMailerLiteStorage() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('ml_'))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Nothing to clear
  }
}

import { Injectable } from '@angular/core';

/** An event as returned by our /api/events function (see api/events.ts). */
export interface SiteEvent {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  details: string;
  spacesLeft: number | null;
  waitingList: boolean;
  imageUrl: string | null;
  tickets: { title: string; pricePence: number; available: boolean }[];
}

export class EventsError extends Error {
  constructor(readonly status: number) {
    super(`Events request failed with status ${status}`);
  }
}

const BOOKWHEN_ACCOUNT = 'https://bookwhen.com/themarlboroughplayhouse';
const EVENT_ID_PATTERN = /^ev-[a-z0-9-]+$/i;

@Injectable({ providedIn: 'root' })
export class EventsService {
  list(): Promise<SiteEvent[]> {
    return this.request('/api/events');
  }

  get(id: string): Promise<SiteEvent> {
    if (!isValidEventId(id)) return Promise.reject(new EventsError(404));
    return this.request(`/api/events?id=${encodeURIComponent(id)}`);
  }

  private async request<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) throw new EventsError(response.status);
    return response.json();
  }
}

export function isValidEventId(id: string): boolean {
  return EVENT_ID_PATTERN.test(id);
}

/** Bookwhen's embeddable booking page for a single event. Only call with a validated id. */
export function bookwhenIframeUrl(id: string): string {
  return `${BOOKWHEN_ACCOUNT}/iframe/e/${encodeURIComponent(id)}`;
}

/** Bookwhen's normal (non-embedded) page for a single event, or the whole schedule. */
export function bookwhenPageUrl(id?: string): string {
  return id ? `${BOOKWHEN_ACCOUNT}/e/${encodeURIComponent(id)}` : BOOKWHEN_ACCOUNT;
}

// Display helpers. Times are always shown in UK time, whatever the visitor's timezone.

const LONDON = { timeZone: 'Europe/London' } as const;

export function dayOfMonth(event: SiteEvent): string {
  return new Intl.DateTimeFormat('en-GB', { ...LONDON, day: 'numeric' }).format(new Date(event.startAt));
}

export function shortMonth(event: SiteEvent): string {
  return new Intl.DateTimeFormat('en-GB', { ...LONDON, month: 'short' }).format(new Date(event.startAt));
}

export function fullDate(event: SiteEvent): string {
  return new Intl.DateTimeFormat('en-GB', { ...LONDON, weekday: 'long', day: 'numeric', month: 'long' }).format(
    new Date(event.startAt),
  );
}

export function timeRange(event: SiteEvent): string {
  if (event.allDay) return 'All day';
  const format = (iso: string) =>
    new Intl.DateTimeFormat('en-GB', { ...LONDON, hour: 'numeric', minute: '2-digit', hour12: true })
      .format(new Date(iso))
      .replace(':00', '')
      .replace(' ', '');
  return `${format(event.startAt)} - ${format(event.endAt)}`;
}

export function priceLabel(event: SiteEvent): string | null {
  const prices = event.tickets.map((t) => t.pricePence);
  if (!prices.length) return null;
  const lowest = Math.min(...prices);
  if (lowest === 0 && Math.max(...prices) === 0) return 'Free';
  const formatted = formatPounds(lowest);
  return new Set(prices).size > 1 ? `From ${formatted}` : formatted;
}

export function spacesLabel(event: SiteEvent): string | null {
  if (event.spacesLeft === null) return null;
  if (event.spacesLeft === 0) return 'Fully booked';
  return event.spacesLeft === 1 ? '1 space left' : `${event.spacesLeft} spaces left`;
}

export function isFullyBooked(event: SiteEvent): boolean {
  return event.spacesLeft === 0;
}

/** Splits Bookwhen's plain-text details into paragraphs (blank-line separated). */
export function paragraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function formatPounds(pence: number): string {
  const pounds = pence / 100;
  return `£${Number.isInteger(pounds) ? pounds : pounds.toFixed(2)}`;
}

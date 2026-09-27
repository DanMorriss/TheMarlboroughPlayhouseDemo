import { Component, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  EventsError,
  EventsService,
  SiteEvent,
  bookwhenIframeUrl,
  bookwhenPageUrl,
  fullDate,
  isFullyBooked,
  isValidEventId,
  paragraphs,
  priceLabel,
  spacesLabel,
  timeRange,
} from '../../events/events.service';

/** One event's details, with that event's Bookwhen booking form embedded below. */
@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.css',
})
export class EventPageComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly title = inject(Title);

  readonly event = signal<SiteEvent | null>(null);
  readonly status = signal<'loading' | 'ready' | 'not-found' | 'error'>('loading');
  readonly bookingFrameUrl = signal<SafeResourceUrl | null>(null);
  readonly bookwhenUrl = signal(bookwhenPageUrl());

  readonly fullDate = fullDate;
  readonly timeRange = timeRange;
  readonly priceLabel = priceLabel;
  readonly spacesLabel = spacesLabel;
  readonly isFullyBooked = isFullyBooked;
  readonly paragraphs = paragraphs;

  ngOnInit() {
    void this.load(this.route.snapshot.paramMap.get('id') ?? '');
  }

  private async load(id: string) {
    if (!isValidEventId(id)) {
      this.status.set('not-found');
      return;
    }

    // The id has been validated above, so it's safe to use in the iframe URL
    this.bookingFrameUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(bookwhenIframeUrl(id)));
    this.bookwhenUrl.set(bookwhenPageUrl(id));

    try {
      const event = await this.eventsService.get(id);
      this.event.set(event);
      this.title.setTitle(`${event.title} - The Marlborough Playhouse`);
      this.status.set('ready');
    } catch (error) {
      this.status.set(error instanceof EventsError && error.status === 404 ? 'not-found' : 'error');
    }
  }
}

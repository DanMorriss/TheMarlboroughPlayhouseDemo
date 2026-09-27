import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PopInDirective } from '../../directives/pop-in.directive';
import {
  EventsService,
  SiteEvent,
  bookwhenPageUrl,
  dayOfMonth,
  fullDate,
  isFullyBooked,
  paragraphs,
  priceLabel,
  shortMonth,
  spacesLabel,
  timeRange,
} from '../../events/events.service';

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [NavbarComponent, RouterLink, PopInDirective],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.css',
})
export class EventsPageComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  readonly events = signal<SiteEvent[]>([]);
  readonly status = signal<'loading' | 'ready' | 'error'>('loading');
  readonly bookwhenUrl = bookwhenPageUrl();

  // Display helpers for the template
  readonly dayOfMonth = dayOfMonth;
  readonly shortMonth = shortMonth;
  readonly fullDate = fullDate;
  readonly timeRange = timeRange;
  readonly priceLabel = priceLabel;
  readonly spacesLabel = spacesLabel;
  readonly isFullyBooked = isFullyBooked;

  ngOnInit() {
    void this.load();
  }

  summary(event: SiteEvent): string {
    return paragraphs(event.details)[0] ?? '';
  }

  private async load() {
    try {
      this.events.set(await this.eventsService.list());
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }
}

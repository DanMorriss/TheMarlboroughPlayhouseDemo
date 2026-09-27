/**
 * Vercel serverless function: GET /api/events and GET /api/events?id=<event id>
 *
 * Fetches events from the Bookwhen API server-side so the API token (the
 * BOOKWHEN_API_TOKEN environment variable) never reaches the browser, and
 * returns only the fields the site displays.
 */

const BOOKWHEN_API = 'https://api.bookwhen.com/v2';
const EVENT_ID_PATTERN = /^ev-[a-z0-9-]+$/i;

interface BookwhenTicket {
  id: string;
  type: 'ticket';
  attributes: {
    title: string;
    available: boolean;
    cost: { net: number } | null;
  };
}

interface BookwhenEvent {
  id: string;
  attributes: {
    title: string;
    start_at: string;
    end_at: string;
    all_day: boolean;
    cancelled_at: string | null;
    details: string | null;
    attendee_limit: number | null;
    attendee_count: number;
    waiting_list: boolean;
    event_image: { image_url?: string } | null;
  };
  relationships?: { tickets?: { data: { id: string }[] } };
}

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

export async function GET(request: Request): Promise<Response> {
  const token = process.env['BOOKWHEN_API_TOKEN'];
  if (!token) {
    return json({ error: 'Events are not configured' }, 500);
  }

  const id = new URL(request.url).searchParams.get('id');
  if (id !== null && !EVENT_ID_PATTERN.test(id)) {
    return json({ error: 'Invalid event id' }, 400);
  }

  const path = id ? `/events/${encodeURIComponent(id)}` : '/events';
  const upstream = await fetch(`${BOOKWHEN_API}${path}?include=tickets`, {
    headers: { Authorization: `Basic ${btoa(`${token}:`)}` },
  });

  if (upstream.status === 404) {
    return json({ error: 'Event not found' }, 404);
  }
  if (!upstream.ok) {
    // Don't pass Bookwhen's error details on to the browser
    return json({ error: 'Could not load events' }, 502);
  }

  const body = (await upstream.json()) as {
    data: BookwhenEvent | BookwhenEvent[];
    included?: BookwhenTicket[];
  };
  const tickets = new Map((body.included ?? []).filter((i) => i.type === 'ticket').map((t) => [t.id, t]));

  const events = (Array.isArray(body.data) ? body.data : [body.data])
    .filter((event) => !event.attributes.cancelled_at)
    .map((event) => toSiteEvent(event, tickets));

  if (id) {
    return events.length ? json(events[0]) : json({ error: 'Event not found' }, 404);
  }
  return json(events.sort((a, b) => a.startAt.localeCompare(b.startAt)));
}

function toSiteEvent(event: BookwhenEvent, tickets: Map<string, BookwhenTicket>): SiteEvent {
  const a = event.attributes;
  return {
    id: event.id,
    title: a.title,
    startAt: a.start_at,
    endAt: a.end_at,
    allDay: a.all_day,
    details: a.details ?? '',
    spacesLeft: a.attendee_limit === null ? null : Math.max(a.attendee_limit - a.attendee_count, 0),
    waitingList: a.waiting_list,
    imageUrl: a.event_image?.image_url ?? null,
    tickets: (event.relationships?.tickets?.data ?? [])
      .map((ref) => tickets.get(ref.id))
      .filter((t): t is BookwhenTicket => !!t)
      .map((t) => ({
        title: t.attributes.title,
        pricePence: t.attributes.cost?.net ?? 0,
        available: t.attributes.available,
      })),
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      // Cache successful responses on Vercel's CDN for 5 minutes, then refresh in the background
      'Cache-Control': status === 200 ? 's-maxage=300, stale-while-revalidate=3600' : 'no-store',
    },
  });
}

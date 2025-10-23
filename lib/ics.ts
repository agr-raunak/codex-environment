export type CalendarEvent = {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
};

const ICS_HEADER = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AI Mentor//EN'];
const ICS_FOOTER = ['END:VCALENDAR'];

function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function createUid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `event-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildICS(event: CalendarEvent): string {
  const lines = [
    ...ICS_HEADER,
    'BEGIN:VEVENT',
    `UID:${createUid()}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(event.start)}`,
    `DTEND:${formatDate(event.end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    event.location ? `LOCATION:${event.location}` : null,
    'END:VEVENT',
    ...ICS_FOOTER
  ].filter((line): line is string => Boolean(line));

  return lines.join('\r\n');
}

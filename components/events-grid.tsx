'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { buildICS } from '@/lib/ics';
import { useAnalytics } from '@/hooks/use-analytics';

const events = [
  {
    title: 'Kickoff: Roadmap shaping',
    description: 'Live planning session with mentors walking through the intake rubric.',
    type: 'webinar',
    start: new Date('2025-10-01T10:00:00Z'),
    end: new Date('2025-10-01T11:00:00Z')
  },
  {
    title: 'Build lab: Accessibility in action',
    description: 'Peer working session with live audits and pair design critiques.',
    type: 'workshop',
    start: new Date('2025-10-08T17:00:00Z'),
    end: new Date('2025-10-08T18:30:00Z')
  },
  {
    title: 'Lightning demos: Automation catalysts',
    description: 'Showcase automation wins from across the community with live Q&A.',
    type: 'demo',
    start: new Date('2025-10-15T16:00:00Z'),
    end: new Date('2025-10-15T17:00:00Z')
  },
  {
    title: 'Retro: Project pod lessons learned',
    description: 'Reflect on experiments, share blockers, and pick next sprint goals.',
    type: 'retro',
    start: new Date('2025-10-22T15:00:00Z'),
    end: new Date('2025-10-22T16:00:00Z')
  }
] as const;

type EventType = (typeof events)[number]['type'];

const filters: Array<{ label: string; value: EventType | 'all' }> = [
  { label: 'All events', value: 'all' },
  { label: 'Webinars', value: 'webinar' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Demos', value: 'demo' },
  { label: 'Retros', value: 'retro' }
];

export function EventsGrid() {
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const { track } = useAnalytics();

  const filteredEvents = useMemo(() => {
    if (selectedType === 'all') return events;
    return events.filter((event) => event.type === selectedType);
  }, [selectedType]);

  const handleIcsDownload = (event: (typeof events)[number]) => {
    const ics = buildICS({
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end
    });

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    track('event_ics', { title: event.title });
  };

  return (
    <section id="events" className="border-t py-16 sm:py-20" aria-labelledby="events-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <h2 id="events-heading" className="text-3xl font-semibold sm:text-4xl">
            Events that reinforce every milestone
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Join live sessions or catch recordings to stay aligned with your pod and the broader AI Mentor community.
          </p>
        </div>
        <div className="mb-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Filter events">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              variant={filter.value === selectedType ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setSelectedType(filter.value)}
              aria-pressed={filter.value === selectedType}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <Card key={event.title} className="h-full">
              <CardHeader>
                <Badge variant="secondary" className="w-fit capitalize">
                  {event.type}
                </Badge>
                <CardTitle className="mt-3 text-xl">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <p className="text-muted-foreground">
                  {format(event.start, 'PPpp')} · {format(event.end, 'pp')}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => handleIcsDownload(event)}
                  data-event="event_ics"
                >
                  Add to calendar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

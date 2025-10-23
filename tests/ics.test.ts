import { describe, expect, it, beforeAll } from 'vitest';
import { buildICS } from '@/lib/ics';

describe('buildICS', () => {
  beforeAll(() => {
    if (!globalThis.crypto || !('randomUUID' in globalThis.crypto)) {
      // @ts-expect-error - provide minimal crypto polyfill
      globalThis.crypto = {
        randomUUID: () => 'test-uuid'
      };
    }
  });

  it('creates an ICS file with VEVENT markers and timestamps', () => {
    const start = new Date('2025-10-01T10:00:00Z');
    const end = new Date('2025-10-01T11:00:00Z');
    const ics = buildICS({
      title: 'Roadmap kickoff',
      description: 'Plan the semester roadmap',
      start,
      end
    });

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Roadmap kickoff');
    expect(ics).toContain('DTSTART:20251001T100000Z');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });
});

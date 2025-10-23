import { describe, expect, it } from 'vitest';
import { UserIntake } from '@/schemas/intake';

describe('UserIntake schema', () => {
  const validPayload = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    current_level: 'intermediate' as const,
    goal: 'I want to build a production-ready SaaS dashboard.',
    time_per_week_hours: 10,
    deadline_weeks: 8
  };

  it('accepts valid payloads', () => {
    const result = UserIntake.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('rejects invalid payloads', () => {
    const result = UserIntake.safeParse({ ...validPayload, email: 'invalid', time_per_week_hours: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
      expect(result.error.flatten().fieldErrors.time_per_week_hours).toBeDefined();
    }
  });
});

import { z } from 'zod';

export const UserIntake = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Enter a valid email address.'),
  current_level: z.enum(['beginner', 'intermediate', 'advanced']),
  goal: z.string().min(10, 'Tell us more about your goal (10+ characters).'),
  time_per_week_hours: z.number().int().min(1).max(60),
  deadline_weeks: z.number().int().min(2).max(52),
});

export type UserIntake = z.infer<typeof UserIntake>;

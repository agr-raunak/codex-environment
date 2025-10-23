import { z } from 'zod';

export const ResourceSchema = z.object({
  title: z.string(),
  type: z.enum(['course', 'article', 'video', 'tool']),
  url: z.string().url()
});

export const WeekSchema = z.object({
  week: z.number().int().min(1),
  focus: z.string(),
  resources: z.array(ResourceSchema).min(1),
  project: z.object({
    title: z.string(),
    brief: z.string()
  })
});

export const RoadmapSchema = z.object({
  summary: z.string(),
  weeks: z.array(WeekSchema).min(1)
});

export type Roadmap = z.infer<typeof RoadmapSchema>;

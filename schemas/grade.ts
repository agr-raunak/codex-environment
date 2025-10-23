import { z } from 'zod';

export const AIGradeSchema = z.object({
  score_numeric: z.number().min(0).max(100),
  grade_letter: z.enum(['A', 'B', 'C', 'D']),
  dimensions: z.object({
    correctness: z.number(),
    code_quality: z.number(),
    readme_clarity: z.number(),
    reproducibility: z.number(),
    impact: z.number()
  }),
  feedback: z.string(),
  improvements: z.array(z.string())
});

export type AIGrade = z.infer<typeof AIGradeSchema>;

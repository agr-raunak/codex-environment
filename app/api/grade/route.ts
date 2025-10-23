import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AIGradeSchema, type AIGrade } from '@/schemas/grade';
import { buildLocalGrade } from '@/lib/grade-local';

const GradeRequestSchema = z
  .object({
    repoUrl: z.string().url().optional(),
    zippedProjectBase64: z.string().min(1).optional()
  })
  .refine((value) => Boolean(value.repoUrl || value.zippedProjectBase64), {
    message: 'Provide repoUrl or zippedProjectBase64',
    path: ['repoUrl']
  });

async function callOpenAiGrade(payload: z.infer<typeof GradeRequestSchema>): Promise<AIGrade> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const instructions =
    'Return a JSON grade with score_numeric (0-100), grade_letter (A-D), dimensions (correctness, code_quality, readme_clarity, reproducibility, impact), feedback, and improvements array.';

  const userPrompt = payload.repoUrl
    ? `Evaluate the project at ${payload.repoUrl}.`
    : 'Evaluate the provided zipped project contents.';

  const body = {
    model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: instructions },
      { role: 'user', content: userPrompt }
    ]
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('OpenAI request failed');
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned empty content');
  }

  const parsed = JSON.parse(content);
  const grade = AIGradeSchema.parse(parsed);
  const total = Object.values(grade.dimensions).reduce((acc, value) => acc + value, 0);
  return { ...grade, score_numeric: Math.min(Math.max(total, 0), 100) };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = GradeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
    }

    const payload = parsed.data;

    if (!process.env.OPENAI_API_KEY) {
      const repo = payload.repoUrl ?? 'local';
      const grade = buildLocalGrade(repo);
      return NextResponse.json({ grade, provider: 'local' });
    }

    try {
      const grade = await callOpenAiGrade(payload);
      return NextResponse.json({ grade, provider: 'openai' });
    } catch (error) {
      const repo = payload.repoUrl ?? 'local';
      const grade = buildLocalGrade(repo);
      return NextResponse.json({ grade, provider: 'local_fallback' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

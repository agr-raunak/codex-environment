import { NextResponse } from 'next/server';
import { z } from 'zod';
import { UserIntake } from '@/schemas/intake';
import { RoadmapSchema, type Roadmap } from '@/schemas/roadmap';
import { buildLocalRoadmap } from '@/lib/roadmap-local';

const openAiRoadmapSchema = RoadmapSchema;

async function callOpenAiRoadmap(intake: z.infer<typeof UserIntake>): Promise<Roadmap> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  const messages = [
    {
      role: 'system',
      content:
        'You generate structured JSON roadmaps with a summary and four weeks of focus. Respond with valid JSON following the provided schema.'
    },
    {
      role: 'user',
      content: `Create a four-week learning roadmap for ${intake.name} who is a ${intake.current_level} learner aiming to ${intake.goal}. They can dedicate ${intake.time_per_week_hours} hours per week and have ${intake.deadline_weeks} weeks.`
    }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      messages,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI request failed');
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned empty content');
  }

  const parsed = JSON.parse(content);
  return openAiRoadmapSchema.parse(parsed);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const intakeResult = UserIntake.safeParse(body);
    if (!intakeResult.success) {
      return NextResponse.json({ errors: intakeResult.error.flatten() }, { status: 422 });
    }

    const intake = intakeResult.data;

    if (!process.env.OPENAI_API_KEY) {
      const roadmap = buildLocalRoadmap(intake);
      return NextResponse.json({ roadmap, provider: 'local' });
    }

    try {
      const roadmap = await callOpenAiRoadmap(intake);
      return NextResponse.json({ roadmap, provider: 'openai' });
    } catch (error) {
      const fallback = buildLocalRoadmap(intake);
      return NextResponse.json({ roadmap: fallback, provider: 'local_fallback' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

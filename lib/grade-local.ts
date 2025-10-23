import type { AIGrade } from '@/schemas/grade';
import { hashString } from './hash';

const DIMENSIONS = [
  { key: 'correctness', min: 20, max: 30 },
  { key: 'code_quality', min: 12, max: 20 },
  { key: 'readme_clarity', min: 12, max: 20 },
  { key: 'reproducibility', min: 8, max: 15 },
  { key: 'impact', min: 8, max: 15 }
] as const;

type DimensionKey = (typeof DIMENSIONS)[number]['key'];

const improvementBuckets: Record<AIGrade['grade_letter'], string[]> = {
  A: [
    'Challenge yourself with a stretch goal to extend the project scope.',
    'Document the architectural decisions in a short ADR log.'
  ],
  B: [
    'Tighten up error states and add automated tests for critical paths.',
    'Clarify setup instructions so a new reviewer can onboard quickly.',
    'Share a demo video to gather asynchronous feedback.'
  ],
  C: [
    'Refactor areas with duplicate logic before shipping updates.',
    'Address reported issues from manual QA before requesting review.',
    'Strengthen the README with architecture and testing notes.'
  ],
  D: [
    'Start with a scoped checklist and ensure the happy path succeeds.',
    'Pair with a mentor to review fundamentals before resubmitting.',
    'Create a minimal reproducible example to isolate key bugs.'
  ]
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function scoreToLetter(score: number): AIGrade['grade_letter'] {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  return 'D';
}

export function buildLocalGrade(repoUrl: string): AIGrade {
  const baseHash = hashString(repoUrl || 'local');

  const dimensions = DIMENSIONS.reduce<AIGrade['dimensions']>((acc, dimension, index) => {
    const value = dimension.min + (baseHash >> (index * 5)) % (dimension.max - dimension.min + 1);
    acc[dimension.key as DimensionKey] = clamp(value, dimension.min, dimension.max);
    return acc;
  }, {} as AIGrade['dimensions']);

  const score = clamp(
    Object.values(dimensions).reduce((total, dimensionScore) => total + dimensionScore, 0),
    0,
    100
  );

  const grade_letter = scoreToLetter(score);
  const improvementsSource = improvementBuckets[grade_letter];
  const improvements = improvementsSource.slice(0, grade_letter === 'A' ? 2 : 3);

  return {
    score_numeric: score,
    grade_letter,
    dimensions,
    feedback:
      grade_letter === 'A'
        ? 'Outstanding work! Focus on sharing knowledge and mentoring others.'
        : 'Review the rubric feedback below and tackle the improvements one by one.',
    improvements
  };
}

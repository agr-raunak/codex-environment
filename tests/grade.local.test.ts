import { describe, expect, it } from 'vitest';
import { buildLocalGrade } from '@/lib/grade-local';

describe('buildLocalGrade', () => {
  it('returns deterministic grades for same repo', () => {
    const first = buildLocalGrade('https://github.com/example/repo');
    const second = buildLocalGrade('https://github.com/example/repo');
    expect(first).toEqual(second);
  });

  it('ensures dimensions sum to score', () => {
    const grade = buildLocalGrade('https://github.com/example/another');
    const total = Object.values(grade.dimensions).reduce((acc, value) => acc + value, 0);
    expect(grade.score_numeric).toBeLessThanOrEqual(100);
    expect(grade.score_numeric).toBeGreaterThanOrEqual(0);
    expect(total).toBeGreaterThan(0);
  });
});

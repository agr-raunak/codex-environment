'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Roadmap } from '@/schemas/roadmap';
import type { AIGrade } from '@/schemas/grade';
import { buildLocalGrade } from '@/lib/grade-local';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';

const gradeColors: Record<AIGrade['grade_letter'], string> = {
  A: 'bg-emerald-500 text-white',
  B: 'bg-sky-500 text-white',
  C: 'bg-amber-500 text-white',
  D: 'bg-rose-500 text-white'
};

type RoadmapPanelProps = {
  roadmap?: Roadmap;
  provider?: string;
  isLoading?: boolean;
};

type GradeResponse = {
  grade: AIGrade;
  provider: string;
};

export function RoadmapPanel({ roadmap, provider, isLoading }: RoadmapPanelProps) {
  const [repoUrl, setRepoUrl] = useState('https://github.com/student/example-repo');
  const [grade, setGrade] = useState<AIGrade | null>(null);
  const [gradeProvider, setGradeProvider] = useState<string>('');
  const [isGrading, setIsGrading] = useState(false);

  const handleGrade = async () => {
    if (!repoUrl) {
      toast.error('Add a repository URL before requesting a grade.');
      return;
    }

    setIsGrading(true);
    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl })
      });

      if (!response.ok) {
        if (response.status === 422) {
          toast.error('Enter a valid repository URL or upload a project archive.');
          return;
        }
        throw new Error('Request failed');
      }

      const payload: GradeResponse = await response.json();
      setGrade(payload.grade);
      setGradeProvider(payload.provider);
    } catch (error) {
      const fallback = buildLocalGrade(repoUrl);
      setGrade(fallback);
      setGradeProvider('local_fallback');
      toast.warning('Using local rubric grader while the AI service is unavailable.');
    } finally {
      setIsGrading(false);
    }
  };

  const jsonGrade = useMemo(() => (grade ? JSON.stringify(grade, null, 2) : ''), [grade]);

  return (
    <section className="border-t bg-muted/20 py-16 sm:py-20" aria-labelledby="roadmap-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3">
          <h2 id="roadmap-heading" className="text-3xl font-semibold sm:text-4xl">
            Roadmap preview
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Review your personalized roadmap. Share it with your mentor or request an AI grade once you ship the project.
          </p>
          {provider ? <p className="text-sm text-muted-foreground">Generated via <span className="font-medium">{provider}</span>.</p> : null}
        </div>
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : null}
        {!isLoading && roadmap ? (
          <div className="space-y-8">
            <p className="text-lg font-medium">{roadmap.summary}</p>
            <div className="space-y-6">
              {roadmap.weeks.map((week) => (
                <div key={week.week} className="rounded-lg border bg-background p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold">Week {week.week}: {week.focus}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project brief</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{week.project.brief}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Featured resources</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                      {week.resources.map((resource) => (
                        <li key={resource.url} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary" />
                          <a
                            href={resource.url}
                            className="text-primary underline-offset-4 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {resource.title} · {resource.type}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-12 space-y-4">
          <h3 className="text-2xl font-semibold">Request an AI grade</h3>
          <p className="text-sm text-muted-foreground">
            Paste a repository URL (public or internal mirror) to receive rubric-aligned feedback. We’ll fallback to the local grader if providers are offline.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/username/repo"
              aria-label="Repository URL"
            />
            <Button type="button" onClick={handleGrade} disabled={isGrading} data-event="request_grade">
              {isGrading ? 'Grading…' : 'Get AI grade'}
            </Button>
          </div>
          {grade ? (
            <div className="space-y-3 rounded-lg border bg-background p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex h-10 items-center rounded-md px-4 text-lg font-semibold ${gradeColors[grade.grade_letter]}`}>
                  {grade.grade_letter}
                </span>
                <p className="text-sm text-muted-foreground">
                  Provider: <span className="font-medium">{gradeProvider || 'local'}</span> · Score {grade.score_numeric}/100
                </p>
              </div>
              <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs" aria-live="polite">
                {jsonGrade}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

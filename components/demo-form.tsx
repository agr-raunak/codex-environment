'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { UserIntake } from '@/schemas/intake';
import type { Roadmap } from '@/schemas/roadmap';
import { buildLocalRoadmap } from '@/lib/roadmap-local';
import { useAnalytics } from '@/hooks/use-analytics';
import { DemoFormFields } from './demo-form-fields';

const localStorageKey = 'ai-mentor:last-intake';

const FormSchema = UserIntake.extend({
  consent: z.boolean().refine((value) => value === true, { message: 'Consent is required.' })
});

export type DemoFormValues = z.infer<typeof FormSchema>;

type DemoFormProps = {
  onResult: (data: { roadmap: Roadmap; provider: string }) => void;
  onLoadingChange?: (loading: boolean) => void;
};

type ApiResponse = {
  roadmap: Roadmap;
  provider: string;
};

export function DemoForm({ onResult, onLoadingChange }: DemoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<DemoFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      current_level: 'beginner',
      goal: '',
      time_per_week_hours: 5,
      deadline_weeks: 6,
      consent: false
    }
  });

  const { track } = useAnalytics();
  const [isPrefilled, setIsPrefilled] = useState(false);
  const currentLevel = watch('current_level');
  const consent = watch('consent');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(localStorageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as UserIntake;
      reset({ ...parsed, consent: true });
      setIsPrefilled(true);
    } catch (error) {
      console.warn('Failed to parse stored intake', error);
    }
  }, [reset]);

  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);

  const onSubmit = handleSubmit(async (values) => {
    const { consent: _consent, ...intake } = values;
    onLoadingChange?.(true);
    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intake)
      });

      if (!response.ok) {
        if (response.status === 422) {
          await response.json();
          toast.error('Please correct the highlighted fields.');
          return;
        }
        throw new Error('Request failed');
      }

      const payload: ApiResponse = await response.json();
      onResult(payload);
      track('roadmap_generated', { provider: payload.provider });
      toast.success('Roadmap ready! Scroll down to preview.');
      window.localStorage.setItem(localStorageKey, JSON.stringify(intake));
    } catch (error) {
      const fallback = buildLocalRoadmap(intake);
      onResult({ roadmap: fallback, provider: 'local_fallback' });
      track('roadmap_generated', { provider: 'local_fallback', reason: 'network_error' });
      toast.warning('Using local generator because the AI service is unavailable.');
      window.localStorage.setItem(localStorageKey, JSON.stringify(intake));
    } finally {
      onLoadingChange?.(false);
    }
  });

  return (
    <section id="demo" aria-labelledby="demo-heading" className="py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
        <div>
          <h2 id="demo-heading" className="text-3xl font-semibold sm:text-4xl">
            Try the roadmap generator
          </h2>
          <p className="mt-3 text-muted-foreground">
            Share your goal and we’ll generate a deterministic plan with curated projects and resources.
          </p>
          {isPrefilled ? (
            <p className="mt-2 text-sm text-muted-foreground">We pre-filled your last successful submission.</p>
          ) : null}
        </div>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <DemoFormFields
            errors={errors}
            register={register}
            currentLevel={currentLevel}
            onLevelChange={(value) =>
              setValue('current_level', value, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
            consent={Boolean(consent)}
            onConsentChange={(value) =>
              setValue('consent', value, {
                shouldDirty: true,
                shouldValidate: true
              })
            }
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </section>
  );
}

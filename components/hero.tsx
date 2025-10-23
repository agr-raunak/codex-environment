'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAnalytics } from '@/hooks/use-analytics';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { track } = useAnalytics();

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="hero-heading">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
        <Badge variant="secondary" className="px-4 py-2">
          Guided pods · AI grading · Clear rubrics
        </Badge>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, ease: 'easeOut' }}
          variants={containerVariants}
          className="space-y-6"
        >
          <h1 id="hero-heading" className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Personal learning roadmaps crafted for ambitious students
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            AI Mentor combines deterministic planning, project-based skill pods, and rubric-driven feedback so learners stay on
            track without second-guessing their progress.
          </p>
        </motion.div>
        <div className="flex flex-col gap-3 sm:flex-row" role="group" aria-label="Primary call to actions">
          <Button asChild size="lg" data-event="cta_get_started" onClick={() => track('cta_get_started')}>
            <Link href="#demo">Generate my roadmap</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" data-event="cta_view_projects" onClick={() => track('cta_view_projects')}>
            <Link href="#projects">Browse sample projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

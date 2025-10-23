'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const projects = [
  {
    title: 'Sustainable campus dashboard',
    summary: 'Track emissions, energy use, and student-led initiatives with live dashboards and impact narratives.',
    repo: 'https://github.com/ai-mentor/sustainable-campus',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
    focus: 'Data storytelling'
  },
  {
    title: 'Accessible course planner',
    summary: 'Design a plan builder that supports screen readers, keyboard workflows, and offline-first sync.',
    repo: 'https://github.com/ai-mentor/accessible-course-planner',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    focus: 'Inclusive design'
  },
  {
    title: 'AI feedback assistant',
    summary: 'Build a rubric-aware assistant that summarizes pull requests and surfaces action items.',
    repo: 'https://github.com/ai-mentor/feedback-assistant',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Artificial_intelligence_robot.jpg',
    focus: 'Automation'
  }
];

export function ProjectsCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const variants = useMemo(
    () =>
      prefersReducedMotion
        ? { hidden: { opacity: 1, x: 0 }, visible: { opacity: 1, x: 0 } }
        : { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
    [prefersReducedMotion]
  );

  return (
    <section id="projects" className="py-16 sm:py-20" aria-labelledby="projects-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <h2 id="projects-heading" className="text-3xl font-semibold sm:text-4xl">
            Projects that build real momentum
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Each roadmap highlights projects with clear acceptance criteria so you know exactly what to ship.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              variants={variants}
            >
              <Card className="h-full overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={`${project.image}?auto=format&fit=crop&w=800&q=80`}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {project.focus}
                  </Badge>
                  <CardTitle className="mt-3 text-xl">{project.title}</CardTitle>
                  <CardDescription>{project.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={project.repo}
                    className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    View repository
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectsCarouselSkeleton() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border bg-card/50 p-6">
              <div className="mb-4 h-40 w-full rounded-md bg-muted" />
              <div className="mb-3 h-6 w-24 rounded bg-muted" />
              <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
              <div className="h-5 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Lightbulb, ShieldCheck, Workflow } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

const features = [
  {
    icon: Lightbulb,
    title: 'Deterministic planning',
    description: 'Blend AI suggestions with deterministic fallbacks so every student gets a roadmap—even offline.'
  },
  {
    icon: Workflow,
    title: 'Project-based pods',
    description: 'Skill pods ship projects together with weekly briefs, curated resources, and accountability rituals.'
  },
  {
    icon: ShieldCheck,
    title: 'Transparent grading',
    description: 'Grades map to a rubric with numeric and qualitative guidance so teams know what to improve next.'
  }
];

export function FeatureCards() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="features" className="border-t border-b bg-muted/40 py-16 sm:py-20" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <h2 id="features-heading" className="text-3xl font-semibold sm:text-4xl">
            A learning co-pilot you can rely on
          </h2>
          <p className="text-muted-foreground">Every feature is built with accessibility, privacy, and clarity in mind.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="h-full" role="presentation">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

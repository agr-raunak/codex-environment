'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { Roadmap } from '@/schemas/roadmap';
import { SiteHeader } from './site-header';
import { Hero } from './hero';
import { FeatureCards } from './feature-cards';
import { SkillPods } from './skill-pods';
import { EventsGrid } from './events-grid';
import { FAQ } from './faq';
import { SiteFooter } from './site-footer';
import { DemoForm } from './demo-form';
import { RoadmapPanel } from './roadmap-panel';
import { ProjectsCarouselSkeleton } from './projects-carousel';

const ProjectsCarousel = dynamic(() => import('./projects-carousel').then((mod) => mod.ProjectsCarousel), {
  ssr: false,
  loading: () => <ProjectsCarouselSkeleton />
});

type RoadmapState = {
  roadmap?: Roadmap;
  provider?: string;
};

export function HomePage() {
  const [roadmapState, setRoadmapState] = useState<RoadmapState>({});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <FeatureCards />
        <SkillPods />
        <ProjectsCarousel />
        <EventsGrid />
        <DemoForm
          onResult={(data) => setRoadmapState({ roadmap: data.roadmap, provider: data.provider })}
          onLoadingChange={setIsLoading}
        />
        <RoadmapPanel roadmap={roadmapState.roadmap} provider={roadmapState.provider} isLoading={isLoading} />
        <FAQ />
      </main>
      <SiteFooter />
    </div>
  );
}

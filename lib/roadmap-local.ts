import type { Roadmap } from '@/schemas/roadmap';
import type { UserIntake } from '@/schemas/intake';
import { hashString, pickFromArray } from './hash';

const focuses = [
  'Foundations and mindset',
  'Core language skills',
  'Project execution',
  'Collaboration and feedback',
  'Deployment and sharing'
];

const projects = [
  {
    title: 'Build a personal learning dashboard',
    brief:
      'Create a lightweight dashboard that tracks your weekly study hours, key insights, and blockers using your preferred stack.'
  },
  {
    title: 'Publish a learning blog post',
    brief:
      'Summarize your weekly learning in a blog post or video, highlighting one concept you struggled with and how you overcame it.'
  },
  {
    title: 'Ship a mini product demo',
    brief:
      'Prototype a small feature aligned with your goal, document the decisions you made, and record a two-minute walkthrough.'
  },
  {
    title: 'Run a peer feedback session',
    brief:
      'Host a short session with a peer, collect feedback on your project, and publish an action plan for the next iteration.'
  }
];

const resources = [
  { title: 'Frontend Masters Learning Roadmap', type: 'course', url: 'https://frontendmasters.com/guides/learning-roadmap/' },
  { title: 'Refactoring UI Accessibility Guide', type: 'article', url: 'https://refactoringui.com/' },
  { title: 'MDN Web Docs — Web Components', type: 'article', url: 'https://developer.mozilla.org/en-US/docs/Web/Web_Components' },
  { title: 'Egghead: Build a modern UI', type: 'video', url: 'https://egghead.io/' },
  { title: 'Open Source Guide to Maintainers', type: 'article', url: 'https://opensource.guide/' },
  { title: 'The Pragmatic Programmer Notes', type: 'article', url: 'https://pragprog.com/' },
  { title: 'GitHub Learning Lab', type: 'tool', url: 'https://lab.github.com/' },
  { title: 'Scrimba React Challenges', type: 'course', url: 'https://scrimba.com/' },
  { title: 'Figma Community Templates', type: 'tool', url: 'https://www.figma.com/community' },
  { title: 'Designing Data-Intensive Applications Summary', type: 'article', url: 'https://github.com/' }
] as const;

export function buildLocalRoadmap(input: UserIntake): Roadmap {
  const signature = `${input.name}|${input.email}|${input.goal}|${input.current_level}`;
  const baseHash = hashString(signature);
  const weeks: Roadmap['weeks'] = Array.from({ length: 4 }).map((_, index) => {
    const weekNumber = index + 1;
    const focusHash = hashString(`${baseHash}-${weekNumber}-focus`);
    const projectHash = hashString(`${baseHash}-${weekNumber}-project`);

    const focus = pickFromArray(focuses, focusHash);
    const project = pickFromArray(projects, projectHash);

    const resourcePool = new Set<typeof resources[number]>();
    let offset = 0;
    while (resourcePool.size < 2) {
      const resourceHash = hashString(`${baseHash}-${weekNumber}-resource-${offset}`);
      resourcePool.add(pickFromArray(resources, resourceHash));
      offset += 1;
    }

    return {
      week: weekNumber,
      focus,
      resources: Array.from(resourcePool),
      project
    };
  });

  const summary = `Hey ${input.name}, here’s a focused four-week plan to help you accomplish “${input.goal}”. With ${input.time_per_week_hours} hours per week and ${input.deadline_weeks} weeks until your target date, stay consistent and reflect weekly.`;

  return { summary, weeks };
}

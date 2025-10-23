import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const pods = [
  {
    title: 'Launch a real-world demo',
    duration: '4 weeks',
    summary: 'Ship a usable prototype with weekly show-and-tell rituals.',
    skills: ['Rapid prototyping', 'Async updates', 'Feedback loops']
  },
  {
    title: 'Level-up your portfolio',
    duration: '3 weeks',
    summary: 'Bundle your best work with structured reflections and impact stories.',
    skills: ['Storytelling', 'Evidence', 'Community boosts']
  },
  {
    title: 'Automation catalyst',
    duration: '5 weeks',
    summary: 'Automate a repetitive workflow and document before/after metrics.',
    skills: ['Process mapping', 'APIs', 'Stakeholder demos']
  }
];

export function SkillPods() {
  return (
    <section id="pods" className="py-16 sm:py-20" aria-labelledby="pods-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <h2 id="pods-heading" className="text-3xl font-semibold sm:text-4xl">
            Skill pods that practice what they preach
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Join focused cohorts that ship weekly. Each pod includes embedded mentors, peer reviews, and measurable outcomes.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {pods.map((pod) => (
            <Card key={pod.title} className="h-full">
              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  {pod.duration}
                </Badge>
                <CardTitle className="mt-3 text-xl">{pod.title}</CardTitle>
                <CardDescription>{pod.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {pod.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

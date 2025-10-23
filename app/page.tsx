import { HomePage } from '@/components/home-page';
import { eventsJsonLd, faqJsonLd, productJsonLd } from '@/lib/seo';

const events = [
  {
    title: 'Kickoff: Roadmap shaping',
    date: '2025-10-01T10:00:00Z',
    description: 'Live planning session with mentors walking through the intake rubric.'
  },
  {
    title: 'Build lab: Accessibility in action',
    date: '2025-10-08T17:00:00Z',
    description: 'Peer working session with live audits and pair design critiques.'
  },
  {
    title: 'Lightning demos: Automation catalysts',
    date: '2025-10-15T16:00:00Z',
    description: 'Showcase automation wins from across the community with live Q&A.'
  }
];

export default function Page() {
  const jsonLd = [productJsonLd(), faqJsonLd(), eventsJsonLd(events)];

  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          key={index}
          type="application/ld+json"
        />
      ))}
      <HomePage />
    </>
  );
}

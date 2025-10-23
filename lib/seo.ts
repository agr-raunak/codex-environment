import type { Metadata } from 'next';

const siteUrl = 'https://ai-mentor.example.com';
const siteName = 'AI Mentor';
const description =
  'AI Mentor generates personalized study roadmaps, launches project-based skill pods, and grades submissions with transparent rubrics.';

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Personalized learning pods`,
    template: `%s | ${siteName}`
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url: siteUrl,
    siteName,
    images: [
      {
        url: '/api/og?title=AI%20Mentor&tagline=Personalized%20learning%20pods',
        width: 1200,
        height: 630,
        alt: 'AI Mentor preview'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description
  }
};

export function productJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: siteName,
    description,
    brand: {
      '@type': 'Brand',
      name: siteName
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the AI Mentor roadmap work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We combine your intake form, project library, and deterministic AI fallback to produce a plan you can trust.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is my data secure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Sensitive data stays local unless you enable external model providers. We never persist submissions server-side.'
        }
      }
    ]
  };
}

export function eventsJsonLd(events: Array<{ title: string; date: string; description: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: `${siteName} Skill Pods`,
    eventSchedule: events.map((event) => ({
      '@type': 'Event',
      name: event.title,
      startDate: event.date,
      description: event.description,
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode'
    }))
  };
}

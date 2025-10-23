const faqs = [
  {
    question: 'Do I need an OpenAI key to get started?',
    answer:
      'No. The roadmap generator and grader both provide deterministic local fallbacks so every user gets value out of the box.'
  },
  {
    question: 'How do project pods keep me accountable?',
    answer:
      'Pods run weekly rituals—kickoff, build labs, lightning demos, and retros—so you can share progress and unblock quickly.'
  },
  {
    question: 'Can educators customize the rubric?',
    answer:
      'Yes. Rubrics are stored as JSON and can be versioned in Git. Students always see the exact rubric used for grading.'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="border-t bg-muted/30 py-16 sm:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 id="faq-heading" className="text-3xl font-semibold sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-muted-foreground">Have another question? Reach out and we’ll walk you through the roadmap.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-lg border bg-background p-4 transition-colors">
              <summary className="cursor-pointer text-left text-lg font-medium">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background py-10" aria-labelledby="footer-heading">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h2 id="footer-heading" className="text-base font-semibold text-foreground">
            AI Mentor
          </h2>
          <p className="mt-1 max-w-md">Personalized roadmaps, project pods, and AI grading without the guesswork.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4" aria-label="Footer links">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="#demo" className="hover:text-foreground">
            Demo
          </Link>
          <Link href="#events" className="hover:text-foreground">
            Events
          </Link>
          <Link href="mailto:hello@ai-mentor.example.com" className="hover:text-foreground">
            Contact
          </Link>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} AI Mentor. All rights reserved.</p>
      </div>
    </footer>
  );
}

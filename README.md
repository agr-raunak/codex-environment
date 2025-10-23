# AI Mentor

AI Mentor is a Next.js App Router experience that generates deterministic learning roadmaps, runs project-based skill pods, and delivers AI-assisted grading with clear rubrics. The MVP relies on local generators with optional OpenAI providers and includes accessibility-first UI, schema validation, and automated tests.

## Quick start

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) to try the landing page, demo intake form, roadmap preview, and AI grading workflow.

## Available scripts

- `pnpm dev` – run the Next.js development server
- `pnpm build` – create a production build
- `pnpm start` – serve the production build
- `pnpm lint` – lint with `next lint`
- `pnpm test` – execute Vitest unit tests
- `pnpm test:e2e` – execute Playwright smoke tests (requires `pnpm dev` in another terminal)
- `pnpm type-check` – run TypeScript in `--noEmit` mode

## Environment variables

The app works without remote providers, but you can opt in to OpenAI-based generation:

- `OPENAI_API_KEY` – API key for OpenAI (optional). When omitted, deterministic local fallbacks are used.
- `OPENAI_MODEL` – override the model name (defaults to `gpt-4o-mini`).

## Testing

Unit tests cover the ICS generator, intake schema validation, and local grading determinism. Run them with:

```bash
pnpm test
```

Playwright ships with a basic smoke test that exercises the full demo flow. Start the dev server in one terminal and run:

```bash
pnpm dev
# in another terminal
pnpm test:e2e
```

## Architecture notes

- **UI** – Next.js App Router + Tailwind + shadcn/ui primitives, animated with Framer Motion and supporting prefers-reduced-motion.
- **Forms** – `react-hook-form` + Zod for schema-safe validation, with inline error messaging and accessible labeling.
- **APIs** – `/api/roadmap` and `/api/grade` validate payloads and call OpenAI when available, falling back to deterministic local providers on failure.
- **Deterministic fallbacks** – Local roadmap and grading utilities hash input values so repeated submissions stay stable.
- **SEO** – Metadata helpers generate JSON-LD for product, FAQ, and events, and an OG image endpoint renders social previews.
- **Analytics** – `useAnalytics` provides a simple client-side tracker stub and all major buttons emit `data-event` attributes.

## Limitations

- The MVP uses in-memory processing only—no persistent storage or authentication is included.
- Remote model calls are best-effort; when unavailable, responses return deterministic fallbacks with a `provider` flag.
- Playwright tests assume default accessible roles from shadcn/ui; update selectors if you customize components.

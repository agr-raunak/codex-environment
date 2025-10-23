import { ImageResponse } from "next/server";

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'AI Mentor';
  const tagline = searchParams.get('tagline') ?? 'Personalized learning pods';

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col justify-center bg-[#0f172a] px-24 text-left text-white"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <div tw="text-6xl font-semibold">{title}</div>
        <div tw="mt-6 text-3xl text-slate-200">{tagline}</div>
        <div tw="mt-10 flex items-center gap-4 text-lg text-slate-300">
          <div tw="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Deterministic roadmaps · Skill pods · Rubric grading</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}

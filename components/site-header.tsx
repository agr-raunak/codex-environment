'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { useAnalytics } from '@/hooks/use-analytics';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pods', label: 'Skill pods' },
  { href: '#projects', label: 'Projects' },
  { href: '#events', label: 'Events' },
  { href: '#faq', label: 'FAQ' }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { track } = useAnalytics();
  const navItems = useMemo(() => navLinks, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span aria-label="AI Mentor" className="font-bold">AI Mentor</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn('transition-colors hover:text-primary', pathname === item.href && 'text-primary')}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            data-event="cta_open_demo"
            onClick={() => track('cta_open_demo')}
            className="hidden md:inline-flex"
          >
            <Link href="#demo">Launch demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

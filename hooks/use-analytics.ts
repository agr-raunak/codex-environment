'use client';

import { useCallback } from 'react';

type AnalyticsPayload = Record<string, unknown>;

type Analytics = {
  track: (eventName: string, payload?: AnalyticsPayload) => void;
};

export function useAnalytics(): Analytics {
  const track = useCallback((eventName: string, payload: AnalyticsPayload = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', eventName, payload);
    }
  }, []);

  return { track };
}

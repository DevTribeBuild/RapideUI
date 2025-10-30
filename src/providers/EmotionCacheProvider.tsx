'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

// This is the default Emotion cache that is used by MUI.
// It is created once per request on the server and then reused on the client.
// This is necessary to prevent a flash of unstyled content (FOUC) on the client.
export default function EmotionCacheProvider(props: any) {
  const { options, children } = props;

  const [emotionCache] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const serialized = emotionCache.sheet.tags.map((tag: any) => tag.outerHTML).join('');
    if (serialized) {
      return (
        <style
          data-emotion={`${emotionCache.key} ${emotionCache.sheet.tags.map((tag: any) => tag.key).join(' ')}`}
          dangerouslySetInnerHTML={{ __html: serialized }}
        />
      );
    }
    return null;
  });

  return <DefaultCacheProvider value={emotionCache}>{children}</DefaultCacheProvider>;
}
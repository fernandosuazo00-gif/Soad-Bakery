// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: update to the final production domain once it is registered/live.
  site: 'https://www.soadbakery.com',
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: true,
    // Product photos are managed in FStudio Admin (Supabase Storage) and
    // optimized here at build time, like the photos that used to live in src/assets.
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' }],
  },
  integrations: [sitemap()],
});

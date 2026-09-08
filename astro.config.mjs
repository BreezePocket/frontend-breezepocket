// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Canonical origin. Override with PUBLIC_SITE_URL once a custom domain is attached.
  site: process.env.PUBLIC_SITE_URL || 'https://breezepocket.pages.dev',
  output: 'static',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            gsap: ['gsap', 'gsap/ScrollTrigger'],
          },
        },
      },
    },
  },
});

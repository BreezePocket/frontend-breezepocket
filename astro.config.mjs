// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.vectrfl.com',
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

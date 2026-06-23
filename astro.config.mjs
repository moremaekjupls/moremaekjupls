import { defineConfig } from 'astro/config';

// Deployed at the root of a GitHub Pages user site (repo: moremaekjupls.github.io).
export default defineConfig({
  site: 'https://moremaekjupls.github.io',
  base: '/',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: { format: 'directory' },
});

import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages project repo: https://moremaekjupls.github.io/moremaekjupls/
// base must match the repo name so internal links/assets resolve under the subpath.
// (If you later rename the repo to `moremaekjupls.github.io` or add a custom domain,
//  change base back to '/' and site to that URL.)
export default defineConfig({
  site: 'https://moremaekjupls.github.io',
  base: '/moremaekjupls',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: { format: 'directory' },
});

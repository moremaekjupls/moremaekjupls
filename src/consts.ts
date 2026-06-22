// ============================================================
//  SITE CONFIG — edit links, contact & analytics here.
//  Search for "REPLACE" to find every placeholder.
// ============================================================

export const SITE = {
  name: 'Khondamir Begmatov',
  // REPLACE with your real URL once deployed (used for SEO/OG tags & sitemap).
  domain: 'https://moremaekjupls.github.io',
};

// Footer social links — replace the URLs.
export const SOCIALS = {
  github: 'https://github.com/your-handle',          // REPLACE
  x: 'https://x.com/your-handle',                     // REPLACE
  linkedin: 'https://linkedin.com/in/your-handle',    // REPLACE
  email: 'mailto:hello@example.com',                  // REPLACE
};

// The NURA project.
export const PROJECT = {
  liveUrl: '#', // REPLACE with the live NURA URL (e.g. https://nura.app)
};

// Contact form — uses Formspree (free, no backend).
// 1. Sign up at https://formspree.io, create a form, copy its endpoint.
// 2. Paste it below. Until you do, the form is hidden automatically.
export const CONTACT = {
  formspreeEndpoint: '', // REPLACE e.g. 'https://formspree.io/f/abcdwxyz'
};

// Analytics — privacy-friendly, no cookies, no backend.
// Leave enabled:false to ship without analytics.
// Recommended: Plausible (plausible.io) or GoatCounter (goatcounter.com).
export const ANALYTICS = {
  enabled: false,                 // set true after filling the fields below
  provider: 'plausible' as 'plausible' | 'goatcounter',
  // For Plausible: your domain, e.g. 'khondamir.com'
  // For GoatCounter: your code, e.g. 'khondamir' (from khondamir.goatcounter.com)
  site: '',                       // REPLACE
};

// Generates one bilingual blog post (RU + EN) as a DRAFT, using the Anthropic API.
// Run by .github/workflows/ai-post.yml on a schedule. Needs env ANTHROPIC_API_KEY.
// Output: two files src/content/blog/<slug>.ru.md and <slug>.en.md with draft: true.
import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const BLOG_DIR = 'src/content/blog';
const today = new Date().toISOString().slice(0, 10);

const ruFiles = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.ru.md')) : [];
const slugs = ruFiles.map((f) => f.replace('.ru.md', ''));
const titles = ruFiles.map((f) => {
  const m = fs.readFileSync(path.join(BLOG_DIR, f), 'utf8').match(/title:\s*"([^"]+)"/);
  return m ? m[1] : '';
}).filter(Boolean);

const system = [
  "You are the ghostwriter for Khondamir Begmatov's personal blog.",
  "Background: international relations, now builds products with AI; his project NURA estimates calories from a meal photo.",
  "Voice: confident, concrete, no corporate fog, no hype. Analysis of AI through the lens of a solo product builder.",
  "Write EVERGREEN analysis — do NOT claim to report breaking news or specific dated events you cannot verify.",
  "Each post: one sharp argument, 2–3 section headings, a concrete example, a memorable takeaway. ~500–700 words.",
].join(' ');

const user = [
  "Write ONE new blog post in BOTH Russian and English. Same ideas, written natively in each language (not a literal translation).",
  titles.length ? `Do NOT overlap with existing posts: ${titles.join(' | ')}.` : '',
  "Pick a fresh, specific angle on building AI products (evals, latency, cost-per-action, UX of AI features, when to trust model output, moats for small builders, prompt vs fine-tune, shipping speed, distribution, etc.).",
  "Return ONLY a JSON object — no prose, no code fences — with EXACTLY this shape:",
  '{"slug":"kebab-case","ru":{"title":"...","excerpt":"...","body":"## ...\\n\\n..."},"en":{"title":"...","excerpt":"...","body":"## ...\\n\\n..."}}',
  `Rules: slug = lowercase a-z 0-9 and dashes only, and NOT one of: ${slugs.join(', ') || '(none)'}.`,
  "excerpt = one sentence. body = markdown with 2–3 '## ' headings and one '>' blockquote, NO H1 (#) heading.",
].filter(Boolean).join('\n');

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
  body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 4000, system, messages: [{ role: 'user', content: user }] }),
});
if (!res.ok) { console.error('API error', res.status, await res.text()); process.exit(1); }
const data = await res.json();
const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();

let jsonStr = text;
const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
if (fence) jsonStr = fence[1];
else { const s = text.indexOf('{'), e = text.lastIndexOf('}'); if (s >= 0 && e > s) jsonStr = text.slice(s, e + 1); }

let post;
try { post = JSON.parse(jsonStr); } catch (e) { console.error('JSON parse failed:', e.message, '\n---\n', text.slice(0, 600)); process.exit(1); }
for (const k of ['ru', 'en']) if (!post[k] || !post[k].title || !post[k].body) { console.error('Missing field:', k); process.exit(1); }

let slug = String(post.slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || `post-${today}`;
if (slugs.includes(slug)) slug = `${slug}-${today.replace(/-/g, '').slice(4)}`;

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const fm = (lang, d) =>
  `---\ntitle: "${esc(d.title)}"\nexcerpt: "${esc(d.excerpt || '')}"\npubDate: ${today}\nlang: "${lang}"\ntransId: "${slug}"\ndraft: true\n---\n\n${String(d.body).trim()}\n`;

fs.writeFileSync(path.join(BLOG_DIR, `${slug}.ru.md`), fm('ru', post.ru));
fs.writeFileSync(path.join(BLOG_DIR, `${slug}.en.md`), fm('en', post.en));
console.log('Wrote draft post:', slug);

import { defineCollection, z } from 'astro:content';

// Blog collection. To add a post: drop a new .md file in src/content/blog/
// (one per language). See README → "Adding a blog post".
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    pubDate: z.coerce.date(),
    lang: z.enum(['ru', 'en']),
    // transId links the RU and EN versions of the same post.
    // Use the same value (and the same as the URL slug) in both files.
    transId: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

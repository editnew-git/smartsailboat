import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Pressly/n8n writes this collection. Its internal name and directory are stable.
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string().min(1),
    subheadline: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
      const date = new Date(`${value}T00:00:00Z`);
      return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
    }, 'Date must be a real YYYY-MM-DD calendar date.'),
    location: z.string().optional(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be a permanent lowercase hyphenated identifier.'),
    image: z.string().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };

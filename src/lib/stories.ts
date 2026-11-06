import { getCollection } from 'astro:content';
import { site } from './site.mjs';

export async function publishedStories() {
  const stories = await getCollection('news', ({ data }) => !data.draft);
  const slugs = new Set<string>();
  for (const story of stories) {
    if (slugs.has(story.data.slug)) throw new Error(`Duplicate published story slug: ${story.data.slug}`);
    slugs.add(story.data.slug);
  }
  return stories.sort((a, b) => b.data.date.localeCompare(a.data.date) || a.data.slug.localeCompare(b.data.slug));
}

export const displayDate = (value: string) => new Intl.DateTimeFormat(site.language, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

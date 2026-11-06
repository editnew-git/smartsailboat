import { publishedStories } from '../lib/stories';
import { site, absoluteUrl, storyPath, escapeXml } from '../lib/site.mjs';

export async function GET() {
  const paths = ['/', site.routePrefix, ...(await publishedStories()).map(story => storyPath(story.data.slug))];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

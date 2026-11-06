import { publishedStories } from '../lib/stories';
import { site, absoluteUrl, storyPath, escapeXml } from '../lib/site.mjs';

export async function GET() {
  const stories = await publishedStories();
  const items = stories.map(story => {
    const url = escapeXml(absoluteUrl(storyPath(story.data.slug)));
    return `<item><title>${escapeXml(story.data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${story.data.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(story.data.excerpt || '')}</description>${story.data.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('')}</item>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(site.siteName)}</title><link>${escapeXml(site.siteUrl)}/</link><description>${escapeXml(site.description)}</description><language>${escapeXml(site.language)}</language><atom:link href="${escapeXml(absoluteUrl('/rss.xml'))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { site } from './src/lib/site.mjs';
import { publicationPlugins } from './src/lib/publication-html.mjs';

export default defineConfig({
  output: 'static',
  site: site.siteUrl,
  trailingSlash: 'always',
  markdown: { processor: unified({ rehypePlugins: publicationPlugins }) },
});

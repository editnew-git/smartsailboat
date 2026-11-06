import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import presslyVideo from './pressly-video.mjs';

const YOUTUBE_EMBED = /^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}(?:\?start=([1-9][0-9]{0,9}))?$/;
const SAM_EMBED = /^https:\/\/iframe\.wwds\.co\/\?campId=[A-Za-z0-9_-]{1,128}(?:&orientation=(landscape|portrait))?$/;

/** A URL allowlist alone is insufficient: also replace arbitrary iframe powers. */
function trustedFrames() {
  return tree => {
    function walk(node) {
      if (node.type === 'element' && node.tagName === 'iframe') {
        const src = node.properties?.src;
        const youtube = typeof src === 'string' ? YOUTUBE_EMBED.exec(src) : null;
        const sam = typeof src === 'string' ? SAM_EMBED.exec(src) : null;
        if ((!youtube && !sam) || (youtube?.[1] && Number(youtube[1]) > 2147483647)) {
          throw new Error('Unapproved publication iframe: use a Pressly video marker or the canonical SAM campaign URL.');
        }
        const title = typeof node.properties.title === 'string' && node.properties.title.trim()
          ? node.properties.title.trim() : (youtube ? 'Video' : 'S.A.M. layout');
        if (title.length > 300 || /[\u0000-\u001f\u007f]/.test(title)) throw new Error('Invalid publication iframe title.');
        node.properties = {
          src,
          title,
          width: youtube || sam?.[1] !== 'portrait' ? 1280 : 720,
          height: youtube || sam?.[1] !== 'portrait' ? 720 : 1280,
          loading: 'lazy',
          referrerPolicy: 'strict-origin-when-cross-origin',
          allow: youtube ? 'encrypted-media; picture-in-picture; fullscreen' : 'fullscreen',
          allowFullScreen: true,
          ...(sam ? { className: ['sam-embed', ...(sam[1] === 'portrait' ? ['sam-embed-portrait'] : [])] } : {}),
        };
        node.children = [];
      }
      for (const child of node.children || []) walk(child);
    }
    walk(tree);
  };
}

const publicationSchema = {
  ...defaultSchema,
  tagNames: [...defaultSchema.tagNames, 'figure', 'figcaption', 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    figure: [...(defaultSchema.attributes.figure || []), ['className', 'pressly-video']],
    div: [...(defaultSchema.attributes.div || []), ['className', 'pressly-video-player']],
    iframe: ['src', 'title', 'width', 'height', 'loading', 'referrerPolicy', 'allow', 'allowFullScreen', ['className', 'sam-embed', 'sam-embed-portrait']],
  },
  protocols: { ...defaultSchema.protocols, src: ['https'], href: ['http', 'https', 'mailto', 'tel'] },
  strip: [...defaultSchema.strip, 'script', 'style', 'object', 'embed', 'svg', 'math'],
};

// Parse raw HTML into the same tree as Markdown before validation/sanitization.
// Keep the final sanitizer last: later untrusted transforms could undo safety.
// https://github.com/rehypejs/rehype-raw
// https://github.com/rehypejs/rehype-sanitize
export const publicationPlugins = [rehypeRaw, presslyVideo, trustedFrames, [rehypeSanitize, publicationSchema]];

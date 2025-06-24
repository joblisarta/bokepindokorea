// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

import { getAllVideos } from './src/utils/data.ts';
import { slugify } from './src/utils/slugify.ts';

export default defineConfig({
  site: 'https://bokepindokorea.pages.dev',
  integrations: [
    sitemap({
      // Opsional: Untuk tujuan pengujian, atur limit ke angka kecil
      // Misalnya, pecah setiap 500 URL
      // limit: 500,
      
      customPages: async () => {
        const videos = await getAllVideos();

        const videoPages = videos.map(video => ({
          loc: `${this.site}/${slugify(video.title)}-${video.id}`,
          lastmod: video.lastmod || new Date().toISOString(),
          changefreq: 'monthly',
          priority: 0.8,
        }));

        const staticPages = [
          {
            loc: `${this.site}/`,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: 1.0,
          },
          {
            loc: `${this.site}/category/`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.9,
          },
          {
            loc: `${this.site}/tags/`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.9,
          },
        ];

        return [...staticPages, ...videoPages];
      },
    }),
    cloudflare(),
  ],
  output: 'server',
  adapter: cloudflare(),
});

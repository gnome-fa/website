// @ts-check
import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';

import playformCompress from '@playform/compress';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site:"https://fa.gnome.org",
  outDir: 'public',
  publicDir: 'static',
  integrations: [alpinejs(), playformCompress(), sitemap()]
});
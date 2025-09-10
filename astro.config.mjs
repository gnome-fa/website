// @ts-check
import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
  site:"https://fa.gnome.org",
  outDir: 'public',
  publicDir: 'static',
  integrations: [alpinejs()]
});

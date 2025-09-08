// @ts-check
import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
  site:"https://persian.gnome.org",
  // Temporary until moving to the GNOME domain
  base:"/website",
  integrations: [alpinejs()]
});

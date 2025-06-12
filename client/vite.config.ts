import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/_redirects',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    host: true
  }
};

export default defineConfig(config);
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/_redirects', // <-- updated path
          dest: '.' // copy to dist root
        }
      ]
    })
  ],
  build: {
    outDir: 'dist', // adjust if your build output is elsewhere
    emptyOutDir: true
  }
});
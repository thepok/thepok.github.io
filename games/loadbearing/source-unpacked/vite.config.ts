import { defineConfig } from 'vite';
const buildVersion = Date.now().toString(36);
export default defineConfig({
  define: { __BUILD_VERSION__: JSON.stringify(buildVersion) },
  plugins: [{
    name: 'version-entry-resources',
    transformIndexHtml: { order: 'post', handler(html) {
      return html.replace(/((?:src|href)="\.\/(?:assets\/[^"?]+|favicon\.svg))"/g, `$1?v=${buildVersion}"`)
        .replace('</head>', `<meta name="build-version" content="${buildVersion}"/></head>`);
    } },
  }],
  base: './',
  // Jolt locates its pthread module relative to import.meta.url. Prebundling
  // moves it into .vite/deps without its sibling worker, causing a 404.
  optimizeDeps: { exclude: ['jolt-physics'] },
  worker: { format: 'es' },
  server: { headers: { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' } },
  preview: { headers: { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' } },
  build: {
    rollupOptions: {
      output: { manualChunks(id) { if(id.includes('/node_modules/jolt-physics/')) return 'jolt-physics'; if(id.includes('/node_modules/three/')) return 'three'; } }
    }
  }
});

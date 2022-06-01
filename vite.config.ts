import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  resolve: {
    alias: [
      {
        find: 'eventsource',
        replacement: './node_modules/sockjs-client/lib/transport/browser/eventsource.js',
      },
      {
        find: 'events',
        replacement: './node_modules/sockjs-client/lib/event/emitter.js',
      },
      {
        find: 'crypto',
        replacement: './node_modules/sockjs-client/lib/utils/browser-crypto.js',
      },
    ],
  },
});

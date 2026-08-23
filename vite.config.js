import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

const outDir = path.resolve(__dirname, '../api/public');

/**
 * Only the paths that belong to the Vite build output.
 * Everything else in api/public (.htaccess, .user.ini, index.php, storage …)
 * is left completely untouched.
 */
const viteFrontendPaths = [
  path.join(outDir, 'assets'),
  path.join(outDir, 'js'),
  path.join(outDir, 'index.html'),
];

function cleanFrontendPlugin() {
  return {
    name: 'clean-frontend-only',
    buildStart() {
      for (const target of viteFrontendPaths) {
        if (fs.existsSync(target)) {
          fs.rmSync(target, { recursive: true, force: true });
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cleanFrontendPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      outDir,
      emptyOutDir: false,   // ← disabled; our plugin handles selective cleanup
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('aos')) {
                return 'vendor-utils';
              }
              return 'vendor';
            }
          }
        },
      },
    },
    publicDir: path.resolve(__dirname, 'public'),
  };
});
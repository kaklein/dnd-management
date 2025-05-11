import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "katie-klein",
    project: "dnd-management"
  })],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@data": "/src/data",
      "@images": "/src/images",
      "@models": "/src/models",
      "@pages": "/src/pages",
      "@services": "/src/services",
    },
  },
  build: {
    rollupOptions: {
        output:{
            manualChunks(id) {
                if (id.includes('node_modules')) {
                    return id.toString().split('node_modules/')[1].split('/')[0].toString();
                }
            }
        }
    },

    sourcemap: true
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
});
import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['electron-store']
      },
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      rollupOptions: {
        external: ['electron-store']
      },
      outDir: 'dist/preload'
    }
  },
  renderer: {
    root: resolve('src/renderer'),
    build: {
      outDir: 'dist/renderer'
    },
    resolve: {
      alias: {
        '@': resolve('src/renderer')
      }
    },
    plugins: [vue()]
  }
});
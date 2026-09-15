import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  test: {
    include: ['src/**/*.test.ts'],
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});

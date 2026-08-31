import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    // Next replaces this marker at build time; Vitest needs a harmless module
    // so server-only units can be exercised in its Node environment.
    alias: {
      'server-only': new URL('./src/test/server-only.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.open-next/**',
      // Vendored from thallylabs/thally (src/lib/** is frameworkSyncEligible in
      // starter-release.json, so the file is byte-locked and cannot be edited
      // here). Its "api/[[...slug]] still prerenders" row assumes the API
      // reference the template ships, which this site dropped in 662ceef — no
      // openapi.yaml, no src/content/api/. tests/doc-route-static-params.test.ts
      // keeps the rest of that file's coverage. Drop this line if an API
      // reference is ever configured again.
      'src/lib/__tests__/doc-route-static-params.test.ts',
    ],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})

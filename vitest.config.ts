import { defineConfig } from 'vitest/config';
import { createAireadyVitestAliases } from '../../vitest-aliases';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: createAireadyVitestAliases(__dirname, {
      packagesRootRelative: '..',
      useIndexEntrypoints: true,
    }),
  },
});

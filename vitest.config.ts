import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use the globals mode so you don't need to import expect, describe, etc.
    globals: true,
    
    // Allow .ts file extensions in tests without needing .js
    includeSource: ['src/**/*.{js,ts}'],
    
    // Environment settings
    environment: 'node',
    
    // Coverage settings
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**', 
        '**/test/**', 
        '**/*.d.ts',
        '**/dist/**',
        '**/*.config.*'
      ],
      include: ['src/**/*.ts'],
      all: true
    }
  }
});
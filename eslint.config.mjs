import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Marketing copy often includes quotes/apostrophes in JSX text
      'react/no-unescaped-entities': 'off',

      // Common/intentional patterns in this codebase (localStorage hydrate, etc.)
      // Keep visible as warnings; tighten later as you refactor
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/exhaustive-deps': 'warn',

      // Prefer fixing over time; don't block lint on gradual typing
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'warn',

      // Next.js image optimization is ideal but many dynamic/blob URLs remain
      '@next/next/no-img-element': 'warn',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'next-env.d.ts',
    // One-off Node scripts (CommonJS / seed tools)
    'scripts/**',
    // Legacy backup modules (not imported by the app)
    'contexts/*-old-backup.tsx',
    'contexts/*-improved.tsx',
  ]),
])

export default eslintConfig

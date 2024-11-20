// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: [
            "node_modules",
            "dist",
            "rollup.config.js",
            "spec/helpers/*",
            "jest.config.js",
            "jest.setup.js",
        ]
    },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    }
  }
);

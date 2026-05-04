import { defineConfig } from 'bunup';
import { exports } from 'bunup/plugins';

export default defineConfig({
  entry: ['src/constants/index.ts', 'src/types/index.ts', 'src/utils/index.ts'],
  format: ['esm'],
  plugins: [
    exports({
      includePackageJson: false,
    }),
  ],
});

// Configuración plana nativa de ESLint para Next.js 16.
// Se importan los presets directamente (eslint-config-next ya exporta
// flat configs), evitando el FlatCompat que rompe con ESLint 9.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
];

export default eslintConfig;

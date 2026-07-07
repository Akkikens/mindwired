// ESLint v9 flat config.
//
// `npm run lint` runs `eslint src && tsc`; without a flat config eslint just
// errors out. We use the Remotion preset that ships with the repo
// (@remotion/eslint-config-flat) — it already wires the typescript-eslint
// parser, the react/react-hooks plugins and the @remotion rules, and turns off
// the rules that don't fit Remotion code (no-console, jsx-key, array-index-key,
// …). Kept intentionally thin: the preset is the source of truth, we only add
// project-wide ignores and relax a couple of rules that would otherwise flood
// this (largely pre-existing, generated) codebase with noise.
import {config as remotionConfig} from "@remotion/eslint-config-flat";

export default [
  {
    // never lint build artifacts, deps, or generated output
    ignores: ["node_modules/**", "out/**", "dist/**", "build/**"],
  },
  ...remotionConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // The codebase leans on `any` in a few 3D/asset glue spots and has some
      // intentionally-unused args; keep these as warnings so `eslint src`
      // reports without failing the pre-existing tree.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {argsIgnorePattern: "^_", varsIgnorePattern: "^_"},
      ],
    },
  },
];

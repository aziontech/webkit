import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null
}

export function firstExisting(projectDir, candidates) {
  for (const c of candidates) {
    if (existsSync(join(projectDir, c))) return c
  }
  return null
}

export function readPackage(projectDir) {
  try {
    return JSON.parse(read(join(projectDir, 'package.json')) || '{}') || {}
  } catch {
    return {}
  }
}

export function packageHasKey(projectDir, key) {
  const raw = read(join(projectDir, 'package.json'))
  if (!raw) return false
  try {
    return Object.hasOwn(JSON.parse(raw), key)
  } catch {
    return false
  }
}

export function packageHasStylelint(projectDir) {
  const raw = read(join(projectDir, 'package.json'))
  if (!raw) return false
  try {
    return Boolean(JSON.parse(raw).stylelint)
  } catch {
    return false
  }
}

export const VITE_CONFIG_CANDIDATES = [
  'vite.config.ts',
  'vite.config.js',
  'vite.config.mts',
  'vite.config.mjs'
]

export function usesTailwindVitePlugin(projectDir) {
  const pkg = read(join(projectDir, 'package.json'))
  if (pkg) {
    try {
      const j = JSON.parse(pkg)
      if (j.dependencies?.['@tailwindcss/vite'] || j.devDependencies?.['@tailwindcss/vite'])
        return true
    } catch {
      return false
    }
  }
  const cfg = firstExisting(projectDir, VITE_CONFIG_CANDIDATES)
  return Boolean(cfg && read(join(projectDir, cfg))?.includes('@tailwindcss/vite'))
}

export const BUILD_OUTPUT_DIRS = [
  'node_modules',
  'dist',
  'dist-ssr',
  'coverage',
  '.vite',
  '.nuxt',
  '.output',
  '.next',
  '.svelte-kit',
  'storybook-static'
]

export const ENTRY_CANDIDATES = ['src/main.ts', 'src/main.js', 'src/main.mts', 'src/main.mjs']

export const POSTCSS_CONFIG_CANDIDATES = [
  'postcss.config.js',
  'postcss.config.cjs',
  'postcss.config.mjs',
  'postcss.config.ts',
  '.postcssrc',
  '.postcssrc.json',
  '.postcssrc.js',
  '.postcssrc.cjs'
]

export const ESLINT_CONFIG_CANDIDATES = [
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
  'eslint.config.ts',
  '.eslintrc',
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yml',
  '.eslintrc.yaml'
]

export const PRETTIER_CONFIG_CANDIDATES = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.json5',
  '.prettierrc.yml',
  '.prettierrc.yaml',
  '.prettierrc.toml',
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.mjs',
  '.prettierrc.ts',
  'prettier.config.js',
  'prettier.config.cjs',
  'prettier.config.mjs',
  'prettier.config.ts'
]

export const STYLELINT_CONFIG_CANDIDATES = [
  '.stylelintrc',
  '.stylelintrc.json',
  '.stylelintrc.js',
  '.stylelintrc.cjs',
  '.stylelintrc.mjs',
  '.stylelintrc.yml',
  '.stylelintrc.yaml',
  'stylelint.config.js',
  'stylelint.config.cjs',
  'stylelint.config.mjs'
]

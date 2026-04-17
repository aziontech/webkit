#!/usr/bin/env node
/**
 * Component Documentation Scaffold Generator
 *
 * Scans packages/webkit/src/core and packages/webkit/src/components for
 * components, extracts their props via extractComponentApi.ts, and generates
 * the minimum documentation structure
 * for ds-docs:
 *
 *   1. src/generated/component-api/<slug>.json        – prop/event/slot raw data
 *   2. src/generated/component-props/<slug>.json      – PropsDefinition for Playground
 *   3. src/content/v1/en/components/<slug>.mdx        – minimal doc page (skipped if exists)
 *   4. src/generated/playground-registry.ts           – static Vite-compatible import map
 *
 * Run:
 *   pnpm build:scaffold
 *   pnpm build:scaffold --dry-run         (show what would be created)
 *   pnpm build:scaffold --force           (overwrite existing .mdx files)
 */

import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import {
  discoverWebkitComponents,
  extractWebkitCore,
  type WebkitComponentInfo,
  type PropDefinition,
} from './extractComponentApi.js';

// ---------------------------------------------------------------------------
// Paths (resolved relative to apps/ds-docs)
// ---------------------------------------------------------------------------

const CWD = process.cwd();
const WEBKIT_CORE_DIR = path.resolve(CWD, '../../packages/webkit/src/core');
const WEBKIT_COMPONENTS_DIR = path.resolve(CWD, '../../packages/webkit/src/components');
const WEBKIT_PKG_JSON = path.resolve(CWD, '../../packages/webkit/package.json');
const API_OUTPUT_DIR = path.resolve(CWD, 'src/generated/component-api');
const PROPS_OUTPUT_DIR = path.resolve(CWD, 'src/generated/component-props');
const PROPS_OVERRIDES_DIR = path.resolve(CWD, 'src/generated/component-props-overrides');
const CONTENT_EN_COMPONENTS = path.resolve(CWD, 'src/content/v1/en/components');
const CONTENT_PT_COMPONENTS = path.resolve(CWD, 'src/content/v1/pt/components');
const REGISTRY_OUTPUT = path.resolve(CWD, 'src/generated/playground-registry.ts');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert kebab-case to PascalCase: field-text → FieldText */
function toPascalCase(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Convert kebab-case to Title Case: field-text → Field Text */
function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Derive the doc title from the component's export key (last folder name).
 * e.g. exportKey="field-text" → "Field Text"
 */
function deriveTitle(info: WebkitComponentInfo): string {
  return toTitleCase(info.exportKey);
}

/**
 * Derive the category for the content schema.
 * Webkit components live under `form/` or root — map to valid schema values.
 */
function deriveCategory(info: WebkitComponentInfo): string {
  const categoryMap: Record<string, string> = {
    form: 'form',
    navigation: 'navigation',
    feedback: 'feedback',
    layout: 'layout',
    utility: 'utility',
  };
  return categoryMap[info.category] ?? 'form';
}

/**
 * Convert camelCase prop name to Title Case label: aditionalError → Aditional Error
 */
function camelToTitleCase(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
}

/**
 * Extract string literal options from a union type like `'primary' | 'secondary'`.
 * Returns an empty array if none found.
 */
function extractStringLiteralUnion(type: string): string[] {
  const options: string[] = [];
  const regex = /'([^']+)'/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(type)) !== null) {
    options.push(match[1]);
  }
  return options;
}

/**
 * Props that carry no value in a playground context and should be omitted.
 */
const SKIP_PROPS = new Set(['class']);

/**
 * Convert extracted PropDefinition[] to Playground PropsDefinition format.
 * Maps Vue runtime types to Playground control types.
 */
function buildPropsDefinition(props: PropDefinition[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const prop of props) {
    if (SKIP_PROPS.has(prop.name)) continue;

    const label = camelToTitleCase(prop.name);
    const category = prop.required ? 'Required' : 'Optional';
    const base = {
      label,
      description: prop.description || '',
      required: prop.required,
      category,
    };

    const t = prop.type ?? '';

    if (t === 'Function' || t === 'function') {
      // Function props cannot be serialized in JSON; Playground will inject stubs at runtime.
      result[prop.name] = {
        ...base,
        type: 'function',
        control: 'none',
        default: undefined,
      };
      continue;
    }
    if (t === 'boolean') {
      result[prop.name] = {
        ...base,
        type: 'boolean',
        control: 'boolean',
        default: prop.default === 'true' ? true : false,
      };
    } else if (t === 'number') {
      result[prop.name] = {
        ...base,
        type: 'number',
        control: 'number',
        default: prop.default ? Number(prop.default) : 0,
      };
    } else if (t.includes('|')) {
      // Try string literal union → select control
      const options = extractStringLiteralUnion(t);
      if (options.length > 0) {
        result[prop.name] = {
          ...base,
          type: 'enum',
          control: 'select',
          options,
          default: prop.default ?? options[0] ?? '',
        };
      } else {
        // Non-literal union (e.g. string | number) → text
        result[prop.name] = {
          ...base,
          type: 'string',
          control: 'text',
          default: prop.default ?? '',
        };
      }
    } else {
      // string, unknown, any[], object, etc. → text
      // For 'name' prop (required by vee-validate fields), provide a useful default
      const defaultVal =
        prop.name === 'name' && !prop.default ? 'preview' : (prop.default ?? '');
      result[prop.name] = {
        ...base,
        type: 'string',
        control: 'text',
        default: defaultVal,
      };
    }
  }

  return result;
}

/**
 * Read the webkit package.json exports map.
 * Returns a map from export key (e.g. "field-text") → export path.
 */
function readWebkitExports(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(WEBKIT_PKG_JSON)) return map;

  const pkg = JSON.parse(fs.readFileSync(WEBKIT_PKG_JSON, 'utf-8'));
  const exports = pkg.exports ?? {};
  for (const [key, val] of Object.entries(exports)) {
    if (typeof val === 'string' && key.startsWith('./')) {
      map.set(key.slice(2), val as string);
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// MDX template
// ---------------------------------------------------------------------------

function buildMdxContent(info: WebkitComponentInfo): string {
  const title = deriveTitle(info);
  const category = deriveCategory(info);
  const displayName = toPascalCase(info.exportKey);

  return `---
title: "${title}"
description: "${title} component from the Azion Design System."
navLabel: "${title}"
order: 999
type: component
status: experimental
component: ${displayName}
category: ${category}
apiFrom: "${info.slug}"
---

import { Playground } from '@components/docs';
import componentProps from '@/generated/component-props/${info.slug}.json';

<Playground
  client:only="vue"
  component-name="${displayName}"
  props={componentProps}
/>
`;
}

// ---------------------------------------------------------------------------
// Playground registry generator
// ---------------------------------------------------------------------------

/**
 * Generate the static playground registry TypeScript file.
 * Produces two maps:
 *   - webkitComponentLoaders: slug → dynamic import (for WebkitPreview / raw usage)
 *   - webkitComponentByName:  PascalCase displayName → dynamic import (for Playground registry)
 * Each entry uses a static import expression so Vite can statically analyze all paths.
 */
function buildPlaygroundRegistry(
  components: WebkitComponentInfo[],
  webkitExports: Map<string, string>,
): string {
  const exported = components.filter((c) => webkitExports.has(c.exportKey));

  const lines: string[] = [
    '/**',
    ' * Playground Registry — Auto-generated by scripts/scaffoldComponentDocs.ts',
    ' * Do not edit manually. Regenerate with: pnpm build:scaffold',
    ' */',
    '',
    '// ---------------------------------------------------------------------------',
    '// Slug-keyed map (used by WebkitPreview for raw lookup)',
    '// ---------------------------------------------------------------------------',
    'export const webkitComponentLoaders: Record<string, () => Promise<{ default: any }>> = {',
  ];
  for (const comp of exported) {
    lines.push(`  '${comp.slug}': () => import('@aziontech/webkit/${comp.exportKey}'),`);
  }
  lines.push('};', '');

  lines.push(
    '// ---------------------------------------------------------------------------',
    '// Display-name-keyed map (used by Playground.vue component registry)',
    '// ---------------------------------------------------------------------------',
    'export const webkitComponentByName: Record<string, () => Promise<{ default: any }>> = {',
  );
  for (const comp of exported) {
    const displayName = toPascalCase(comp.exportKey);
    lines.push(`  '${displayName}': () => import('@aziontech/webkit/${comp.exportKey}'),`);
  }
  lines.push('};', '');

  lines.push(
    '/**',
    ' * Registry metadata for each webkit component.',
    ' */',
    'export interface WebkitRegistryEntry {',
    '  slug: string;',
    '  exportKey: string;',
    '  displayName: string;',
    '  category: string;',
    '}',
    '',
    'export const webkitRegistry: WebkitRegistryEntry[] = [',
  );
  for (const comp of components) {
    const displayName = toPascalCase(comp.exportKey);
    lines.push(
      `  { slug: '${comp.slug}', exportKey: '${comp.exportKey}', displayName: '${displayName}', category: '${comp.category}' },`,
    );
  }
  lines.push('];', '');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main orchestration
// ---------------------------------------------------------------------------

interface ScaffoldOptions {
  dryRun: boolean;
  force: boolean;
  verbose: boolean;
}

async function scaffold(opts: ScaffoldOptions): Promise<void> {
  const { dryRun, force, verbose } = opts;

  console.log('');
  console.log('=== Component Documentation Scaffold ===');
  if (dryRun) console.log('  (dry run — no files will be written)');
  console.log('');

  // 1. Verify at least one webkit source dir exists
  if (!fs.existsSync(WEBKIT_CORE_DIR) && !fs.existsSync(WEBKIT_COMPONENTS_DIR)) {
    console.error(`ERROR: webkit source not found. Looked for:`);
    console.error(`  ${WEBKIT_CORE_DIR}`);
    console.error(`  ${WEBKIT_COMPONENTS_DIR}`);
    console.error('       Make sure you are running this script from apps/ds-docs.');
    process.exit(1);
  }

  // 2. Discover webkit components from both core and components dirs
  const fromCore = fs.existsSync(WEBKIT_CORE_DIR)
    ? discoverWebkitComponents(WEBKIT_CORE_DIR)
    : [];
  const fromComponents = fs.existsSync(WEBKIT_COMPONENTS_DIR)
    ? discoverWebkitComponents(WEBKIT_COMPONENTS_DIR)
    : [];
  const components = [...fromCore, ...fromComponents].sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
  console.log(`Discovered ${components.length} webkit component(s) (core: ${fromCore.length}, components: ${fromComponents.length}):`);
  if (verbose) {
    for (const c of components) {
      console.log(`  • ${c.slug} (export: ${c.exportKey})`);
    }
    console.log('');
  }

  // 3. Read webpack exports map
  const webkitExports = readWebkitExports();

  // 4. Extract API and write JSON files (from both core and components)
  console.log('\nExtracting component APIs...');
  let extractedApis: ReturnType<typeof extractWebkitCore>['apis'] = [];
  if (!dryRun) {
    fs.mkdirSync(API_OUTPUT_DIR, { recursive: true });
    if (fs.existsSync(WEBKIT_CORE_DIR)) {
      const resultCore = extractWebkitCore(WEBKIT_CORE_DIR, API_OUTPUT_DIR);
      extractedApis.push(...resultCore.apis);
    }
    if (fs.existsSync(WEBKIT_COMPONENTS_DIR)) {
      const resultComponents = extractWebkitCore(WEBKIT_COMPONENTS_DIR, API_OUTPUT_DIR);
      extractedApis.push(...resultComponents.apis);
    }
  } else {
    console.log('  (skipped in dry-run mode)');
    try {
      if (fs.existsSync(WEBKIT_CORE_DIR)) {
        const r = extractWebkitCore(WEBKIT_CORE_DIR, API_OUTPUT_DIR);
        extractedApis.push(...r.apis);
      }
      if (fs.existsSync(WEBKIT_COMPONENTS_DIR)) {
        const r = extractWebkitCore(WEBKIT_COMPONENTS_DIR, API_OUTPUT_DIR);
        extractedApis.push(...r.apis);
      }
    } catch {
      // ignore in dry-run
    }
  }

  // 5. Generate PropsDefinition JSON for each component (used by Playground)
  console.log('\nGenerating PropsDefinition files...');
  if (!dryRun) {
    fs.mkdirSync(PROPS_OUTPUT_DIR, { recursive: true });
    for (const api of extractedApis) {
      const overridePath = path.join(PROPS_OVERRIDES_DIR, `${api.component}.json`);
      const outPath = path.join(PROPS_OUTPUT_DIR, `${api.component}.json`);
      if (fs.existsSync(overridePath)) {
        fs.copyFileSync(overridePath, outPath);
        if (verbose) console.log(`  Wrote props (override): ${api.component}.json`);
      } else {
        const propsDef = buildPropsDefinition(api.props);
        fs.writeFileSync(outPath, JSON.stringify(propsDef, null, 2), 'utf-8');
        if (verbose) console.log(`  Wrote props: ${api.component}.json`);
      }
    }
    console.log(`  Wrote PropsDefinition for ${extractedApis.length} component(s)`);
  } else {
    console.log('  (skipped in dry-run mode)');
  }

  // 7. Scaffold missing .mdx doc pages (EN and PT)
  console.log('\nScaffolding documentation pages...');
  fs.mkdirSync(CONTENT_EN_COMPONENTS, { recursive: true });
  fs.mkdirSync(CONTENT_PT_COMPONENTS, { recursive: true });

  const created: string[] = [];
  const skipped: string[] = [];

  for (const comp of components) {
    const content = buildMdxContent(comp);
    const mdxPath = path.join(CONTENT_EN_COMPONENTS, `${comp.slug}.mdx`);
    const exists = fs.existsSync(mdxPath);

    if (exists && !force) {
      skipped.push(comp.slug);
      if (verbose) console.log(`  SKIP (exists): ${comp.slug}.mdx`);
    } else {
      if (!dryRun) {
        fs.writeFileSync(mdxPath, content, 'utf-8');
      }
      if (exists && force) {
        console.log(`  OVERWRITE: ${comp.slug}.mdx (en)`);
      } else {
        console.log(`  CREATE: ${comp.slug}.mdx (en)`);
      }
      created.push(comp.slug);
    }

    // PT mirror (same content; titles can be translated later)
    const mdxPathPt = path.join(CONTENT_PT_COMPONENTS, `${comp.slug}.mdx`);
    if (!dryRun) {
      fs.writeFileSync(mdxPathPt, content, 'utf-8');
    }
    if (verbose) console.log(`  SYNC: ${comp.slug}.mdx (pt)`);
  }

  // 8. Generate playground registry
  console.log('\nGenerating playground registry...');
  const registryContent = buildPlaygroundRegistry(components, webkitExports);

  if (!dryRun) {
    fs.mkdirSync(path.dirname(REGISTRY_OUTPUT), { recursive: true });
    fs.writeFileSync(REGISTRY_OUTPUT, registryContent, 'utf-8');
    console.log(`  Wrote: ${path.relative(CWD, REGISTRY_OUTPUT)}`);
  } else {
    console.log('  (skipped in dry-run mode)');
  }

  // 7. Summary
  console.log('');
  console.log('=== Summary ===');
  console.log(`  Components discovered : ${components.length}`);
  console.log(`  Doc pages created     : ${created.length}`);
  console.log(`  Doc pages skipped     : ${skipped.length} (already exist)`);
  if (skipped.length > 0 && verbose) {
    console.log(`    Skipped: ${skipped.join(', ')}`);
  }
  console.log('');

  if (created.length === 0 && !dryRun) {
    console.log('All components are already documented. Nothing to scaffold.');
  } else if (!dryRun) {
    console.log(
      'Done! New doc pages added. Review them in src/content/v1/en/components/ and enhance as needed.',
    );
  }
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const opts: ScaffoldOptions = {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    verbose: args.includes('--verbose') || args.includes('-v'),
  };

  await scaffold(opts);
}

const isCjsMain = typeof require !== 'undefined' && require.main === module;
const isEsmMain =
  typeof import.meta !== 'undefined' &&
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isCjsMain || isEsmMain) {
  main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}

#!/usr/bin/env node
/**
 * Generate Preview Examples
 *
 * Patches src/generated/component-props/*.json with example defaults so
 * Playground previews render with meaningful content (labels, placeholders,
 * descriptions, options) instead of empty fields.
 *
 * Run after scaffold: pnpm build:preview-examples
 * Full pipeline: pnpm build:scaffold:full
 *
 * CLI: --dry-run (no writes), --verbose (-v)
 */

import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

const CWD = process.cwd();
const PROPS_OUTPUT_DIR = path.resolve(CWD, 'src/generated/component-props');

// ---------------------------------------------------------------------------
// Prop name heuristics: common prop names → example values for preview
// ---------------------------------------------------------------------------

const PROP_NAME_EXAMPLES: Record<string, string> = {
  label: 'Label',
  placeholder: 'Type here...',
  description: 'Brief description of the field.',
  title: 'Title',
  subtitle: 'Subtitle',
  helpText: 'This is a help text.',
  nameField: 'example-field',
  nameId: 'example-id',
  emptyMessage: 'No available options',
  emptyFilterMessage: 'No results found',
  optionLabel: 'label',
  optionValue: 'value',
  /** PrimeVue icon class for icon prop/slot previews */
  icon: 'pi pi-box',
};

// ---------------------------------------------------------------------------
// Component-specific overrides: slug → { propName: exampleValue }
// ---------------------------------------------------------------------------

/** Generic options for dropdowns, multi-select, and any list of items */
const GENERIC_OPTIONS_JSON = JSON.stringify([
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
]);

const COMPONENT_SPECIFIC_OVERRIDES: Record<string, Record<string, string>> = {
  'form-field-dropdown': {
    options: GENERIC_OPTIONS_JSON,
  },
  'form-field-multi-select': {
    options: GENERIC_OPTIONS_JSON,
  },
  'form-field-group-checkbox': {
    options: GENERIC_OPTIONS_JSON,
  },
  'form-field-group-radio': {
    options: GENERIC_OPTIONS_JSON,
  },
  'form-field-checkbox-block': {
    title: 'Option title',
    description: 'Optional description text.',
  },
  'selector-block': {
    title: 'Option title',
    subtitle: 'Subtitle',
    description: 'Short description.',
  },
  'form-field-auto-complete': {
    suggestions: GENERIC_OPTIONS_JSON,
  },
  'form-field-dropdown-icon': {
    suggestions: GENERIC_OPTIONS_JSON,
  },
  'form-field-pick-list': {
    dataPick: '[[], []]',
    dataKey: 'value',
  },
  'form-field-dropdown-lazy-loader-dynamic': {
    initalData: GENERIC_OPTIONS_JSON,
  },
  'form-field-dropdown-lazy-loader-with-filter': {
    keyToFilter: 'id',
    valuesToFilter: '["a","b","c"]',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isEmptyOrTrivial(val: unknown): boolean {
  if (val === undefined || val === null) return true;
  if (typeof val === 'string') return val.trim() === '';
  if (typeof val === 'object' && Array.isArray(val)) return val.length === 0;
  return false;
}

interface PropEntry {
  label: string;
  description: string;
  required: boolean;
  category: string;
  type: string;
  control: string;
  default?: unknown;
  options?: string[];
  optionLabels?: Record<string, string>;
}

function patchPropsFile(slug: string, opts: { dryRun: boolean; verbose: boolean }): boolean {
  const filePath = path.join(PROPS_OUTPUT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return false;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const props: Record<string, PropEntry> = JSON.parse(raw);
  let changed = false;

  const componentOverrides = COMPONENT_SPECIFIC_OVERRIDES[slug];

  for (const [propName, entry] of Object.entries(props)) {
    if (typeof entry !== 'object' || entry === null) continue;
    const control = (entry as PropEntry).control;
    if (control === 'none' || control === 'boolean') continue;

    const currentDefault = (entry as PropEntry).default;
    let newDefault: string | undefined;

    // 1. Component-specific override
    if (componentOverrides && propName in componentOverrides) {
      newDefault = componentOverrides[propName];
    }
    // 2. Prop name heuristic (only for empty/trivial defaults)
    else if (PROP_NAME_EXAMPLES[propName] !== undefined && isEmptyOrTrivial(currentDefault)) {
      newDefault = PROP_NAME_EXAMPLES[propName];
    }

    if (newDefault !== undefined && String(currentDefault) !== newDefault) {
      (entry as PropEntry).default = newDefault;
      changed = true;
      if (opts.verbose) {
        console.log(`    ${propName}: "${String(currentDefault)}" → "${newDefault}"`);
      }
    }
  }

  if (changed && !opts.dryRun) {
    fs.writeFileSync(filePath, JSON.stringify(props, null, 2), 'utf-8');
  }
  return changed;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface Options {
  dryRun: boolean;
  verbose: boolean;
}

async function run(opts: Options): Promise<void> {
  const { dryRun, verbose } = opts;

  console.log('');
  console.log('=== Generate Preview Examples ===');
  if (dryRun) console.log('  (dry run — no files will be written)');
  console.log('');

  if (!fs.existsSync(PROPS_OUTPUT_DIR)) {
    console.error(`ERROR: Props directory not found: ${PROPS_OUTPUT_DIR}`);
    console.error('       Run pnpm build:scaffold first.');
    process.exit(1);
  }

  const files = fs.readdirSync(PROPS_OUTPUT_DIR).filter((f) => f.endsWith('.json'));
  let patched = 0;

  for (const file of files.sort()) {
    const slug = file.replace(/\.json$/, '');
    if (verbose) console.log(`  ${slug}.json`);
    const changed = patchPropsFile(slug, opts);
    if (changed) {
      patched++;
      if (!verbose) console.log(`  Patched: ${slug}.json`);
    }
  }

  console.log('');
  console.log('=== Summary ===');
  console.log(`  Files processed : ${files.length}`);
  console.log(`  Files patched   : ${patched}`);
  console.log('');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const opts: Options = {
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose') || args.includes('-v'),
  };
  await run(opts);
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

export { run, patchPropsFile, PROP_NAME_EXAMPLES, COMPONENT_SPECIFIC_OVERRIDES };

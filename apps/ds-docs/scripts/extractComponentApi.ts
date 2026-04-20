#!/usr/bin/env node
/**
 * Automatic API Extraction for Vue Components
 * 
 * Extracts component API information (props, events, slots) from Vue components
 * and generates JSON metadata files for documentation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

/**
 * Prop definition
 */
interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
}

/**
 * Event definition
 */
interface EventDefinition {
  name: string;
  payload: string | null;
  description: string;
}

/**
 * Slot definition
 */
interface SlotDefinition {
  name: string;
  description: string;
  props?: string;
}

/**
 * Component API
 */
interface ComponentApi {
  component: string;
  source: string;
  props: PropDefinition[];
  events: EventDefinition[];
  slots: SlotDefinition[];
  extractedAt: string;
}

/**
 * Extraction options
 */
interface ExtractionOptions {
  /** Components directory */
  componentsDir: string;
  /** Output directory for generated JSON files */
  outputDir: string;
  /** File patterns to ignore */
  ignorePatterns?: RegExp[];
}

/**
 * Default options
 */
const DEFAULT_OPTIONS: ExtractionOptions = {
  componentsDir: 'src/components',
  outputDir: 'src/generated/component-api',
  ignorePatterns: [
    /index\.ts$/,
    /index\.js$/,
    /\.d\.ts$/,
    /\.spec\.ts$/,
    /\.test\.ts$/,
    /\.stories\.ts$/,
    /\.stories\.js$/,
  ],
};

/**
 * Extract content between first occurrence of openTag and closeTag (no regex on HTML)
 */
function extractBetween(content: string, openTag: string, closeTag: string): string {
  const start = content.indexOf(openTag);
  if (start === -1) return '';
  const contentStart = start + openTag.length;
  const end = content.indexOf(closeTag, contentStart);
  if (end === -1) return '';
  return content.slice(contentStart, end);
}

/**
 * Parse Vue SFC content using tag boundaries (avoids regex HTML parsing for security)
 */
function parseVueSfc(content: string): {
  script: string;
  scriptSetup: string;
  template: string;
  style: string;
} {
  const result = { script: '', scriptSetup: '', template: '', style: '' };
  const scriptClose = '</script>';
  const templateClose = '</template>';
  const styleClose = '</style>';

  // Extract all <script>...</script> blocks
  let pos = 0;
  while (true) {
    const scriptOpen = content.indexOf('<script', pos);
    if (scriptOpen === -1) break;
    const tagEnd = content.indexOf('>', scriptOpen);
    if (tagEnd === -1) break;
    const tag = content.slice(scriptOpen, tagEnd + 1);
    const contentStart = tagEnd + 1;
    const closeIdx = content.indexOf(scriptClose, contentStart);
    if (closeIdx === -1) break;
    const blockContent = content.slice(contentStart, closeIdx);
    if (tag.includes('setup')) {
      result.scriptSetup = blockContent;
    } else {
      result.script = blockContent;
    }
    pos = closeIdx + scriptClose.length;
  }

  // Extract <template>...</template>
  const templateOpen = content.indexOf('<template');
  if (templateOpen !== -1) {
    const templateContentStart = content.indexOf('>', templateOpen) + 1;
    if (templateContentStart > 0) {
      result.template = extractBetween(content.slice(templateContentStart), '', templateClose);
    }
  }

  // Extract <style>...</style>
  const styleOpen = content.indexOf('<style');
  if (styleOpen !== -1) {
    const styleContentStart = content.indexOf('>', styleOpen) + 1;
    if (styleContentStart > 0) {
      result.style = extractBetween(content.slice(styleContentStart), '', styleClose);
    }
  }

  return result;
}

/**
 * Extract props from defineProps
 */
function extractDefineProps(scriptSetup: string): PropDefinition[] {
  const props: PropDefinition[] = [];

  // Match defineProps with object syntax
  const withObjectMatch = scriptSetup.match(/defineProps\s*<\s*{\s*([^}]+)\s*}\s*>/);
  if (withObjectMatch) {
    const propsContent = withObjectMatch[1];
    // Parse each prop
    const propMatches = Array.from(propsContent.matchAll(/(\w+)\s*(?:\?)?\s*:\s*([^;,\n]+)/g));
    for (const match of propMatches) {
      const name = match[1];
      const type = match[2].trim();
      props.push({
        name,
        type: type.replace(/\|/g, ' | '),
        required: !match[0].includes('?'),
        default: null,
        description: '',
      });
    }
  }

  // Match defineProps with interface
  const interfaceMatch = scriptSetup.match(/interface\s+\w+Props\s*{([^}]+)}/);
  if (interfaceMatch) {
    const propsContent = interfaceMatch[1];
    const propMatches = Array.from(propsContent.matchAll(/(\w+)\s*(\?)?\s*:\s*([^;,\n]+)/g));
    for (const match of propMatches) {
      const name = match[1];
      const type = match[3].trim();
      props.push({
        name,
        type: type.replace(/\|/g, ' | '),
        required: !match[2],
        default: null,
        description: '',
      });
    }
  }

  // Match withPropsDefaults pattern
  const withDefaultsMatch = scriptSetup.match(/withDefaults\s*\(\s*defineProps\s*<\s*([^>]+)\s*>\s*\(\s*\)\s*,\s*{\s*([^}]+)\s*}\s*\)/);
  if (withDefaultsMatch) {
    // Extract defaults
    const defaultsContent = withDefaultsMatch[2];
    const defaultMatches = Array.from(defaultsContent.matchAll(/(\w+)\s*:\s*(?:\(\)\s*=>\s*)?([^,}\n]+)/g));
    const defaults: Record<string, string> = {};
    
    for (const match of defaultMatches) {
      defaults[match[1]] = match[2].trim().replace(/['"]/g, '');
    }

    // Apply defaults to props
    for (const prop of props) {
      if (prop.name in defaults) {
        prop.default = defaults[prop.name];
      }
    }
  }

  return props;
}

/**
 * Extract props from Options API
 */
function extractOptionsApiProps(script: string): PropDefinition[] {
  const props: PropDefinition[] = [];

  // Match props object
  const propsMatch = script.match(/props\s*:\s*{([\s\S]*?)}/);
  if (propsMatch) {
    const propsContent = propsMatch[1];
    
    // Parse each prop definition
    const propDefMatches = Array.from(propsContent.matchAll(/(\w+)\s*:\s*{([^}]+)}/g));
    for (const match of propDefMatches) {
      const name = match[1];
      const def = match[2];
      
      const typeMatch = def.match(/type\s*:\s*([^,}\n]+)/);
      const requiredMatch = def.match(/required\s*:\s*(true|false)/);
      const defaultMatch = def.match(/default\s*:\s*(?:function\s*\(\)\s*{[^}]*}|[^,}\n]+)/);
      
      props.push({
        name,
        type: typeMatch ? typeMatch[1].trim() : 'unknown',
        required: requiredMatch ? requiredMatch[1] === 'true' : false,
        default: defaultMatch ? defaultMatch[1].trim() : null,
        description: '',
      });
    }

    // Match simple array props syntax
    const arrayPropsMatch = script.match(/props\s*:\s*\[([^\]]+)\]/);
    if (arrayPropsMatch) {
      const propNames = arrayPropsMatch[1].split(',').map((p) => p.trim().replace(/['"]/g, ''));
      for (const name of propNames) {
        props.push({
          name,
          type: 'unknown',
          required: false,
          default: null,
          description: '',
        });
      }
    }
  }

  return props;
}

/**
 * Extract events from defineEmits
 */
function extractDefineEmits(scriptSetup: string): EventDefinition[] {
  const events: EventDefinition[] = [];

  // Match defineEmits with array syntax
  const arrayMatch = scriptSetup.match(/defineEmits\s*\(\s*\[([^\]]+)\]\s*\)/);
  if (arrayMatch) {
    const eventNames = arrayMatch[1].split(',').map((e) => e.trim().replace(/['"]/g, ''));
    for (const name of eventNames) {
      events.push({
        name,
        payload: null,
        description: '',
      });
    }
  }

  // Match defineEmits with object/record syntax
  const objectMatch = scriptSetup.match(/defineEmits\s*<\s*{([^}]+)}\s*>/);
  if (objectMatch) {
    const eventsContent = objectMatch[1];
    const eventMatches = Array.from(eventsContent.matchAll(/['"](\w+)['"]\s*:\s*\[([^\]]+)\]/g));
    
    for (const match of eventMatches) {
      events.push({
        name: match[1],
        payload: match[2].trim(),
        description: '',
      });
    }
  }

  // Match defineEmits with type
  const typeMatch = scriptSetup.match(/defineEmits\s*<\s*([^>]+)\s*>/);
  if (typeMatch && !objectMatch) {
    const typeContent = typeMatch[1];
    // Try to extract event names from type
    const eventNameMatches = Array.from(typeContent.matchAll(/['"](\w+)['"]/g));
    for (const match of eventNameMatches) {
      if (!events.some((e) => e.name === match[1])) {
        events.push({
          name: match[1],
          payload: null,
          description: '',
        });
      }
    }
  }

  return events;
}

/**
 * Extract events from Options API
 */
function extractOptionsApiEmits(script: string): EventDefinition[] {
  const events: EventDefinition[] = [];

  // Match emits array
  const emitsMatch = script.match(/emits\s*:\s*\[([^\]]+)\]/);
  if (emitsMatch) {
    const eventNames = emitsMatch[1].split(',').map((e) => e.trim().replace(/['"]/g, ''));
    for (const name of eventNames) {
      events.push({
        name,
        payload: null,
        description: '',
      });
    }
  }

  // Match emits object
  const emitsObjectMatch = script.match(/emits\s*:\s*{([\s\S]*?)}/);
  if (emitsObjectMatch) {
    const emitsContent = emitsObjectMatch[1];
    const eventMatches = Array.from(emitsContent.matchAll(/['"]?(\w+)['"]?\s*(?::\s*function|\([^)]*\)\s*{)/g));
    
    for (const match of eventMatches) {
      events.push({
        name: match[1],
        payload: null,
        description: '',
      });
    }
  }

  return events;
}

/**
 * Extract slots from template
 */
function extractSlots(template: string): SlotDefinition[] {
  const slots: SlotDefinition[] = [];

  // Match slot definitions
  const slotMatches = Array.from(template.matchAll(/<slot\s+name=["']([^"']+)["'][^>]*>/g));
  for (const match of slotMatches) {
    slots.push({
      name: match[1],
      description: '',
    });
  }

  // Match default slot
  if (template.includes('<slot>') || template.includes('<slot ')) {
    if (!slots.some((s) => s.name === 'default')) {
      slots.unshift({
        name: 'default',
        description: '',
      });
    }
  }

  return slots;
}

/**
 * Normalize Vue runtime constructor types to TypeScript equivalents
 */
function normalizeVueType(rawType: string): string {
  const typeMap: Record<string, string> = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
    Array: 'any[]',
    Object: 'object',
    Function: 'Function',
    Symbol: 'symbol',
    Date: 'Date',
    RegExp: 'RegExp',
  };
  const trimmed = rawType.trim();
  // Handle Vue array union syntax: [String, Number] => string | number
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1);
    return inner
      .split(',')
      .map((t) => typeMap[t.trim()] ?? t.trim())
      .join(' | ');
  }
  return typeMap[trimmed] ?? trimmed;
}

/**
 * Parse top-level object entries using bracket counting.
 * Handles entries where values may be nested objects.
 * Returns pairs of [key, valueContent] where valueContent is the inner
 * content of the value (without surrounding braces if it is an object).
 */
function parseShallowObjectEntries(content: string): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  let i = 0;

  while (i < content.length) {
    // skip whitespace and commas
    while (i < content.length && /[\s,]/.test(content[i])) i++;
    if (i >= content.length) break;

    // match identifier key
    const nameMatch = content.slice(i).match(/^(\w+)\s*:/);
    if (!nameMatch) { i++; continue; }
    const propName = nameMatch[1];
    i += nameMatch[0].length;

    // skip whitespace
    while (i < content.length && /\s/.test(content[i])) i++;
    if (i >= content.length) break;

    if (content[i] === '{') {
      // extract nested object
      let depth = 0;
      const start = i;
      while (i < content.length) {
        if (content[i] === '{') depth++;
        else if (content[i] === '}') {
          depth--;
          if (depth === 0) { i++; break; }
        }
        i++;
      }
      // pass inner content (without surrounding braces)
      entries.push([propName, content.slice(start + 1, i - 1)]);
    } else {
      // simple value: read until next top-level comma
      const start = i;
      while (i < content.length && content[i] !== ',') i++;
      entries.push([propName, content.slice(start, i).trim()]);
    }
  }

  return entries;
}

/**
 * Extract props from Vue 3 runtime defineProps object syntax.
 * Handles: defineProps({ propName: { type: String, required: true, default: 'val' } })
 */
function extractRuntimeDefineProps(scriptSetup: string): PropDefinition[] {
  const props: PropDefinition[] = [];

  // Find defineProps({ — the object/runtime form (not the TypeScript generic <{...}>)
  const runtimeIdx = scriptSetup.search(/defineProps\s*\(\s*\{/);
  if (runtimeIdx === -1) return props;

  // Find the opening { position
  let openIdx = scriptSetup.indexOf('{', runtimeIdx + 'defineProps'.length);
  if (openIdx === -1) return props;

  // Find the matching closing }
  let depth = 0;
  let closeIdx = -1;
  for (let i = openIdx; i < scriptSetup.length; i++) {
    if (scriptSetup[i] === '{') depth++;
    else if (scriptSetup[i] === '}') {
      depth--;
      if (depth === 0) { closeIdx = i; break; }
    }
  }
  if (closeIdx === -1) return props;

  const propsContent = scriptSetup.slice(openIdx + 1, closeIdx);
  const propEntries = parseShallowObjectEntries(propsContent);

  for (const [name, valueStr] of propEntries) {
    if (!name) continue;

    const typeMatch = valueStr.match(/\btype\s*:\s*([^\n,}]+)/);
    const requiredMatch = valueStr.match(/\brequired\s*:\s*(true|false)/);
    // default: capture value until next prop key or end, supporting arrow functions
    const defaultMatch = valueStr.match(/\bdefault\s*:\s*([\s\S]+?)(?=(?:,\s*\w+\s*:)|\s*$)/);

    let type = 'unknown';
    if (typeMatch) {
      type = normalizeVueType(typeMatch[1].trim());
    }

    let defaultVal: string | null = null;
    if (defaultMatch) {
      const raw = defaultMatch[1].trim();
      // clean up arrow functions: () => [] => []
      defaultVal = raw.replace(/^\(\)\s*=>\s*/, '').replace(/^['"]|['"]$/g, '').trim() || null;
    }

    props.push({
      name,
      type,
      required: requiredMatch ? requiredMatch[1] === 'true' : false,
      default: defaultVal,
      description: '',
    });
  }

  return props;
}

/**
 * Extract JSDoc comments for documentation
 */
function extractJsDocComments(content: string): Map<string, string> {
  const comments = new Map<string, string>();
  
  // Match JSDoc comments
  const jsDocMatches = Array.from(content.matchAll(/\/\*\*([\s\S]*?)\*\/\s*(?:const|let|var|function|interface|type)\s+(\w+)/g));
  for (const match of jsDocMatches) {
    const comment = match[1]
      .split('\n')
      .map((line: string) => line.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean)
      .join(' ');
    comments.set(match[2], comment);
  }

  return comments;
}

/**
 * Extract API from a Vue component file
 */
function extractComponentApi(
  filePath: string,
  componentName: string
): ComponentApi {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { script, scriptSetup, template } = parseVueSfc(content);

  // Extract from script setup
  let props = extractDefineProps(scriptSetup);
  let events = extractDefineEmits(scriptSetup);

  // Try runtime defineProps({ ... }) if TypeScript-style produced nothing
  if (props.length === 0 && scriptSetup) {
    props = extractRuntimeDefineProps(scriptSetup);
  }

  // Extract from Options API if no script setup
  if (props.length === 0 && script) {
    props = extractOptionsApiProps(script);
  }
  if (events.length === 0 && script) {
    events = extractOptionsApiEmits(script);
  }

  // Extract slots from template
  const slots = extractSlots(template);

  // Extract JSDoc comments for descriptions
  const jsDocComments = extractJsDocComments(script || scriptSetup);
  
  // Apply descriptions to props
  for (const prop of props) {
    if (jsDocComments.has(prop.name)) {
      prop.description = jsDocComments.get(prop.name) || '';
    }
  }

  return {
    component: componentName,
    source: filePath,
    props,
    events,
    slots,
    extractedAt: new Date().toISOString(),
  };
}

/**
 * Get all Vue component files
 */
function getVueComponentFiles(
  dir: string,
  ignorePatterns: RegExp[]
): Array<{ name: string; path: string }> {
  const components: Array<{ name: string; path: string }> = [];

  if (!fs.existsSync(dir)) {
    return components;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Check for component file in directory
      const files = fs.readdirSync(fullPath);
      const vueFile = files.find(
        (f) => f.endsWith('.vue') && !ignorePatterns.some((p) => p.test(f))
      );

      if (vueFile) {
        const componentName = entry.name;
        components.push({
          name: componentName,
          path: path.join(fullPath, vueFile),
        });
      }

      // Recursively check subdirectories
      components.push(...getVueComponentFiles(fullPath, ignorePatterns));
    } else if (entry.name.endsWith('.vue') && !ignorePatterns.some((p) => p.test(entry.name))) {
      // Standalone Vue file
      const componentName = entry.name.replace('.vue', '');
      components.push({
        name: componentName,
        path: fullPath,
      });
    }
  }

  return components;
}

/**
 * Extract API from all components
 */
export function extractAllComponentApis(options: Partial<ExtractionOptions> = {}): ComponentApi[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const apis: ComponentApi[] = [];

  const components = getVueComponentFiles(
    opts.componentsDir,
    opts.ignorePatterns || []
  );

  for (const { name, path: componentPath } of components) {
    try {
      const api = extractComponentApi(componentPath, name);
      apis.push(api);
    } catch (error) {
      console.error(`Error extracting API from ${componentPath}:`, error);
    }
  }

  return apis;
}

/**
 * Write API JSON files.
 * Only writes the given apis; does not delete other files in outputDir
 * (webkit and ds-docs may both write to the same directory).
 */
export function writeApiJsonFiles(
  apis: ComponentApi[],
  outputDir: string
): void {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const api of apis) {
    const outputPath = path.join(outputDir, `${api.component.toLowerCase()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(api, null, 2));
    console.log(`Generated: ${outputPath}`);
  }
}

/**
 * Discovered webkit component info
 */
export interface WebkitComponentInfo {
  /** Slug used for docs, filenames, and the playground registry (e.g. 'form-field-text') */
  slug: string;
  /** Path to the .vue file */
  vuePath: string;
  /** Webkit package export key, e.g. 'field-text' */
  exportKey: string;
  /** Category derived from parent directory, e.g. 'form' */
  category: string;
}

/**
 * Recursively walk webkit core directory and collect component entries.
 */
function walkWebkitCore(
  dir: string,
  rootDir: string,
  results: WebkitComponentInfo[],
): void {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  let vueFile: string | null = null;
  for (const entry of entries) {
    if (!entry.isDirectory() && entry.name.endsWith('.vue')) {
      vueFile = path.join(dir, entry.name);
    }
  }

  if (vueFile) {
    const relPath = path.relative(rootDir, dir).replace(/\\/g, '/');
    const slug = relPath.replace(/\//g, '-');
    const exportKey = path.basename(dir);
    // Category = first path segment if there are multiple segments; else the slug itself
    const segments = relPath.split('/');
    const category = segments.length > 1 ? segments[0] : 'ui';
    results.push({ slug, vuePath: vueFile, exportKey, category });
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      walkWebkitCore(path.join(dir, entry.name), rootDir, results);
    }
  }
}

/**
 * Discover all webkit components under the given core directory.
 */
export function discoverWebkitComponents(coreDir: string): WebkitComponentInfo[] {
  const results: WebkitComponentInfo[] = [];
  walkWebkitCore(coreDir, coreDir, results);
  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Extract API from all discovered webkit components and write JSON files.
 * Uses the component's slug as the output file name.
 */
export function extractWebkitCore(
  webkitCoreDir: string,
  outputDir: string,
): { components: WebkitComponentInfo[]; apis: ComponentApi[] } {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const components = discoverWebkitComponents(webkitCoreDir);
  const apis: ComponentApi[] = [];

  for (const { slug, vuePath } of components) {
    try {
      const api = extractComponentApiFromFile(vuePath, slug);
      apis.push(api);
      const outPath = path.join(outputDir, `${slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(api, null, 2));
      console.log(`  [webkit] Generated: ${slug}.json`);
    } catch (err) {
      console.error(`  [webkit] Failed to extract API for ${slug}:`, err);
    }
  }

  return { components, apis };
}

/**
 * Public alias so the scaffold script can call it without circular deps.
 */
export function extractComponentApiFromFile(
  filePath: string,
  componentName: string,
): ComponentApi {
  return extractComponentApi(filePath, componentName);
}

/**
 * Generate TypeScript types from API
 */
export function generateApiTypes(apis: ComponentApi[]): string {
  const lines: string[] = [];

  lines.push('/**');
  lines.push(' * Auto-generated component API types');
  lines.push(' * Do not edit manually');
  lines.push(' */');
  lines.push('');

  for (const api of apis) {
    lines.push(`export interface ${api.component}Props {`);
    for (const prop of api.props) {
      const optional = prop.required ? '' : '?';
      lines.push(`  /** ${prop.description || prop.name} */`);
      lines.push(`  ${prop.name}${optional}: ${prop.type};`);
    }
    lines.push('}');
    lines.push('');

    if (api.events.length > 0) {
      lines.push(`export interface ${api.component}Emits {`);
      for (const event of api.events) {
        lines.push(`  /** ${event.description || event.name} */`);
        lines.push(`  (e: '${event.name}'${event.payload ? `, payload: ${event.payload}` : ''}): void;`);
      }
      lines.push('}');
      lines.push('');
    }

    if (api.slots.length > 0) {
      lines.push(`export interface ${api.component}Slots {`);
      for (const slot of api.slots) {
        lines.push(`  /** ${slot.description || slot.name} */`);
        lines.push(`  ${slot.name}: () => VNode;`);
      }
      lines.push('}');
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Main function for CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const outputTypes = args.includes('--types');
  const outputDir = args.find((a) => a.startsWith('--output='))?.split('=')[1] || 'src/generated/component-api';
  const webkitSource = args.find((a) => a.startsWith('--webkit-source='))?.split('=')[1];

  const cwd = process.cwd();

  if (webkitSource) {
    // Webkit mode: scan webkit core directory
    const coreDir = path.resolve(cwd, webkitSource);
    const outDir = path.resolve(cwd, outputDir);

    console.log('Extracting API from webkit core...');
    console.log(`  Core directory : ${coreDir}`);
    console.log(`  Output directory: ${outDir}`);
    console.log('');

    const { components } = extractWebkitCore(coreDir, outDir);

    console.log('');
    console.log(`Extracted API for ${components.length} webkit components`);
    return;
  }

  // Default mode: scan ds-docs own components
  const componentsDir = path.join(cwd, 'src/components');

  console.log('Extracting component APIs...');
  console.log(`Components directory: ${componentsDir}`);
  console.log(`Output directory: ${outputDir}`);
  console.log('');

  const apis = extractAllComponentApis({
    componentsDir,
    outputDir,
  });

  // Write JSON files
  writeApiJsonFiles(apis, outputDir);

  // Write types if requested
  if (outputTypes) {
    const typesPath = path.join(outputDir, 'component-api-types.ts');
    const typesContent = generateApiTypes(apis);
    fs.writeFileSync(typesPath, typesContent);
    console.log(`Generated types: ${typesPath}`);
  }

  console.log('');
  console.log(`Extracted API for ${apis.length} components`);
}

// Run main when executed as script (CJS or ESM)
const isCjsMain = typeof require !== 'undefined' && require.main === module;
const isEsmMain =
  typeof import.meta !== 'undefined' &&
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isCjsMain || isEsmMain) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export {
  ComponentApi,
  PropDefinition,
  EventDefinition,
  SlotDefinition,
  ExtractionOptions,
  WebkitComponentInfo,
};

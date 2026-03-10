import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const referenceDir = path.join(__dirname, 'figma-reference-tokens-studio');
const metadataPath = path.join(referenceDir, '$metadata.json');

const readJson = async (filePath) => {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
};

const exists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const writeFile = async (filePath, content) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
};

const sortPalette = (entries) =>
  entries.sort((a, b) => {
    const an = Number(a);
    const bn = Number(b);
    if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
    return a.localeCompare(b);
  });

const toTsObject = (obj, indent = 0) => {
  const pad = ' '.repeat(indent);
  const entries = Object.entries(obj);
  const lines = entries.map(([key, value]) => {
    const safeKey = /^[a-zA-Z_][\w-]*$/.test(key) ? key : `'${key}'`;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return `${pad}${safeKey}: {\n${toTsObject(value, indent + 2)}\n${pad}  }`;
    }
    return `${pad}${safeKey}: '${value}'`;
  });
  return lines.join(',\n') + ',';
};

const deepMerge = (target, source) => {
  if (!source || typeof source !== 'object') return target;
  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], value);
      return;
    }
    target[key] = value;
  });
  return target;
};

const extractTokenEntries = (node, prefix = [], result = {}) => {
  if (!node || typeof node !== 'object') return result;
  if ('$value' in node) {
    const key = prefix.join('.');
    result[key] = node.$value;
    return result;
  }
  Object.entries(node).forEach(([key, value]) => {
    if (key.startsWith('$')) return;
    extractTokenEntries(value, [...prefix, key], result);
  });
  return result;
};

const loadTokenSet = async (setName) => {
  const filePath = path.join(referenceDir, `${setName}.json`);
  if (!(await exists(filePath))) return null;
  return readJson(filePath);
};

const loadTokenSets = async () => {
  const metadata = await readJson(metadataPath);
  const order = metadata?.tokenSetOrder ?? [];
  const sets = {};
  for (const name of order) {
    const data = await loadTokenSet(name);
    if (data) {
      sets[name] = data;
    }
  }
  return sets;
};

const toCamel = (value) =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');

const getValueByPath = (obj, pathValue) =>
  pathValue.split('.').reduce((acc, key) => (acc && key in acc ? acc[key] : undefined), obj);

const parseAlias = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return null;
  return trimmed.slice(1, -1);
};

const aliasToRef = (alias) => {
  if (!alias) return null;
  if (alias.startsWith('primitive.')) {
    const [, palette, shade] = alias.split('.');
    if (palette === 'white' || palette === 'black') {
      return `primitives.base.${palette}`;
    }
    if (palette && shade) return `primitives.${palette}.${shade}`;
  }
  if (alias.startsWith('surfaces.surface-')) {
    const shade = alias.replace('surfaces.surface-', '');
    return `surfacePrimitives.surface.${shade}`;
  }
  return null;
};

const buildPrimitives = (entries) => {
  const result = {
    base: {
      white: '#ffffff',
      black: '#000000',
    },
    gray: {},
    violet: {},
    orange: {},
    slate: {},
    yellow: {},
    green: {},
    blue: {},
    neutral: {},
    red: {},
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (!key.startsWith('primitive.')) return;
    const [, palette, shade] = key.split('.');
    if (palette === 'white' || palette === 'black') {
      result.base[palette] = value;
      return;
    }
    if (palette in result && shade) {
      result[palette][shade] = value;
    }
  });

  Object.entries(result).forEach(([palette, paletteObj]) => {
    if (palette === 'base') return;
    const sorted = {};
    sortPalette(Object.keys(paletteObj)).forEach((shade) => {
      sorted[shade] = paletteObj[shade];
    });
    result[palette] = sorted;
  });

  return result;
};

const resolveAliasValue = (alias, primitives) => {
  const ref = aliasToRef(alias);
  if (!ref) return null;
  if (ref.startsWith('primitives.')) {
    return getValueByPath(primitives, ref.replace('primitives.', ''));
  }
  return null;
};

const buildSurfacePrimitives = (entries, primitives) => {
  const surface = {};
  Object.entries(entries).forEach(([key, value]) => {
    if (!key.startsWith('surfaces.surface-') && !key.startsWith('brand.surfaces.surface-')) return;
    const shade = key.split('surface-')[1];
    const alias = parseAlias(value);
    const ref = aliasToRef(alias);
    if (ref && ref.startsWith('primitives.')) {
      const path = ref.replace('primitives.', '').split('.');
      if (path[0] === 'base') {
        surface[shade] = `primitives.base.${path[1]}`;
      } else {
        surface[shade] = `primitives.${path[0]}[${path[1]}]`;
      }
    } else {
      surface[shade] = `tokenRef('${ref ?? alias ?? value}')`;
    }
  });

  const sorted = {};
  sortPalette(Object.keys(surface)).forEach((shade) => {
    sorted[shade] = surface[shade];
  });

  return { surface: sorted };
};

const buildBrandPrimitives = (entries) => {
  const accent = {};
  const primary = {};
  const absolute = {};

  Object.entries(entries).forEach(([key, value]) => {
    if (key.startsWith('brand.accent.accent-')) {
      const shade = key.replace('brand.accent.accent-', '');
      const alias = parseAlias(value);
      const ref = aliasToRef(alias);
      if (ref && ref.startsWith('primitives.')) {
        const path = ref.replace('primitives.', '').split('.');
        accent[shade] = `primitives.${path[0]}[${path[1]}]`;
      } else {
        accent[shade] = `tokenRef('${ref ?? alias ?? value}')`;
      }
      return;
    }

    if (key.startsWith('brand.primary.primary-')) {
      const shade = key.replace('brand.primary.primary-', '');
      const alias = parseAlias(value);
      const ref = aliasToRef(alias);
      if (ref && ref.startsWith('primitives.')) {
        const path = ref.replace('primitives.', '').split('.');
        primary[shade] = `primitives.${path[0]}[${path[1]}]`;
      } else {
        primary[shade] = `tokenRef('${ref ?? alias ?? value}')`;
      }
      return;
    }

    if (key.startsWith('brand.absolute.')) {
      const name = key.replace('brand.absolute.', '');
      const alias = parseAlias(value);
      const ref = aliasToRef(alias);
      if (ref && ref.startsWith('primitives.')) {
        const path = ref.replace('primitives.', '').split('.');
        absolute[name] = `primitives.${path[0]}[${path[1]}]`;
      } else {
        absolute[name] = `tokenRef('${ref ?? alias ?? value}')`;
      }
    }
  });

  const sortedAccent = {};
  sortPalette(Object.keys(accent)).forEach((shade) => {
    sortedAccent[shade] = accent[shade];
  });

  const sortedPrimary = {};
  sortPalette(Object.keys(primary)).forEach((shade) => {
    sortedPrimary[shade] = primary[shade];
  });

  return {
    accent: sortedAccent,
    primary: sortedPrimary,
    absolute,
  };
};

const normalizeSemanticKey = (tokenPath, prefix) => {
  if (!tokenPath.startsWith(prefix)) return tokenPath;
  const trimmed = tokenPath.slice(prefix.length + 1);
  const flattened = trimmed.split('.').join('-');
  // Fix typo in Figma tokens: "boder" -> "border"
  const corrected = flattened.replace(/^boder-/, 'border-').replace(/-boder-/g, '-border-');
  return toCamel(corrected);
};

const buildSemanticScope = (entries, prefix) => {
  const result = {};
  Object.entries(entries).forEach(([key, value]) => {
    if (!key.startsWith(`${prefix}.`)) return;
    const semanticKey = normalizeSemanticKey(key, prefix);
    const alias = parseAlias(value);
    const ref = aliasToRef(alias) ?? alias ?? value;
    result[semanticKey] = `tokenRef('${ref}')`;
  });
  return result;
};

const buildTextSemantic = (lightEntries, darkEntries) => ({
  light: buildSemanticScope(lightEntries, 'text'),
  dark: buildSemanticScope(darkEntries, 'text'),
});

const buildBackgroundSemantic = (lightEntries, darkEntries) => ({
  light: buildSemanticScope(lightEntries, 'background'),
  dark: buildSemanticScope(darkEntries, 'background'),
});

const buildBorderSemantic = (lightEntries, darkEntries) => ({
  light: buildSemanticScope(lightEntries, 'border'),
  dark: buildSemanticScope(darkEntries, 'border'),
});

const writePrimitivesFile = async (primitives) => {
  const content = `/**\n * PRIMITIVE COLORS TOKENS\n *\n * Generated from figma-reference-tokens-studio.\n */\n\nexport const primitives = {\n${toTsObject(primitives, 2)}\n};\n\nexport default {\n  primitives,\n};\n`;
  await writeFile(path.join(root, 'src/tokens/primitives/colors.js'), content);
};

const formatBrandScope = (scope) =>
  Object.entries(scope)
    .map(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('tokenRef(')) {
        return `    ${key}: ${value}`;
      }
      return `    ${key}: '${value}'`;
    })
    .join(',\n');

const writeBrandPrimitivesFile = async (payload) => {
  const { surfacePrimitives, brandPrimitives } = payload;

  const formatScope = (scope) =>
    Object.entries(scope)
      .map(([key, value]) => {
        if (typeof value === 'string' && (value.startsWith('tokenRef(') || value.startsWith('primitives.'))) {
          return `    ${key}: ${value}`;
        }
        return `    ${key}: '${value}'`;
      })
      .join(',\n');

  const surfaceContent = Object.entries(surfacePrimitives)
    .map(([name, scope]) => `  ${name}: {\n${formatScope(scope)}\n  }`)
    .join(',\n');

  const brandContent = Object.entries(brandPrimitives)
    .map(([name, scope]) => `  ${name}: {\n${formatScope(scope)}\n  }`)
    .join(',\n');

  const content = `/**\n * BRAND + SURFACE PRIMITIVES TOKENS\n *\n * Generated from figma-reference-tokens-studio.\n */\n\nimport { brandColors } from '../colors-brand.js';\nimport { primitives } from './colors.js';\n\n// Aliases:\n// - surfaces are neutrals\n// - accent is violet\nexport const surfacePrimitives = {\n${surfaceContent}\n};\n\nexport const brandPrimitives = {\n${brandContent}\n};\n\nexport { brandColors };\n\nexport default {\n  brandColors,\n  brandPrimitives,\n  surfacePrimitives,\n};\n`;
  await writeFile(path.join(root, 'src/tokens/primitives/brand.js'), content);
};

const writeTextSemanticFile = async (textSemantic) => {
  const formatScope = (scope) =>
    Object.entries(scope)
      .map(([key, value]) => `    ${key}: ${value}`)
      .join(',\n');
  const content = `/**\n * SEMANTIC TEXT TOKENS\n *\n * Generated from figma-reference-tokens-studio.\n */\n\nimport { tokenRef } from '../build/refs.js';\n\nexport const textSemantic = {\n  light: {\n${formatScope(textSemantic.light)}\n  },\n  dark: {\n${formatScope(textSemantic.dark)}\n  },\n};\n\nexport default {\n  textSemantic,\n};\n`;
  await writeFile(path.join(root, 'src/tokens/semantic/text.js'), content);
};

const writeBackgroundSemanticFile = async (backgroundSemantic) => {
  const formatScope = (scope) =>
    Object.entries(scope)
      .map(([key, value]) => `    ${key}: ${value}`)
      .join(',\n');
  const content = `/**\n * SEMANTIC BACKGROUND TOKENS\n *\n * Generated from figma-reference-tokens-studio.\n */\n\nimport { tokenRef } from '../build/refs.js';\n\nexport const backgroundSemantic = {\n  light: {\n${formatScope(backgroundSemantic.light)}\n  },\n  dark: {\n${formatScope(backgroundSemantic.dark)}\n  },\n};\n\nexport default {\n  backgroundSemantic,\n};\n`;
  await writeFile(path.join(root, 'src/tokens/semantic/backgrounds.js'), content);
};

const writeBorderSemanticFile = async (borderSemantic) => {
  const formatScope = (scope) =>
    Object.entries(scope)
      .map(([key, value]) => `    ${key}: ${value}`)
      .join(',\n');
  const content = `/**\n * SEMANTIC BORDER TOKENS\n *\n * Generated from figma-reference-tokens-studio.\n */\n\nimport { tokenRef } from '../build/refs.js';\n\nexport const borderSemantic = {\n  light: {\n${formatScope(borderSemantic.light)}\n  },\n  dark: {\n${formatScope(borderSemantic.dark)}\n  },\n};\n\nexport default {\n  borderSemantic,\n};\n`;
  await writeFile(path.join(root, 'src/tokens/semantic/borders.js'), content);
};

const hasTokens = (scope) => scope && Object.keys(scope).length > 0;

const run = async () => {
  const sets = await loadTokenSets();

  const globalSets = Object.entries(sets)
    .filter(([name]) => name === 'global' || name.toLowerCase().startsWith('global'))
    .map(([, data]) => data);

  const mergedGlobal = globalSets.reduce((acc, setData) => deepMerge(acc, setData), {});

  const semanticLight = sets['Semantic/Light'] ?? {};
  const semanticDark = sets['Semantic/Dark'] ?? {};

  const globalEntries = extractTokenEntries(mergedGlobal);
  const lightEntries = extractTokenEntries(semanticLight);
  const darkEntries = extractTokenEntries(semanticDark);

  const primitives = buildPrimitives(globalEntries);
  const surfacePrimitives = buildSurfacePrimitives(globalEntries, primitives);
  const brandPrimitives = buildBrandPrimitives(globalEntries);
  const textSemantic = buildTextSemantic(lightEntries, darkEntries);
  const backgroundSemantic = buildBackgroundSemantic(lightEntries, darkEntries);
  const borderSemantic = buildBorderSemantic(lightEntries, darkEntries);

  await writePrimitivesFile(primitives);
  await writeBrandPrimitivesFile({ surfacePrimitives, brandPrimitives });

  if (hasTokens(textSemantic.light) || hasTokens(textSemantic.dark)) {
    await writeTextSemanticFile(textSemantic);
  }

  if (hasTokens(backgroundSemantic.light) || hasTokens(backgroundSemantic.dark)) {
    await writeBackgroundSemanticFile(backgroundSemantic);
  }

  if (hasTokens(borderSemantic.light) || hasTokens(borderSemantic.dark)) {
    await writeBorderSemanticFile(borderSemantic);
  }

  console.log('Tokens synchronized from figma-reference-tokens-studio');
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

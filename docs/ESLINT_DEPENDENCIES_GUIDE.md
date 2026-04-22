# ESLint Dependencies Responsibility Matrix

**Package:** @aziontech/webkit
**Date:** 2026-04-14

---

## Overview

This document provides a comprehensive breakdown of each ESLint-related dependency installed in the governance pipeline, explaining their specific responsibilities, what issues they catch, and how they work together.

---

## Dependencies Table

| Package | Version | Category | Responsibility | What It Does |
|---------|---------|----------|----------------|--------------|
| **eslint** | ^9.39.3 | Core | Base linter | The core ESLint engine. Parses code, runs rules, reports issues. Version 9 introduces flat config (`eslint.config.js`) and drops legacy `.eslintrc.*` format. |
| **@typescript-eslint/parser** | ^8.58.2 | TypeScript | TypeScript parser | Parses TypeScript syntax (types, interfaces, enums, etc.) into ESLint's AST format. Required for ESLint to understand TypeScript code. Without this, ESLint can't parse `.ts` files. |
| **@typescript-eslint/eslint-plugin** | ^8.58.2 | TypeScript | TypeScript rules | Provides TypeScript-specific lint rules: `no-unused-vars`, `no-explicit-any`, `explicit-module-boundary-types`, etc. Catches TypeScript-specific issues that JavaScript rules miss. |
| **eslint-plugin-vue** | ^9 | Vue | Vue linting | Vue-specific lint rules for `.vue` files. Validates template syntax, script setup, Composition API, props, emits, lifecycle hooks. Includes `vue3-recommended` config. |
| **vue-eslint-parser** | ^10.4.0 | Vue | Vue parser | Parses Vue single-file components (`.vue`) with `<template>`, `<script>`, `<style>` blocks. Enables ESLint to understand Vue SFCs and `<script setup>` syntax. Works with TypeScript parser. |
| **eslint-plugin-import** | ^2.32.0 | Imports | Import validation | Validates ES6 imports/exports: checks if imported modules exist, prevents duplicate imports, validates export names. Rules: `import/first`, `import/no-duplicates`, `import/newline-after-import`. |
| **eslint-import-resolver-typescript** | ^4.4.4 | Imports | TypeScript import resolution | Tells `eslint-plugin-import` how to resolve TypeScript path aliases (`@/`, `~/*`) and `.ts`/`.vue` imports. Without this, import validation fails on TypeScript paths. |
| **eslint-plugin-simple-import-sort** | ^13.0.0 | Imports | Import sorting | Automatically sorts imports alphabetically: `import/exports` rules. Groups: built-ins → externals → internals → relative. Prevents merge conflicts, improves readability. |
| **eslint-plugin-unused-imports** | ^4.4.1 | Imports | Remove unused imports | Detects and auto-removes imports that are declared but never used. Rule: `unused-imports/no-unused-imports`. Keeps code clean during refactoring. |
| **eslint-plugin-vuejs-accessibility** | ^2.5.0 | Accessibility | Vue a11y rules | Vue-specific accessibility linting (not React's jsx-a11y). Rules: `alt-text`, `aria-props`, `aria-role`, `click-events-have-key-events`. Enforces WCAG compliance in Vue components. |
| **@vue/eslint-config-prettier** | ^7.1.0 | Integration | Prettier compatibility | Disables ESLint rules that conflict with Prettier formatting. Prevents "double linting" where ESLint and Prettier fight over code style. Use with Prettier, not instead of it. |
| **lint-staged** | ^16.4.0 | Tooling | Staged file linting | Runs linters only on Git staged files (changed files in commit), not entire codebase. Makes pre-commit hooks fast. Configured in `package.json` under `"lint-staged"` key. |

---

## Dependency Hierarchy

```
eslint (Core Engine)
├── TypeScript Support
│   ├── @typescript-eslint/parser (Parse .ts files)
│   └── @typescript-eslint/eslint-plugin (TypeScript rules)
│
├── Vue Support
│   ├── vue-eslint-parser (Parse .vue files)
│   └── eslint-plugin-vue (Vue rules)
│
├── Import Management
│   ├── eslint-plugin-import (Validate imports)
│   ├── eslint-import-resolver-typescript (Resolve TypeScript paths)
│   ├── eslint-plugin-simple-import-sort (Sort imports)
│   └── eslint-plugin-unused-imports (Remove unused)
│
├── Specialized Linting
│   └── eslint-plugin-vuejs-accessibility (Accessibility)
│
└── Integration
    ├── @vue/eslint-config-prettier (Prettier compatibility)
    └── lint-staged (Git hooks integration)
```

---

## What Each Package Catches

| Package | Example Issues It Catches |
|---------|---------------------------|
| **eslint** | `no-unused-vars`, `no-undef`, `no-console`, `prefer-const` |
| **@typescript-eslint/eslint-plugin** | `any` type usage, missing return types, unused parameters with types |
| **eslint-plugin-vue** | Missing prop defaults, undefined emits, multi-word component names, `v-html` usage |
| **eslint-plugin-import** | Importing non-existent modules, duplicate imports, missing exports |
| **eslint-plugin-simple-import-sort** | Imports not alphabetized, wrong import order |
| **eslint-plugin-unused-imports** | `import { unused } from 'lib'` where `unused` is never used |
| **eslint-plugin-vuejs-accessibility** | Missing alt text on images, click handlers without keyboard events, invalid ARIA props |
| **lint-staged** | N/A (orchestrates other linters on staged files) |

---

## Auto-fix Capabilities

| Package | Auto-fixable? | What It Auto-fixes |
|---------|---------------|---------------------|
| **eslint** | ✅ Yes | Basic formatting, `prefer-const`, `no-extra-semi`, etc. |
| **@typescript-eslint/eslint-plugin** | ✅ Yes | Adding return types (partial), removing explicit types |
| **eslint-plugin-simple-import-sort** | ✅ Yes | **Sorts imports alphabetically automatically** |
| **eslint-plugin-unused-imports** | ✅ Yes | **Removes unused imports automatically** |
| **eslint-plugin-vue** | ✅ Yes | Vue attribute ordering, fixing component name casing |
| **eslint-plugin-import** | ⚠️ Partial | Fixes import order, cannot fix missing modules |
| **eslint-plugin-vuejs-accessibility** | ❌ No | Requires manual fixes (accessibility is design choice) |
| **lint-staged** | N/A | Orchestrates auto-fixes from other packages |

**How to auto-fix:**
```bash
pnpm run lint:fix  # Runs ESLint with --fix flag
```

---

## Usage Examples

### 1. Core ESLint

**Base rules:**
```javascript
// ❌ Not allowed
console.log('debug')  // no-console
const x = 5; x = 10   // no-const-assign

// ✅ Allowed
const logger = useLogger()
const x = 5
```

### 2. @typescript-eslint/eslint-plugin

**TypeScript-specific rules:**
```typescript
// ❌ Not allowed
function add(a: any, b: any) {  // no-explicit-any
  return a + b
}

function getName() {  // explicit-module-boundary-types
  return 'John'       // Missing return type
}

// ✅ Allowed
function add(a: number, b: number): number {
  return a + b
}

function getName(): string {
  return 'John'
}
```

### 3. eslint-plugin-vue

**Vue-specific rules:**
```vue
<!-- ❌ Not allowed -->
<template>
  <div v-html="userContent"></div>  <!-- vue/no-v-html -->
</template>

<script setup>
const props = defineProps({
  title: String  // Missing default (require-default-prop)
})

const emit = defineEmits(['update'])
emit('change')  // Not declared (require-explicit-emits)
</script>

<!-- ✅ Allowed -->
<template>
  <div>{{ userContent }}</div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: ''
})

const emit = defineEmits<{
  update: [value: string]
  change: [value: number]
}>()
emit('change', 42)
</script>
```

### 4. eslint-plugin-import

**Import validation:**
```javascript
// ❌ Not allowed
import { nonExistent } from './utils'  // Module has no such export
import React from 'react'
import React from 'react'  // Duplicate import
import { useState } from 'react'
import { useEffect } from 'react'  // Should be combined

// ✅ Allowed
import { useEffect, useState } from 'react'
import { helper } from './utils'
```

### 5. eslint-plugin-simple-import-sort

**Import sorting:**
```javascript
// ❌ Not allowed (not alphabetized)
import { useState } from 'react'
import ReactDOM from 'react-dom'
import { helper } from './utils'
import fs from 'fs'

// ✅ Allowed (alphabetized)
import fs from 'fs'              // Built-in
import ReactDOM from 'react-dom' // External
import { useState } from 'react' // External
import { helper } from './utils' // Relative
```

### 6. eslint-plugin-unused-imports

**Remove unused imports:**
```javascript
// ❌ Not allowed
import { useState, useEffect, useMemo } from 'react'
// Only useState is used, others are unused

function Component() {
  const [value] = useState(0)
  return <div>{value}</div>
}

// ✅ Allowed
import { useState } from 'react'

function Component() {
  const [value] = useState(0)
  return <div>{value}</div>
}
```

### 7. eslint-plugin-vuejs-accessibility

**Accessibility rules:**
```vue
<!-- ❌ Not allowed -->
<template>
  <img src="photo.jpg">  <!-- Missing alt text -->
  <div @click="handleClick">Click me</div>  <!-- No keyboard handler -->
</template>

<!-- ✅ Allowed -->
<template>
  <img src="photo.jpg" alt="Profile photo">
  <div
    @click="handleClick"
    @keypress.enter="handleClick"
    tabindex="0"
  >
    Click me
  </div>
</template>
```

### 8. eslint-import-resolver-typescript

**Path alias resolution:**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ❌ Would fail without this plugin
import { Button } from '@/components/Button'  // ESLint can't resolve @/

// ✅ Works with eslint-import-resolver-typescript
import { Button } from '@/components/Button'  // Resolved to src/components/Button
```

---

## Dependency Interactions

### Parser Chain

```
Source File (.vue)
    ↓
vue-eslint-parser (understands <template>, <script>, <style>)
    ↓
<script lang="ts">
    ↓
@typescript-eslint/parser (understands TypeScript syntax)
    ↓
ESLint AST
    ↓
Rules run (eslint-plugin-vue, @typescript-eslint/eslint-plugin, etc.)
```

### Import Resolution Chain

```
import { Button } from '@/components/Button'
    ↓
eslint-plugin-import (validates import syntax)
    ↓
eslint-import-resolver-typescript (resolves @/ to ./src/)
    ↓
File exists check (src/components/Button.vue)
    ↓
Report if not found
```

### Pre-commit Chain

```
git commit
    ↓
Husky trigger (.husky/pre-commit)
    ↓
lint-staged (filters to staged files only)
    ↓
eslint --fix (runs with all plugins)
    ↓
prettier --write (formats code)
    ↓
Commit proceeds or fails
```

---

## Why Each Package Is Necessary

### Why We Need Both Parsers

- **vue-eslint-parser**: ESLint doesn't understand `.vue` files natively
- **@typescript-eslint/parser**: ESLint doesn't understand TypeScript syntax

**Together they enable:** Linting Vue SFCs written in TypeScript (`<script setup lang="ts">`)

### Why We Need Import Resolver

- **eslint-plugin-import** validates imports
- **eslint-import-resolver-typescript** tells it how to find files

**Without resolver:** Import validation fails on TypeScript path aliases

### Why We Need Import Sorting AND Unused Imports

- **simple-import-sort**: Makes imports predictable, prevents merge conflicts
- **unused-imports**: Keeps code clean during refactoring

**Together:** Imports are sorted AND unused ones are removed automatically

### Why We Need Vue Accessibility Plugin

- **eslint-plugin-vuejs-accessibility** is Vue-specific (not React's jsx-a11y)
- Vue templates have different accessibility patterns than JSX

**Examples:** `v-if` vs `&&`, `@click` vs `onClick`, `<template>` vs JSX

---

## Configuration Locations

| Package | Config Location |
|---------|----------------|
| **eslint** + all plugins | `/packages/webkit/eslint.config.js` |
| **lint-staged** | `/package.json` → `"lint-staged"` key |
| **Prettier integration** | Handled in ESLint config |

---

## Common Issues & Solutions

### Issue 1: Import Resolution Fails

**Symptom:**
```
Unable to resolve path to module '@/components/Button'
```

**Solution:**
- Ensure `eslint-import-resolver-typescript` is installed
- Check `tsconfig.json` has correct `paths` config
- Add to ESLint config:
```javascript
settings: {
  'import/resolver': {
    typescript: {
      project: './tsconfig.json'
    }
  }
}
```

### Issue 2: Vue Parser Conflicts

**Symptom:**
```
Error: Cannot read property 'range' of null
```

**Solution:**
- Ensure `vue-eslint-parser` is set as main parser
- TypeScript parser is specified inside `parserOptions`:
```javascript
parser: 'vue-eslint-parser',
parserOptions: {
  parser: '@typescript-eslint/parser'
}
```

### Issue 3: Prettier Conflicts

**Symptom:**
```
ESLint: Expected indentation of 2 spaces but found 4
Prettier: Formatting with 2 spaces
```

**Solution:**
- Install `@vue/eslint-config-prettier`
- Add to ESLint extends: `'@vue/eslint-config-prettier/skip'`
- This disables conflicting ESLint rules

---

## Performance Impact

| Package | Performance Impact | Notes |
|---------|-------------------|-------|
| **eslint** | Low-Medium | Core engine, unavoidable |
| **@typescript-eslint/parser** | Medium | TypeScript parsing is more complex than JS |
| **vue-eslint-parser** | Low | Fast Vue SFC parsing |
| **eslint-plugin-import** | Medium | Has to check module resolution |
| **eslint-import-resolver-typescript** | Medium | TypeScript compilation for path resolution |
| **eslint-plugin-simple-import-sort** | Low | Simple alphabetical sort |
| **eslint-plugin-unused-imports** | Low | Checks variable usage |
| **eslint-plugin-vuejs-accessibility** | Low | Template tree traversal |
| **lint-staged** | Reduces time | Only lints changed files |

**Total overhead:** ~2-5 seconds on cached runs for a medium-sized file

---

## Version Compatibility

| Package | Version Requirement | Reason |
|---------|---------------------|--------|
| **eslint** | ^9.x | Required for flat config |
| **eslint-plugin-vue** | ^9.x | Supports Vue 3 + Composition API |
| **@typescript-eslint/** | ^8.x | Compatible with ESLint 9 |
| **vue-eslint-parser** | ^10.x | Supports Vue 3 + TypeScript |

**⚠️ Warning:** Using incompatible versions can cause:
- Parser errors
- Rule conflicts
- Missing features

---

## Migration Notes

### From Legacy Config (.eslintrc.*) to Flat Config (eslint.config.js)

**Old format:**
```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:vue/vue3-recommended'],
  rules: { ... }
}
```

**New format:**
```javascript
// eslint.config.js
import vue from 'eslint-plugin-vue'

export default [
  {
    files: ['**/*.vue'],
    plugins: { vue },
    rules: { ... }
  }
]
```

**Why the change:**
- ESLint 9 dropped legacy config support
- Flat config is more explicit
- Better ESM support
- Clearer plugin configuration

---

## Further Reading

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [typescript-eslint Documentation](https://typescript-eslint.io/)
- [eslint-plugin-vue Documentation](https://eslint.vuejs.org/)
- [eslint-plugin-vuejs-accessibility](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility)
- [Import Plugin Documentation](https://github.com/import-js/eslint-plugin-import)

---

**Document created:** 2026-04-14
**Package:** @aziontech/webkit
**Framework:** Vue 3 + TypeScript
**ESLint Version:** 9.x (Flat Config)
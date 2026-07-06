# Webkit guardrails — what we cover, and where

Webkit protects **two frontiers** with the same principle — *correct by construction*:

1. **Building** components inside the design system (internal / contributor).
2. **Consuming** webkit correctly in other projects (the adoption toolkit).

In both, the developer (and the AI) fall into the correct path without memorising rules — a rule is only useful if something *enforces* it. This doc maps exactly what is covered, by which mechanism, and where the boundaries are.

---

## 1. Lint coverage

### 1a. Internal — contributor editing webkit

Runs at CI and, for component files, via a Claude Code authoring hook.

- **`eslint.config.js`** (flat, repo root; `packages/webkit/eslint.config.js` re-exports it): Vue correctness (`vue/*`), accessibility (`vuejs-accessibility/*`), `@typescript-eslint/no-explicit-any`, import sorting (`simple-import-sort`), `no-console` / `no-debugger`, `prefer-const`.
- **`.stylelintrc.json`** (repo root): kebab-case class names, no ID selectors, alphabetised properties, no duplicates (extends `stylelint-config-standard-scss` + `-recommended-vue`).
- **`.claude/hooks/validate-tokens.mjs`** (PreToolUse on `packages/webkit/src/components/**`, excludes `wip/`): blocks **newly introduced** hex/rgb/hsl colors, Tailwind palette classes, raw text sizes, raw typography (`leading-*`, `tracking-*`, `font-*`), PrimeVue color utilities, `class` in `defineProps`, `any`, and `@ts-ignore`.

### 1b. Consumer — using webkit in another project (the adoption toolkit)

Everything reads the **version-locked `catalog.json`** shipped inside the installed webkit (resolved from `@aziontech/webkit` or `@aziontech/webkit.dev`), so what's enforced always matches the installed version. If no catalog resolves, the rules disable themselves **and log a one-line warning** — never silently.

**`@aziontech/eslint-plugin-webkit`** — presets `recommended` / `strict` / `performance`:

| Rule | Blocks | Autofix |
|---|---|---|
| `valid-import-path` | An import subpath that isn't a published export of the installed version | ✅ when exactly one close candidate exists (else suggestions) |
| `no-deep-internal-import` | `@aziontech/webkit/src/**` or paths deeper than a published entry | ✅ to the nearest published entry |
| `no-barrel-import` | Barrel import / `export … from` / dynamic `import()` of the bare package | Suggestion only, and only when every split subpath is a real export |
| `no-whole-icon-set-import` | A default/namespace binding of the `@aziontech/icons` **font** (use a side-effect import + CSS classes) | — |
| `no-hardcoded-color` | Hardcoded color / raw palette / raw typography in class & style strings (short hex in anchors/ids is not flagged) | — |
| `prefer-tree-shakeable-root` | Importing a compound entry when only the root is used → prefer `<name>-root` | Suggestion only (a `warn` preference) |

**`@aziontech/stylelint-config-webkit`** — token discipline in CSS / SCSS / `.vue` `<style>` (no raw hex/rgb/hsl).

> The **positive** side of token discipline — *which* token to use instead — is answered by the MCP `list_tokens` tool (see §4), the complement of these deny rules.

---

## 2. Spec coverage — creating a new component

A component's contract (`.specs/<name>.md`) is written and **approved before any code**. The agent is a *transcriber*: the generated `.vue` / story / exports must match the spec 1-to-1.

**The contract** — frontmatter (`name`, `category`, `structure`, `status`, `spec_version`, `checksum`) + body: Purpose, Usage (one runnable `vue` block), Sub-components (composition), Props, Events, Slots, States, Motion & Animations, Tokens, Theme gaps, Accessibility, Stories, and the verbatim **Constraints — DO NOT** block. The `checksum` (sha256 of the body) locks the spec against out-of-band edits; `status` gates code-gen (`draft` can't generate, `locked` needs a `spec_version` bump).

**The rules** (`.claude/rules/*.md`, injected verbatim into every sub-agent):

| Rule | Enforces |
|---|---|
| `compound-api` | Composition components expose a compound API (`index.ts` attaches sub-components for dot-notation) + a tree-shakeable `<name>-root`; anatomy = elements/slots, not config arrays; shared state via provide/inject |
| `styling` | Styles inline on the root `class` + `data-*` variants; no JS class presets, no `<style>` blocks, no CSS-in-JS; `cn()` is the only merge helper |
| `naming` | One kebab name across six surfaces (spec, folder/`.vue`, export subpath, `defineOptions.name`, `data-testid`, story binding) |
| `imports` | Flat public export (`@aziontech/webkit/<name>`); category lives only in the folder and story title |
| `no-invention` | Nothing beyond the spec — no extra props/events/slots/imports; emit `BLOCKED:` when the spec is incomplete |
| `migration` | Never inherit artifacts as-is (other DS, Figma, Radix/Reka/shadcn/PrimeVue) — rewrite to our conventions |
| `dependencies` | Zero external positioning/animation/drag/virtualization libs — CSS + tokens + Vue primitives only |
| `release-types` | The Conventional-Commit type → version-bump set is identical across commitlint, every `.releaserc`, CONTRIBUTING and the PR flows |
| `storybook-source` | "Show code" is a single runnable PascalCase SFC via explicit `source.code = toSfc(...)` |
| `git-workflow` | Branches/PRs via `/create-branch` + `/open-pr`; base and target `dev`; no attribution footer; no `--no-verify` |

**The hooks** (automated, blocking — exit 2 = block, fail-open on error):

| Hook | Blocks | Trigger |
|---|---|---|
| `validate-tokens` | New hardcoded colors / raw typography / `any` / `@ts-ignore` (see §1a) | PreToolUse Write/Edit on components |
| `validate-references` | Phantom `@aziontech/webkit/*` imports, unresolvable relatives, uninstalled packages | PreToolUse Write/Edit on JS/TS/Vue |
| `validate-spec-compliance` | A `.vue` that diverges from its spec (props/events/slots, `defineOptions.name`, `data-testid`, animations) | PostToolUse Write/Edit on components |
| `validate-story-source` | A story whose "Show code" wouldn't be a runnable PascalCase SFC | PreToolUse Write/Edit on `*.stories.*` |
| `enforce-spec-exists` | Writing a `.vue` without an approved spec + matching checksum | PreToolUse Write on components |
| `enforce-component-create` | Creating a new component `.vue` outside the spec pipeline | PreToolUse Write on components |

**The pipeline:** `/spec-create <name>` → human review → `/component-create <name>` (validate spec → discovery → scaffold → storybook → code-connect → an **independent echo cross-check** → lint/type/build → finalize) → `/component-verify <name>` to reconfirm.

---

## 3. Existing components — editing & migrating

- **Editing** a spec'd component: every `Write`/`Edit` re-fires the hooks (tokens, references, spec-compliance), so drift, a bad token, or a phantom import is blocked immediately. Run **`/component-verify <name>`** (read-only) to reconfirm spec status + hooks + echo + lint/type/build.
- **Migrating a legacy component** under the standard: it stays on the `.claude/hooks/_lib/legacy-components.json` whitelist (bypassing the spec hooks) only until you (1) write the spec from scratch, (2) rename props/events to our conventions, (3) replace any forbidden deps, and (4) remove it from the whitelist — allowed only after `/component-verify` passes end-to-end. Backfilling legacy specs is a separate task/PR from new-component work.

---

## 4. Using webkit in other projects — the adoption toolkit

```
package.json#exports + .specs
        │  (build-catalog.mjs, deterministic, at release)
        ▼
   catalog.json  ← single source of truth (version-locked, shipped in the package)
        │
   ┌────┴─────────────────────────────┐
   ▼                                    ▼
 FORCE (blocks)                       GUIDE (assists)
 eslint-plugin-webkit +               webkit-mcp (9 tools) +
 stylelint-config-webkit             Claude Code bundle (rules/skill/agents)
```

- **`npx @aziontech/webkit-cli init`** wires both layers in one idempotent command: deps, eslint/stylelint config, pre-commit (husky), `.mcp.json`, the Claude bundle, and a `CLAUDE.md` fragment.
- **`npx @aziontech/webkit-cli doctor`** verifies the wiring is healthy (catalog resolvable, configs present, MCP registered, husky active, theme imported) and reports resolved dependency versions.
- **`@aziontech/webkit-mcp`** is a local **stdio** MCP server (no hosted service): the AI client spawns it via `npx`, it reads the local `catalog.json`, and answers 9 tools — `list_components`, `list_categories`, `list_tokens`, `get_component`, `get_import`, `search_components`, `suggest_component`, `get_usage_example`, `validate_usage`. `list_tokens` is the positive counterpart to the deny rules: it tells the AI which token to use.

---

## How the layers reinforce each other

Rules are advisory text injected into agents (they shape generation). Hooks are the hard gate that blocks a Write/Edit regardless of who makes it. The spec's Constraints block is the bridge — it restates the rules verbatim inside the contract, and the spec validator refuses a spec whose Constraints block was weakened. On the consumer side the same discipline ships as the catalog + lint + MCP, so a project that never sees this repo still writes webkit code correctly by construction.

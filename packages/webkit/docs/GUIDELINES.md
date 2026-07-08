# Guidelines — building and using `@aziontech/webkit`

One page to **see every pattern** you need, whether you are:

- **A — building a component by hand** (in the design system or in your own project) → follow
  the **general construction patterns** below; or
- **B — using a webkit component in your project** → follow the **consumer rules** below.

Everything here is **enforced** — automatically (lint / CI) or by mandatory review — so the
pattern is the path of least resistance, not a checklist you have to remember. The machine-
readable source of these standards (and their `scope`) is
[`.claude/hooks/_lib/standards.mjs`](../../../.claude/hooks/_lib/standards.mjs); each rule
lives in [`.claude/rules/`](../../../.claude/rules/).

> **General vs. webkit.** The patterns in **Part A** are `scope: general` — they ship to your
> project and apply to any Vue component. The rules that are `scope: webkit` (spec-first
> pipeline, the exports map, Storybook "Show code", releases) live only inside the design
> system and are **not** on this page.

---

## Part A — building a component by hand (general patterns)

Each is a `scope: general` standard. Follow ✅, avoid ❌.

| Pattern | ❌ Avoid | ✅ Do |
|---|---|---|
| **Two-way value** | `defineProps({ modelValue }) + emit('update:modelValue')` | `const model = defineModel<string>()` |
| **Props** | `defineProps({ kind: { type: String } })` · `variant` · `isDisabled` | `withDefaults(defineProps<Props>(), {…})` · `kind` · `disabled` |
| **Prop vocabulary** | `sm/md/lg` · `variant` · `closeable` | `small/medium/large` · `kind` · `dismissible` |
| **Emits** | `defineEmits(['click'])` · `emit('click', item)` | `defineEmits<{ 'item-click':[e,item] }>()` — event first |
| **Slots** | `<slot/>` with no declaration | `defineSlots<{ default():unknown }>()` |
| **Composables** | `return reactive({…})` | `return { value: readonly(v), set }` · args via `toValue` · cleanup in `onScopeDispose` |
| **Styling** | `const kindClasses = {…}` · `#f3652b` · `text-blue-600` | `data-[kind=primary]:bg-[var(--primary)]` inline · tokens only |
| **Component structure** | random `<script setup>` order | fixed order: options → props → emits → models → slots → state |
| **Root element** | wrapper `<div>` that swallows attrs · `as` prop | own the root · `inheritAttrs:false` + `$attrs` + `cn` · polymorphism via `href` |
| **States** | ad-hoc spinner / "no results" string | `data-*` + `Skeleton` / `EmptyState` |
| **Accessibility** | `<div @click>` | `<button>` + `focus-visible` + `motion-reduce:` + `useId` |
| **data-testid** | (none) | `:data-testid="testId"` → `<category>-<name>` |
| **Deprecation** | remove/rename silently | `@deprecated` (name the replacement + version) → one major → remove |

Each links to its full rule in [`.claude/rules/`](../../../.claude/rules/) (e.g. `v-model.md`,
`props.md`, `composables.md`).

---

## Part B — using a webkit component in your project

Install the ESLint plugin and enable the `recommended` preset — **every rule is `error`**, so
off-pattern usage fails your lint.

```js
// eslint.config.js
import webkit from '@aziontech/webkit/eslint-plugin'
export default [...webkit.configs.recommended]
```

| Do this | ❌ Avoid | ✅ Do |
|---|---|---|
| **Import** | `import { Button } from '@aziontech/webkit'` | `import Button from '@aziontech/webkit/button'` |
| **No internal / typo** | `@aziontech/webkit/src/…` · `…/buton` | `@aziontech/webkit/button` |
| **Tree-shaking** | `import Table` (compound) when you only render the root | `import TableRoot from '@aziontech/webkit/table-root'` |
| **Don't override styles** | `<Button class="p-8" />` | compose inside its slots, or use a `styleSeam` component |
| **No deprecated** | importing a deprecated component | the suggested replacement |
| **Tokens, not colors** | `class="text-[#fff]"` | `class="text-[var(--text-default)]"` |
| **Icons** | `import Icons from '@aziontech/icons'` | `import '@aziontech/icons'` (side-effect) |

**Discover the API before you write it:** the MCP server (`@aziontech/webkit/mcp`) answers
`list_components`, `get_component`, `list_tokens`, `suggest_component`, `get_best_practices`,
and `validate_usage` — so an AI (or you) gets the right import / token / prop *before* the lint
has to reject the wrong one.

---

## How the standards are enforced

The lint blocks the wrong thing; the MCP + this guideline show the right thing. Nothing is a
suggestion — every pattern blocks the merge, automatically or by mandatory review.

```mermaid
flowchart TD
  W["You write or use a component"] --> WT["Write-time hooks<br/>(design-system pipeline)"]
  WT -->|off-pattern| WTB["blocked on save (exit 2)"]:::block
  WT -->|ok| LINT["Your app's lint<br/>eslint-plugin — every rule = error"]
  LINT -->|off-pattern usage| LB["lint fails"]:::block
  LINT -->|ok| PR["Pull request"]
  PR --> CI["CI: lint · types · authoring ratchet · a11y · security"]
  CI -->|new violation| CIB["PR fails"]:::block
  CI -->|ok| RV["Mandatory review<br/>2 approvals (technical + design)"]
  RV -->|rejected| RB["not merged"]:::block
  RV -->|approved| M["merge"]:::ok

  classDef block fill:#fbeceb,stroke:#c6403a,color:#8f2b23;
  classDef ok fill:#eaf3ee,stroke:#2e7d5b,color:#1c5f42;
```

**What happens at each step**

1. **Write-time** — as the component is written (by the AI pipeline or an editor with the
   hooks), a wrong pattern is blocked on save (`exit 2`): manual `v-model`, runtime
   `defineProps`, `<slot>` without `defineSlots`, off-token styling, phantom imports.
2. **Your app's lint** — the `@aziontech/webkit` ESLint plugin (all rules `error`) blocks
   wrong *usage*: barrel imports, deep imports, style overrides, deprecated components.
3. **CI** — the authoring **ratchet** re-runs the write-time checks over the changed source and
   fails the PR on any new violation; `lint` / `types` / `a11y` / `security` run alongside.
4. **Mandatory review** — the parts a regex cannot verify (behavioural a11y, `defineExpose`
   minimality, state-matrix completeness) are gated by the 2 required approvals; the PR cannot
   merge without them.

The result: the standard is applied by construction, checked independently, and blocked when
violated — so a component reaches review already on-pattern, and a consumer stays on-pattern
in their own build.

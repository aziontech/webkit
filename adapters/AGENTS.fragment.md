## @aziontech/webkit design system

This project uses the Azion design system. Any coding agent (Claude Code, Codex, Cursor, …) follows
this block. Its guidance is organized in four layers — know which layer you're in, because only one of
them is optional:

1. **Invariants (always-on, below)** — the non-negotiables. Follow them in every UI change.
2. **Enforcement (the machine — non-optional)** — ESLint blocks the mechanical invariants at lint/CI;
   the `webkit` MCP grounds every screen and component choice; `npx @aziontech/webkit check` and the
   `webkit-ui-verify` skill check the rest (axe, both themes, states). If lint or the check fails, the
   change is not done.
3. **Skills (on-demand guidance)** — `node_modules/@aziontech/webkit/skills/<name>/SKILL.md`
   (Claude Code also gets them as `/webkit-*` in `.claude/skills/`).
4. **Reference (depth)** — `node_modules/@aziontech/webkit/rules/webkit-*.md` (also copied to
   `.claude/rules/`) carry the full standards behind the invariants.

### Start every screen from a pattern

A whole screen — login, signup, settings, a list, a create flow, a detail page — is never built from
scratch. Find its block with `npx @aziontech/webkit search <the screen in plain words>` (or the
`webkit` MCP: `search_patterns`), read it with `npx @aziontech/webkit view <block-id>` (or
`get_pattern`), then copy it with `npx @aziontech/webkit add <block-id>`: it writes the SFC into the
views directory, checks its imports, records it in `webkit.blocks.json` and prints the route to add.
Change only the content (copy, data, handlers); keep the components, their order, the props and the
classes. Pattern ids are grouped by task (`platform/create/…`, `platform/view/…`,
`platform/detail/…`, `platform/edit/…`, `platform/delete/…`, `platform/settings/…`,
`platform/states/…`, `platform/dashboard/…`, `platform/account/…`, `platform/auth`); each is one job
whose states are its variants (`add --variant <state>`, or `variant` on `get_pattern`). Use `suggest_component` / `get_component` only for pieces the pattern does
not cover. A marketing band is a page section: `suggest_component` returns it (rule `webkit-sections`).
Every export carries a `surface`: `product` (console and apps), `marketing` (the azion.com site) or
`docs` (the documentation site). A console screen uses `product` only (`list_components`,
`search_patterns` and `suggest_component` take `surface`). The search tools understand English,
Portuguese and Spanish ("cadastro", "crear cuenta"). Without the MCP, read
`node_modules/@aziontech/webkit/llms/llms.txt`: one Markdown page per block, component and
foundation, a JSON API per component, and `llms-full.txt` with everything in one file.

### Invariants — always follow

- **Patterns, then components.** Screens start from a pattern (above). Pieces reach for an
  `@aziontech/webkit` component before writing custom UI — find one via the `webkit` MCP
  (`suggest_component`), `node_modules/@aziontech/webkit/llms/llms.txt` or
  `node_modules/@aziontech/webkit/catalog.json`.
- **Flat imports.** `import Button from '@aziontech/webkit/button'` (PascalCase binding = the subpath);
  page sections too (`@aziontech/webkit/pricing-plans`). Never category-prefixed, `/src/`,
  deep-internal, or a bare-package barrel.
- **Tokens only.** Color, typography, shape, spacing come from `@aziontech/theme`
  (`var(--primary)`, `var(--spacing-md)`, `text-button-lg`) — never hex, `rgb`, `hsl`, or Tailwind palette.
- **Never restyle a webkit component.** No `class`/`:class`/`style` on its tag — compose inside its
  slots or use its props. The only exception is a static `class` of layout utilities: `w-full`,
  `max-w-*`, `self-*`, `shrink-0`.
- **Styles + theme.** Load `src/webkit.css` once at the app entry — it `@import`s the theme's
  Tailwind v4 stylesheet (tokens + `@import "tailwindcss"` + fonts) and `@source`s webkit so its
  component classes compile. Import `webkit.css`, not `@aziontech/theme` bare (the `@source` is what
  compiles webkit's classes). Light is the default; for dark set `<html data-theme="dark">`.
- **Accessible & keyboard-operable.** Label every field, keep a visible focus ring, mirror state in
  ARIA, no click handler without a key handler.
- **Right-to-left ready.** Logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`,
  `text-start`, `border-s`, `rounded-s`); directional icons mirror with `rtl:-scale-x-100`; arrow-key
  and drag logic reads `useDirection` (`@aziontech/webkit/use-direction`); code, URLs and IDs
  inside text sit in `dir="ltr"` or `<bdi>` (rule `webkit-direction`).
- **Built-in strings stay built in.** Never re-type a string a webkit component already ships
  (close, pagination, calendar, keycaps, wizard steps): set `locale` on `WebkitProvider` and rename
  one with its `messages` prop. Product copy follows `/webkit-microcopy` (rule `webkit-strings`).
- **Small bundles.** Prefer the `<name>-root` path (or specific sub-components), import icons
  individually, lazy-load heavy overlays.
- **App-level setup at first use.** A few components declare a one-time wiring in their catalog
  `setup` field (via the MCP's `get_component`). Toast: before the first `toast(...)` call, wire
  `import { ToastPlugin } from '@aziontech/webkit/toast'` + `.use(ToastPlugin)` on `createApp()`
  in the entry (the plugin mounts the region automatically); skip if already wired. `webkit doctor`
  flags usage with missing setup.

### Enforced by lint (blocks — nothing here is a suggestion)

ESLint (`@aziontech/webkit/eslint-plugin` + `vuejs-accessibility`, wired by `webkit init`) fails the
build on: category-prefixed / deep-internal / barrel imports · hardcoded color · restyling a webkit
component · a physical left/right utility (`ml-`, `pr-`, `left-`, `text-right`…) · a custom
element where a webkit component exists · a hand-rolled `modelValue`+`update`
instead of `defineModel` · a deprecated component · a whole-icon-set import · an app header without `SearchTrigger` or a hand-rolled ⌘K field · missing the
tree-shakeable root · and the static a11y set (alt-text, aria-props, aria-role, click-without-key,
label-has-for, no-autofocus). The rest — states, motion-reduce, contrast/behavioral a11y, both
themes, microcopy — is verified at runtime by `/webkit-ui-verify` (the `webkit-ui-verifier` agent
runs axe + screenshots), and taste is a review concern.

- **Search in every app header.** A header that navigates (console, demo, docs, site) puts
  `SearchTrigger` first in `GlobalHeader.Right`, wired to a `Command` palette (`⌘K` / `Ctrl K`);
  never a hand-rolled field or a bare magnifier button. Lint: `webkit/header-search-trigger`
  (rule `webkit-header-search`).
- **Page layout.** One container class per band (`.layout-column`, `-form`, `-focused`,
  `.layout-form-create`, `-content`, `-site`) and two rhythm steps (`--layout-section-gap`,
  `--layout-group-gap`) — never a hand-rolled `max-w-*` page cap (rule `webkit-page-layout`).
- **Forms that browsers understand.** E-mail fields set `type="email"` and `autocomplete`
  (`username` to sign in, `email` to sign up); passwords `current-password` / `new-password`; paste is
  never blocked. Auth screens never toast: every outcome is one `Alert` inside the card.

### Skills — invoke for how to build UI well

Start with `webkit-usage` (the entry point that routes the rest). Get structure and states right
before any polish:

- **Structure:** `/webkit-ux-heuristics` (right component per moment) · `/webkit-ui-states` (state surface + async behavior) · `/webkit-form` · `/webkit-create-surface` (where a create lives: page vs drawer, Advanced, the commit bar) · `/webkit-errors` (where a failure goes: field, section Alert, toast, auth card) · `/webkit-tables` (data-driven `<Table>` + cell recipes) · `/webkit-lists` (the index page around it + the filter system) · `/webkit-navigation`
- **Layout:** `/webkit-layout` (the page container system: measure, boundary, rhythm — a page never writes its own `mx-auto max-w-*`)
- **Words:** `/webkit-microcopy` (Azion product copy: punctuation, sentence case, label vs message, one word per concept)
- **Foundation:** `/webkit-baseline-ui` (tokens, typography hierarchy, spacing rhythm)
- **Cross-cutting quality:** `/webkit-theming-dark-mode` · `/webkit-data-viz` · `/webkit-genai` (chat, streamed responses, citations, feedback, actions the reader approves)
- **Polish:** `/webkit-motion-polish` · `/webkit-impeccable-polish` (finish + earned delight)
- **Verify + migrate:** `/webkit-ui-verify` (runtime axe + both themes + states) · `/webkit-ds-adoption`

Mechanics of consuming the package (imports, tokens, tree-shaking) live in `/webkit-usage`.

### Agents (Claude Code) — delegate a whole task

`webkit-expert` (which component + how) · `webkit-adopter` (the init/adoption flow) · `webkit-reviewer`
(review a diff for correct/performant usage) · `webkit-ui-verifier` (drive the screen: both themes,
widths, console, axe, states) · `webkit-adoption-auditor` (coverage scorecard: custom → webkit).

Full standards behind the invariants: `node_modules/@aziontech/webkit/rules/webkit-*.md` (Claude Code:
`.claude/rules/webkit-*.md`).

# Azion UI CLI — `init` + `add` / `diff` / `search` / `view` / `check` + `doctor` + `report` + `canary` + `sync`

One command to adopt the [`@aziontech/ui`](https://github.com/aziontech/webkit) design system in an existing project — correctly and performantly by construction. The CLI ships **inside** `@aziontech/ui` (the `ui` bin) — there is no separate CLI package.

```bash
npx @aziontech/ui init
```

It wires everything and then gets out of the way: after setup there are no extra commands to remember. The FORCE layer (ESLint + Stylelint) blocks incorrect usage on commit and in CI; the GUIDE layer (the Azion UI MCP + the agent files in `.agents/` and `AGENTS.md`) helps you and your AI write correct code from the start.

## What `init` does

The plan is computed by reading your project first, then applied without ever clobbering your files — each step either writes something absent, merges/appends behind a marker, patches once behind an idempotency check, or just advises.

On a TTY (and without `--yes`), `init` first asks about the optional pieces — install the icon font? wire the entry imports automatically? — one Y/n question each. Piped/CI runs never prompt: they take the defaults (everything on) minus any `--no-*` flag.

1. **Dependencies** recorded in `package.json` — `@aziontech/ui`, `@aziontech/theme`, `@aziontech/icons` (unless `--no-icons`), plus dev tooling peers (`eslint`, `stylelint`, `vue-eslint-parser`, `@typescript-eslint/parser`, `postcss-html`, `postcss-scss`, and `husky` in a git repository). A dependency you already declare (in `dependencies` or `devDependencies`) is compared by semver: one at a compatible or newer range (`eslint@^10`, `tailwindcss@^4.9.0`, `workspace:*`) is kept and printed as `kept`; only one older than Azion UI needs (`tailwindcss@^3`) is raised, printed with the version it replaced. `init` never downgrades. The ESLint plugin and Stylelint config ship inside `@aziontech/ui` (subpaths); the MCP server is its own package, `@aziontech/ui-mcp`, which the `.mcp.json` entry runs through `npx`, so nothing else is added to `package.json`. It does not run an install — do that with your package manager.
2. **`eslint.config.mjs`** (flat, ESM) wiring the Azion UI preset — or a merge snippet if an ESLint config already exists. It starts with a global `ignores` for build output (`node_modules/`, `dist/`, `dist-ssr/`, `coverage/`, `.vite/`, `.nuxt/`, `.output/`, `.next/`, `.svelte-kit/`, `storybook-static/`), so `eslint .` and `report` never lint the compiled bundle, and it turns `azion-ui/require-authoring-standards` off for root tool configs (`*.config.{js,cjs,mjs,ts,cts,mts}`): the comment and construction standards govern your app code, not the `vite.config.ts` a scaffolder wrote. A fresh project lints clean.
3. **`.stylelintrc.json`** extending the Azion UI config, with the `.vue` / `.scss` custom syntaxes wired — or a merge snippet if a Stylelint config already exists — and **`.stylelintignore`** with the same build-output folders (advised, not overwritten, when you already have one).
   Next to it, **`.prettierrc.json`**: the options the copied blocks are formatted with (`semi: false`, `singleQuote`, `printWidth: 100`, `trailingComma: "none"`, `singleAttributePerLine`, `vueIndentScriptAndStyle`), so a format run does not restyle every block you `add`. Written only when the app has no Prettier config (no `.prettierrc*`, `prettier.config.*` or `prettier` key in `package.json`); otherwise `init` prints the options and keeps yours.
4. **`src/azion-ui.css`** — the one CSS entry: `@import '@aziontech/theme'` (tokens + Tailwind v4 + fonts) and `@import '@aziontech/ui/styles'`, which registers Azion UI's source with Tailwind so its component classes compile. Both resolve by package name — no `../node_modules` path in your CSS (the `@source` ships inside the package and resolves relative to it, so hoisting/workspace layouts can't break it).
5. **`.mcp.json`** — the `azion-ui` MCP server (`npx -y @aziontech/ui-mcp@^<major>`, the major of the installed Azion UI, since every Azion UI package shares one version) merged in (other servers untouched); a v5 entry that still runs the removed `azion-ui-mcp` bin of `@aziontech/ui`, or an unpinned `@aziontech/ui-mcp`, is pointed at the pinned range.
6. **`prepare` script + `.husky/pre-commit`** — lint on commit, added only in a git repository (or where `.husky/pre-commit` already exists). Outside one, `init` adds no hook at all (no `husky` dependency, no `prepare`, no `.husky/`) and prints one line: after `git init`, run `init` again to add it. The hook lints the source only (`npx eslint src`, `npx stylelint "src/**/*.{css,scss,vue}" --allow-empty-input`), so a build never breaks the next commit; a whole-tree hook written by an older `init` is rewritten in place, keeping your own lines. Activation depends on git:
   - **a git repository with husky installed** — `init` runs husky itself (`core.hooksPath = .husky/_`);
   - **a git repository, husky not installed yet** — the install runs `prepare` (husky), which activates the hooks;
   - **a `.husky/pre-commit` you kept, outside a git repository** — `init` says husky cannot activate it until `git init` and `npx husky`;
   - **a project below the git root** (a monorepo package) — `init` prints the `"prepare": "cd <root> && husky <path>/.husky"` form husky needs there.

   `init` also lists any stylesheet under `src/` with raw colours (hex, `rgb()`, `hsl()` — a starter template's `style.css` usually has them): the hook's stylelint rejects them, so replace them with tokens or delete the starter stylesheet before the first commit.

7. **Agent files in `.agents/`** — every `rules/*.md`, `skills/*/SKILL.md` and `agents/*.md` template, derived from the templates directory itself (so a new template ships automatically instead of needing a hand-maintained list; anything outside that shape, such as a skill's `references/`, is not shipped, and a test fails if one appears so shipping it is a deliberate decision), copied via the same policy as `sync` (see below): on a fresh project every file is missing, so `init` copies all of them — each stamped with a provenance marker so a later `sync` can tell a pristine copy from one you have edited.
   `.agents/` is the one real copy, read by any coding agent (Codex, Cursor, Copilot, Gemini CLI, Claude Code). When the project uses Claude Code (it has `.claude/` or `CLAUDE.md`), or with `--claude`, `init` also writes the **Claude Code adapter**: a short pointer file in `.claude/skills/<name>/SKILL.md` and `.claude/agents/<name>.md` for each skill and agent (the same frontmatter, and a body that says to read the `.agents/` file), plus a fenced `@AGENTS.md` import in `CLAUDE.md`. Rules are not copied to `.claude/`; `AGENTS.md` points at `.agents/rules/`.
8. **`AGENTS.md` block** — kept in a fenced block (`<!-- @aziontech/ui:start -->` … `<!-- @aziontech/ui:end -->`) that is replaced in place on every `init` run, so template updates reach a project that already ran `init` once. A pre-fence legacy marker (`<!-- @aziontech/ui -->`) from an older `init` is migrated into the fence automatically; a fragment duplicated at more than one position (however it got that way) is repaired down to a single fenced block.
9. **CSS scan list** — `src/azion-ui.sources.css`, one `@source` per Azion UI file the app imports (the components plus what they import), so the app's stylesheet holds only their classes; `src/azion-ui.css` imports it. An existing `vite.config` gets `azionUi()` from `@aziontech/ui/vite-plugin`, which rewrites the list on every dev start, build and import change (a changed file is read again once it settles, so a half-written file never shrinks the list); with no Vite config, `init` says to run `npx @aziontech/ui css` after changing imports.
10. **Entry wiring** — `import './azion-ui.css'` and `import '@aziontech/icons'` prepended once to `src/main.*`; skipped when already imported, `--no-entry` prints the imports instead of editing the file. The starter stylesheet of a `create-vite` app (`src/style.css`, `import './style.css'`) or a `create-vue` app (`src/assets/main.css` + `base.css`, `import './assets/main.css'`) is removed when it is byte-for-byte the template's, and its import line becomes `import './azion-ui.css'`: its global rules (body margin and colours, `#app` width) fight the theme. A starter you edited, or one another file imports (a Cypress support file), is left in place with a note.

Feature-scoped setup is deliberately **not** part of `init`. A component that needs one-time app wiring (e.g. toast: `.use(ToastPlugin)` on `createApp()` — the plugin mounts the region automatically) declares it in its catalog entry's `setup` field, surfaced by the MCP's `get_component` / `get_best_practices` — so it is wired **just-in-time at first use**, by you or your AI, instead of preloading unused code for everyone. `doctor` backstops it mechanically (see below).

## Options

| Flag            | Effect                                                          |
| --------------- | --------------------------------------------------------------- |
| `--dry-run`     | Print the plan; write nothing.                                  |
| `--strict`      | Strict ESLint preset (default).                                 |
| `--recommended` | Recommended preset — every rule is still `error`, never `warn`. |
| `-y`, `--yes`   | Accept every default; never prompt (CI / scripted runs).        |
| `--no-icons`    | Skip `@aziontech/icons` (the icon font) and its entry import.   |
| `--no-entry`    | Do not edit `src/main.*`; print the imports to add instead.     |

Unknown flags are rejected (so a typo'd `--dryrun` never becomes a real write run).

## `add`, `diff`, `remove`, `search`, `view` — start a screen from a block

```bash
npx @aziontech/ui search delete confirmation          # blocks, components, examples
npx @aziontech/ui view edit/edit-delete-dialog   # guidelines, variants, SFC
npx @aziontech/ui add edit/edit-delete-dialog [--variant SettingsRow]
npx @aziontech/ui diff delete-dialog       # your copy vs the canonical block
npx @aziontech/ui remove delete-dialog [--dry-run]   # delete the copy and its record
```

- **`search <query>`** runs the MCP queries (`search_blocks`, `search_components`, plus the
  component examples) in the terminal. **`view <id>`** prints a component's API (props, events,
  slots, parts, the first example or `--example <name>`) or a block's summary, variants, imports,
  guidelines and SFC (`--variant <name>`). Both take `--json`.
- **`add <block-id>`** takes a full id, a short name (`create-hub`) or a pre-v6 id (it resolves and
  says so). It copies the block's primary SFC from the installed Azion UI's `blocks/` to
  `<views>/<block>.vue` (kebab-case, `create-hub.vue`), and with `--variant <state>` that state as
  `<block>-<state>.vue` (`create-hub-connected.vue`; a PascalCase `--dest` file keeps its casing,
  `Hub.vue` and `HubConnected.vue`). `<views>` is
  the directory the router (`src/router/index.*`, `src/router.*`) imports its views from, else
  `src/views`, else `src/pages`; `--dest <dir|file.vue>` overrides it. Every
  `@aziontech/ui/*` import of the copy is checked against the installed package's `exports`
  (an import it does not export is an error, and nothing is written), and every other package it
  imports is checked as installed. `--with-guidelines` also writes the block guidelines, without
  their heading, as `<Name>.guidelines.md`. It records the copy in `azion-ui.blocks.json` (block id,
  Azion UI version, source file, variant, `sha256` checksum) and prints the route entry to add, with
  the `@/` alias when the project has one. It never overwrites a file without `--force`;
  `--dry-run` writes nothing. Commit `azion-ui.blocks.json`.
- **`diff <block-id|path>`** finds the copy through `azion-ui.blocks.json` and prints a unified diff
  from the canonical block of the installed version to your file (coloured on a TTY, `NO_COLOR`
  respected; `--json` for tools). It also says when the canonical block changed since the copy was
  made. Exit 0 when identical, 1 when different, 2 when the target is not recorded.
- **`remove <block-id|path>`** finds the copy through `azion-ui.blocks.json` and deletes its files
  (the primary, every copied variant, the data files such as `<block>.sample.ts` and the
  `<block>.guidelines.md` sidecar) and its entry, edited or not; a path removes that one file and
  keeps the rest of the block recorded. It then refreshes `src/azion-ui.sources.css` and lists the app
  files that still import a deleted file (the route entry, a parent view): remove those imports by
  hand. `--dry-run` deletes nothing and prints what it would; `--json` for tools. Exit 1 when the
  target is not recorded.

The blocks, `catalog.json` and `catalog/` ship in the npm package, so these commands work offline
from the installed version. Without Azion UI installed (a bare `npx`), they read the package `npx`
fetched and say so.

## `check` — one CI gate

```bash
npx @aziontech/ui check [--json] [--max-warnings <n>] [--no-lint] [--url <url,...>]
```

`check` runs, in one pass:

- **doctor** — every check below; `FAIL` is an error, `WARN` a warning;
- **v5 names** — every source file through the `migrate v6` map: a renamed import, component or
  prop is an error naming `migrate v6`, a removed component one to replace by hand;
- **imports** — an `@aziontech/ui/*` subpath the installed version does not export, with its
  line;
- **lint** — the project's own ESLint on `src/` (or `.`), keeping the `azion-ui/*` rule hits as
  errors with file and line. When ESLint is not installed or not configured (or `--no-lint`), a
  built-in scan of `.vue` class attributes covers raw hex and palette colours and physical
  direction utilities (the `no-physical-direction` helper), and a warning says the full rule set
  did not run;
- **stylelint** — the project's own Stylelint on `src/**/*.{css,scss,vue}` (or
  `**/*.{css,scss,vue}` without `src/`), the same files the pre-commit hook `init` installs lints,
  so `check` fails whenever that hook would. Every problem it reports is kept with its file, line
  and rule: an `error` is an error, a `warning` a warning. When Stylelint is not installed or not
  configured (or `--no-lint`), a built-in scan (source `css`) applies the
  `@aziontech/ui/stylelint-config` rules to `.css` / `.scss` files, `<style>` blocks and
  `style="…"` attributes — hex colours, `rgb()`/`hsl()`, named colours, literal durations,
  `cubic-bezier()`, `transition: all`, a zero with a unit — and a warning says Stylelint did not
  run;
- **blocks** — every copy in `azion-ui.blocks.json` whose canonical block changed since it was
  copied, whose file is gone, or whose source the installed version no longer ships (warnings);
- **navigation** — only with `--url`: each listed route of the running app (comma-separated) is
  opened in headless Chromium through the project's own `playwright` (`npm i -D playwright && npx
playwright install chromium`; without it the check is an error saying so). On each route it
  collects the links of every visible navigation control (`nav` / `role="navigation"`, such as the
  rail with its current drill level and an in-page `SidebarMenu`, and `role="tablist"`; the breadcrumb,
  pagination, hidden or inert levels and `#anchor` links are left out) and reports an error, named
  after both controls and the route, for rule `azion-ui-navigation-levels`: a route (path without
  query or hash) offered by two controls, a control with more than one `aria-current="page"`, or
  two controls whose current rows point at different routes, neither a parent of the other.

It exits 1 on any error, or when there are more warnings than `--max-warnings` (every warning
counts: doctor `WARN`s, Stylelint warnings, a linter that did not run, block drift). `--json`
prints `{ eslint, stylelint, errors, warnings, maxWarnings, exitCode, findings: [{ source,
severity, file, line, rule, message }] }`; `eslint` / `stylelint` say whether the project's own
linter ran, and `source` is one of `doctor`, `migration`, `imports`, `lint`, `style`,
`stylelint`, `css`, `blocks`, `navigation`; with `--url` it also lists the checked `routes`.

## `report` and `canary` — measure and verify Azion UI adoption

```bash
npx @aziontech/ui report   # adoption score via this project's own ESLint
npx @aziontech/ui canary   # proves the design-system rules still reach this project
```

Full documentation: [`docs/toolkit/REPORT.md`](./REPORT.md).

## `css` — compile only the Azion UI files the app imports

```bash
npx @aziontech/ui css          # rewrite src/azion-ui.sources.css
npx @aziontech/ui css --check  # write nothing; exit 1 when it is stale
```

Azion UI is consumed as source and Tailwind compiles the classes of the files it scans, so the app's
`src/azion-ui.css` imports `src/azion-ui.sources.css`: one `@source` per Azion UI file the app's
`@aziontech/ui/<name>` imports reach (each component and what it imports, inside
`src/components`, `src/composables` and `src/utils`). The Vite plugin does the same on every dev
start and build, and again when a file adds or drops an Azion UI import:

```ts
import vue from '@vitejs/plugin-vue'
import azionUi from '@aziontech/ui/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [azionUi(), vue()] })
```

`azionUi({ file })` moves the list (default `src/azion-ui.sources.css`, relative to the Vite root). `add`
rewrites the list after it copies a block. An app that renders every component imports
`@aziontech/ui/styles/all` instead.

## `doctor` — check the wiring is healthy

```bash
npx @aziontech/ui doctor
```

The toolkit is fail-open by design (a missing catalog disables the lint rules rather than crashing), so a half-broken install is otherwise silent. `doctor` reads the project and reports each check as `OK` / `WARN` / `FAIL`:

- **vue / tailwind version** — vue ^3.5 and Tailwind 4.1 or later installed (`WARN` when not installed, `FAIL` on another major);
- **theme import** — `src/azion-ui.css` imports `@aziontech/theme` (`FAIL` = no tokens);
- **lint plugin** — the ESLint config loads `@aziontech/ui/eslint-plugin`;
- **config provider** — a `ConfigProvider` is mounted somewhere in `src/` (`WARN`: locale and direction fall back to English, left to right);
- **Azion UI catalog** resolvable (`FAIL` = lint rules are disabled — install Azion UI or set `AZION_UI_CATALOG_PATH`);
- **eslint / stylelint config** present;
- **azion-ui.css** registers Azion UI with Tailwind: `@import './azion-ui.sources.css'` (or `@aziontech/ui/styles/all`, or an inline `@source`) — `FAIL` = unstyled components (since 6.0 `@aziontech/ui/styles` alone scans nothing);
- **azion-ui css sources** — `src/azion-ui.sources.css` lists every Azion UI file the app's imports reach (`FAIL` when stale: the components it misses render unstyled; `npx @aziontech/ui css` rewrites it);
- **Azion UI vite plugin** — the Vite config runs `@aziontech/ui/vite-plugin`, which keeps that list current (`WARN` when missing);
- **mcp server** registered in `.mcp.json` (`FAIL` when it still runs the v5 `azion-ui-mcp` bin of `@aziontech/ui`);
- **husky** `prepare` script + `.husky/pre-commit` lint block present (`WARN` when the hook still lints the whole tree, build output included — re-run `init`);
- **git hooks** — the folder is a git repository and `core.hooksPath` points at `.husky/` (`WARN` when the install ran before `git init`: run `npx husky`). Outside a git repository with no hook wired, it is `OK` (init skipped the hooks on purpose) and the two husky checks are not shown;
- **build output ignored** — the ESLint config and `.stylelintignore` (or Stylelint's `ignoreFiles`) skip `dist/`;
- **raw colours in styles** — shown only when a stylesheet under `src/` has hex/rgb/hsl values the Azion UI stylelint will reject on commit (`WARN`);
- **styles import** (`./azion-ui.css`) at the app entry, and the **icons import** when `@aziontech/icons` is a dependency;
- **toast setup** — only when the source imports `@aziontech/ui/toast`: a region must be wired (`.use(ToastPlugin)` in the entry, or a mounted Toaster), otherwise `WARN` with the exact fix;
- **dependency versions** — the resolved installed version of each toolkit dependency, with a `WARN` for any still pinned as `latest` (and the suggested `^x.y.z` pin);
- **agent files** — every `.agents/` rule/skill/agent, the `AGENTS.md` block and, with the Claude Code adapter, the `.claude/` pointers and the `CLAUDE.md` import are current for this Azion UI version. `FAIL` when anything is `missing`/`stale`/`orphan` (drift — the same condition `sync --check` exits 1 on); `WARN` when the only issue is a file you edited locally (`modified`) — the detail line always names `npx @aziontech/ui sync` as the fix.

It writes nothing and exits non-zero if any check is `FAIL` — safe to run in CI as a setup gate.

## `sync` — reconcile the agent files and the `AGENTS.md` block

```bash
npx @aziontech/ui sync [--check] [--dry-run] [--force] [--json] [--claude]
```

`init` copies the agent files once, skip-if-exists — an upstream update to a rule/skill/agent never reaches a project that already ran `init`, and there is no way to tell a pristine copy from one you edited on purpose. `sync` fixes both: every file `init`/`sync` writes into `.agents/` (and each `.claude/` pointer) carries one inert HTML-comment **provenance marker** —

```
<!-- azion-ui-sync source=rules/azion-ui-imports.md version=5.0.0 sha256=2751a3a2f303ad21 -->
```

— placed on line 1 for a file with no frontmatter, or as the first line after the closing `---` of a YAML frontmatter block (skills/agents), so it is never mistaken for a frontmatter key. `sha256` is the first 16 hex chars of a hash of the file's own body (the marker line removed, `\r\n` normalized to `\n`). It's an HTML comment specifically because that is inert in rendered Markdown, adds no YAML key for an agent tool to validate, and works identically whether or not the file has frontmatter.

Comparing that hash to a freshly computed one is how `sync` classifies every bundle file, and the same policy decides what it does about each:

| State                 | Meaning                                                                                                                                                              | Action (default)                                      | Action (`--force`)       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------ |
| `missing`             | not present in the project yet                                                                                                                                       | **COPY** (write, stamped)                             | same                     |
| `current`             | marker present, body unchanged since stamped, template unchanged since                                                                                               | nothing                                               | same                     |
| `stale`               | marker present, body unchanged since stamped, but the **template** has since changed                                                                                 | **UPDATE** (rewrite, stamped)                         | same                     |
| `modified`            | marker present, but the body no longer matches its own marker hash (you edited it)                                                                                   | **SKIP** (left alone, reported)                       | **STAMP** (overwritten)  |
| `unstamped-identical` | no marker, but the body is byte-identical to the template (a pre-`sync` copy)                                                                                        | **STAMP** (marker added, content otherwise unchanged) | same                     |
| `unstamped-different` | no marker, and the body differs from the template                                                                                                                    | **SKIP** (left alone, reported)                       | **STAMP** (overwritten)  |
| `orphan`              | an `azion-ui-*`-named file under `.agents/{rules,skills,agents}` or `.claude/{skills,agents}` carries a marker whose `source` no longer exists in the current bundle | **ORPHAN** (reported only)                            | same — **never deleted** |

The `AGENTS.md` block (and, with the Claude Code adapter, the `CLAUDE.md` import) is tracked separately (it isn't one file among many; it's the one fenced block `init` already replaces wholesale — see above), with its own three drift states — `missing`, `legacy` (a pre-fence marker that needs migrating), `stale` (the fence exists but its body no longer matches the current template) — each printed as **FENCE**; `current` prints nothing.

**`drift`** — the condition `--check`'s exit code reports — is true when anything is `missing`, `stale`, or `orphan`, or a fenced block is anything but `current`. A `modified` file is **not** drift: it is a deliberate local edit, reported so you know about it, never touched without `--force`.

If a marker's `sha256` is hand-edited while the body stays pristine, the recomputed body hash no longer matches the (tampered) marker hash, so the file classifies as `modified` — indistinguishable from, and treated the same as, a genuine local edit. That's deliberate: there's no way to tell "the body changed" from "the marker changed" from content alone, and `modified` is the safe side to err on — sync never overwrites either without `--force`.

### Flags

| Flag        | Effect                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------- |
| `--check`   | Apply nothing. Print the state table. **Exit 1 if `drift`, else exit 0.** The CI gate.      |
| `--dry-run` | Apply nothing. Print what would happen. Always exits 0 (unless an internal error — exit 2). |
| `--force`   | Also overwrite `modified` / `unstamped-different` files with the current stamped template.  |
| `--json`    | Print `{ drift, fragment, entries: [{ rel, path, state, action }] }` instead of the table.  |
| `--claude`  | Also write the Claude Code adapter (written anyway when `.claude/` or `CLAUDE.md` exists).  |

Exit codes: **0** nothing to do / applied successfully; **1** only from `--check` when `drift` is true; **2** an internal error (e.g. a malformed file it could not read) — the state table is not to be trusted if you see this.

Sample output (default run, applying):

```
@aziontech/ui sync
project: /path/to/app

COPY   .agents/rules/azion-ui-comments.md (missing)
UPDATE .agents/rules/azion-ui-imports.md (stale)
SKIP   .agents/rules/azion-ui-styling.md (modified)
ORPHAN .agents/rules/azion-ui-retired-rule.md (orphan)
FENCE  AGENTS.md (fragment stale)

4 action(s), 40 current, fragment stale, drift: yes
```

`sync` touches only `.agents/{rules,skills,agents}`, `AGENTS.md` and, with the Claude Code adapter, `.claude/{skills,agents}` and `CLAUDE.md` — never `.husky`, `.mcp.json`, `package.json`, or anything else `init` wired.

Consumers are expected to keep their `.agents/` files (and `.claude/` pointers) **committed**, and to run `sync --check` in CI (it is read-only and exits non-zero on drift) so an upstream Azion UI update is caught instead of silently going stale.

## Project contract

Every repository that builds Azion product screens or web pages on Azion UI meets these conditions
before any UI work, and the skills (`azion-ui-product-screens`, `azion-ui-site-pages`) check them first:

1. `@aziontech/ui`, `@aziontech/theme` and `@aziontech/icons` are installed at a version the
   repository pins.
2. `init` has run: lint, styles, the theme entry, the MCP server, the pre-commit lint, the
   agent files in `.agents/` and the `AGENTS.md` block are wired.
3. The lint preset is the strictest one the package offers (`strict`).
4. The agent files are committed and current: `sync --check` exits 0. A deliberate local edit is
   reported, never treated as the rule; a rule changes in Azion UI.
5. `doctor` reports no `FAIL`.

`init`, `sync` and CI changes touch the repository for everyone who works in it: show the
`--dry-run` plan and run them only with the person's consent.

| CI gate          | Passes when                                                  |
| ---------------- | ------------------------------------------------------------ |
| Wiring           | `doctor` exits 0                                             |
| Rules reach code | `canary` proves the lint rules still fire in this repository |
| Agent bundle     | `sync --check` exits 0                                       |
| Lint and styles  | no new violation over the repository's baseline (`check`)    |
| Adoption report  | `report` writes the adoption numbers to the run summary      |

A repository with existing violations runs lint as a ratchet: the baseline records today's count
and a pull request may only lower it. A baseline is never raised, and a rule never disabled, to
make a gate pass.

### Which copy of a rule to read

Read every rule, skill and agent at the version the project runs, from the first of these that
exists:

1. the project's `.agents/` files, when `sync --check` reports them current;
2. `node_modules/@aziontech/ui/` (`rules/`, `skills/`, `agents/`, `docs/`,
   `llms/`, `catalog.json`), for stale or edited files or a file outside them;
3. the published package by URL at the installed version
   (`https://cdn.jsdelivr.net/npm/@aziontech/ui@<version>/<path>`), when nothing is installed;
4. the Azion UI repository, only for a change not yet published.

Cite what was read as `@aziontech/ui@<version> <path>`.

## Dependency versions

`init` records each missing toolkit dependency as a caret range (`^9.39.3`), keeps one you already declare at a compatible or newer version, and raises only one older than Azion UI needs — it never downgrades. `vue-tsc` is never rewritten: when your range can resolve to a release with a known bug (3.3.12 to 3.3.14), `init` and `doctor` print the pin (`npm i -D vue-tsc@3.3.11`) for you to run. After you install, run `doctor` to see the **resolved** versions and pin the ones you want to freeze — this keeps `init` simple and offline while giving you a reproducible pin when you're ready.

## Idempotency

`init` is safe to run repeatedly: existing files are skipped or merged, never overwritten; the MCP server and the `prepare` script are added only if absent. The `AGENTS.md` block is the one piece of wiring that is **not** add-once: its fenced block is kept current in place on every run, so a later `@aziontech/ui` version's updated invariants/skills reach a project that already ran `init` — while everything outside the fence is left untouched. A malformed `package.json` / `.mcp.json` is reported as an error and left untouched — never replaced. `doctor` is read-only.

## License

MIT

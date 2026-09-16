# webkit CLI — `init` + `doctor` + `sync`

One command to adopt the [`@aziontech/webkit`](https://github.com/aziontech/webkit) design system in an existing project — correctly and performantly by construction. The CLI ships **inside** `@aziontech/webkit` (the `webkit` bin) — there is no separate CLI package.

```bash
npx @aziontech/webkit init
```

It wires everything and then gets out of the way: after setup there are no extra commands to remember. The FORCE layer (ESLint + Stylelint) blocks incorrect usage on commit and in CI; the GUIDE layer (the webkit MCP + a Claude Code bundle) helps you and your AI write correct code from the start.

## What `init` does

The plan is computed by reading your project first, then applied without ever clobbering your files — each step either writes something absent, merges/appends behind a marker, patches once behind an idempotency check, or just advises.

On a TTY (and without `--yes`), `init` first asks about the optional pieces — install the icon font? wire the entry imports automatically? — one Y/n question each. Piped/CI runs never prompt: they take the defaults (everything on) minus any `--no-*` flag.

1. **Dependencies** recorded in `package.json` — `@aziontech/webkit`, `@aziontech/theme`, `@aziontech/icons` (unless `--no-icons`), plus dev tooling peers (`eslint`, `stylelint`, `vue-eslint-parser`, `@typescript-eslint/parser`, `postcss-html`, `postcss-scss`, `husky`). The ESLint plugin, Stylelint config, and MCP server all ship inside `@aziontech/webkit` (subpaths + bins), so no separate toolkit packages are added. It does not run an install — do that with your package manager.
2. **`eslint.config.mjs`** (flat, ESM) wiring the webkit preset — or a merge snippet if an ESLint config already exists.
3. **`.stylelintrc.json`** extending the webkit config, with the `.vue` / `.scss` custom syntaxes wired — or a merge snippet if a Stylelint config already exists.
4. **`src/webkit.css`** — the one CSS entry: `@import '@aziontech/theme'` (tokens + Tailwind v4 + fonts) and `@import '@aziontech/webkit/styles'`, which registers webkit's source with Tailwind so its component classes compile. Both resolve by package name — no `../node_modules` path in your CSS (the `@source` ships inside the package and resolves relative to it, so hoisting/workspace layouts can't break it).
5. **`.mcp.json`** — the `webkit` MCP server merged in (other servers untouched).
6. **`prepare` script + `.husky/pre-commit`** — lint on commit. The install runs `prepare` (husky), which activates the hooks.
7. **`.claude/` bundle** — every rule, skill, and agent template, derived from the templates directory itself (so a new template ships automatically instead of needing a hand-maintained list), copied via the same policy as `sync` (see below): on a fresh project every file is missing, so `init` copies all of them — each stamped with a provenance marker so a later `sync` can tell a pristine copy from one you have edited.
8. **`CLAUDE.md` fragment** — kept in a fenced block (`<!-- @aziontech/webkit:start -->` … `<!-- @aziontech/webkit:end -->`) that is replaced in place on every `init` run, so template updates reach a project that already ran `init` once. A pre-fence legacy marker (`<!-- @aziontech/webkit -->`) from an older `init` is migrated into the fence automatically; a fragment duplicated at more than one position (however it got that way) is repaired down to a single fenced block.
9. **Entry wiring** — `import './webkit.css'` and `import '@aziontech/icons'` prepended once to `src/main.*`; skipped when already imported, `--no-entry` prints the imports instead of editing the file.

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

## `doctor` — check the wiring is healthy

```bash
npx @aziontech/webkit doctor
```

The toolkit is fail-open by design (a missing catalog disables the lint rules rather than crashing), so a half-broken install is otherwise silent. `doctor` reads the project and reports each check as `OK` / `WARN` / `FAIL`:

- **webkit catalog** resolvable (`FAIL` = lint rules are disabled — install webkit or set `WEBKIT_CATALOG_PATH`);
- **eslint / stylelint config** present;
- **webkit.css** registers webkit with Tailwind (`@import '@aziontech/webkit/styles'`, or a legacy inline `@source`) — `FAIL` = unstyled components;
- **mcp server** registered in `.mcp.json`;
- **husky** `prepare` script + `.husky/pre-commit` lint block present;
- **styles import** (`./webkit.css`) at the app entry, and the **icons import** when `@aziontech/icons` is a dependency;
- **toast setup** — only when the source imports `@aziontech/webkit/toast`: a region must be wired (`.use(ToastPlugin)` in the entry, or a mounted Toaster), otherwise `WARN` with the exact fix;
- **dependency versions** — the resolved installed version of each toolkit dependency, with a `WARN` for any still pinned as `latest` (and the suggested `^x.y.z` pin);
- **claude bundle** — every `.claude/` rule/skill/agent and the `CLAUDE.md` fragment are current for this webkit version. `FAIL` when anything is `missing`/`stale`/`orphan` (drift — the same condition `sync --check` exits 1 on); `WARN` when the only issue is a file you edited locally (`modified`) — the detail line always names `npx @aziontech/webkit sync` as the fix.

It writes nothing and exits non-zero if any check is `FAIL` — safe to run in CI as a setup gate.

## `sync` — reconcile the `.claude/` bundle and `CLAUDE.md` fragment

```bash
npx @aziontech/webkit sync [--check] [--dry-run] [--force] [--json]
```

`init` copies the `.claude/` bundle once, skip-if-exists — an upstream update to a rule/skill/agent never reaches a project that already ran `init`, and there is no way to tell a pristine copy from one you edited on purpose. `sync` fixes both: every file `init`/`sync` writes into `.claude/` carries one inert HTML-comment **provenance marker** —

```
<!-- webkit-sync source=claude/rules/webkit-imports.md version=5.0.0 sha256=2751a3a2f303ad21 -->
```

— placed on line 1 for a file with no frontmatter, or as the first line after the closing `---` of a YAML frontmatter block (skills/agents), so it is never mistaken for a frontmatter key. `sha256` is the first 16 hex chars of a hash of the file's own body (the marker line removed, `\r\n` normalized to `\n`). It's an HTML comment specifically because that is inert in rendered Markdown, adds no YAML key for Claude Code (or anything else) to validate, and works identically whether or not the file has frontmatter.

Comparing that hash to a freshly computed one is how `sync` classifies every bundle file, and the same policy decides what it does about each:

| State                 | Meaning                                                                                                                              | Action (default)                                      | Action (`--force`)       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | ------------------------ |
| `missing`             | not present in the project yet                                                                                                       | **COPY** (write, stamped)                             | same                     |
| `current`             | marker present, body unchanged since stamped, template unchanged since                                                               | nothing                                               | same                     |
| `stale`               | marker present, body unchanged since stamped, but the **template** has since changed                                                 | **UPDATE** (rewrite, stamped)                         | same                     |
| `modified`            | marker present, but the body no longer matches its own marker hash (you edited it)                                                   | **SKIP** (left alone, reported)                       | **STAMP** (overwritten)  |
| `unstamped-identical` | no marker, but the body is byte-identical to the template (a pre-`sync` copy)                                                        | **STAMP** (marker added, content otherwise unchanged) | same                     |
| `unstamped-different` | no marker, and the body differs from the template                                                                                    | **SKIP** (left alone, reported)                       | **STAMP** (overwritten)  |
| `orphan`              | a `webkit-*`-named file under `.claude/{rules,skills,agents}` carries a marker whose `source` no longer exists in the current bundle | **ORPHAN** (reported only)                            | same — **never deleted** |

The `CLAUDE.md` fragment is tracked separately (it isn't one file among many; it's the one fenced block `init` already replaces wholesale — see above), with its own three drift states — `missing`, `legacy` (a pre-fence marker that needs migrating), `stale` (the fence exists but its body no longer matches the current template) — each printed as **FENCE**; `current` prints nothing.

**`drift`** — the condition `--check`'s exit code reports — is true when anything is `missing`, `stale`, or `orphan`, or the fragment is anything but `current`. A `modified` file is **not** drift: it is a deliberate local edit, reported so you know about it, never touched without `--force`.

### Flags

| Flag        | Effect                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------- |
| `--check`   | Apply nothing. Print the state table. **Exit 1 if `drift`, else exit 0.** The CI gate.      |
| `--dry-run` | Apply nothing. Print what would happen. Always exits 0 (unless an internal error — exit 2). |
| `--force`   | Also overwrite `modified` / `unstamped-different` files with the current stamped template.  |
| `--json`    | Print `{ drift, fragment, entries: [{ rel, state, action }] }` instead of the text table.   |

Exit codes: **0** nothing to do / applied successfully; **1** only from `--check` when `drift` is true; **2** an internal error (e.g. a malformed file it could not read) — the state table is not to be trusted if you see this.

Sample output (default run, applying):

```
@aziontech/webkit sync
project: /path/to/app

COPY   .claude/rules/webkit-comments.md (missing)
UPDATE .claude/rules/webkit-imports.md (stale)
SKIP   .claude/rules/webkit-styling.md (modified)
ORPHAN .claude/rules/webkit-retired-rule.md (orphan)
FENCE  CLAUDE.md (fragment stale)

4 action(s), 40 current, fragment stale, drift: yes
```

`sync` touches only `.claude/{rules,skills,agents}` and `CLAUDE.md` — never `.husky`, `.mcp.json`, `package.json`, or anything else `init` wired.

Consumers are expected to keep their `.claude/` copies **committed**, and to run `sync --check` in CI (it is read-only and exits non-zero on drift) so an upstream webkit update is caught instead of silently going stale.

## Dependency versions

`init` records the toolkit dependencies as `latest` (so a fresh setup installs the newest published packages) and never re-pins a dependency you already pinned. After you install, run `doctor` to see the **resolved** versions and pin the ones you want to freeze — this keeps `init` simple and offline while giving you a reproducible pin when you're ready.

## Idempotency

`init` is safe to run repeatedly: existing files are skipped or merged, never overwritten; the MCP server and the `prepare` script are added only if absent. The CLAUDE.md fragment is the one piece of wiring that is **not** add-once: its fenced block is kept current in place on every run, so a later `@aziontech/webkit` version's updated invariants/skills reach a project that already ran `init` — while everything outside the fence is left untouched. A malformed `package.json` / `.mcp.json` is reported as an error and left untouched — never replaced. `doctor` is read-only.

## License

MIT

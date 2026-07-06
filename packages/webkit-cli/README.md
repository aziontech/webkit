# @aziontech/webkit-cli

One command to adopt the [`@aziontech/webkit`](https://github.com/aziontech/webkit) design system in an existing project — correctly and performantly by construction.

```bash
npx @aziontech/webkit-cli init
```

It wires everything and then gets out of the way: after setup there are no extra commands to remember. The FORCE layer (ESLint + Stylelint) blocks incorrect usage on commit and in CI; the GUIDE layer (the webkit MCP + a Claude Code bundle) helps you and your AI write correct code from the start.

## What `init` does

The plan is computed by reading your project first, then applied without ever clobbering your files — each step either writes something absent, merges/appends behind a marker, or just advises.

1. **Dependencies** recorded in `package.json` — `@aziontech/webkit`, `@aziontech/theme`, `@aziontech/icons`, plus dev tools (`@aziontech/eslint-plugin-webkit`, `@aziontech/stylelint-config-webkit`, `eslint`, `stylelint`, `vue-eslint-parser`, `postcss-html`, `postcss-scss`, `husky`). It does not run an install — do that with your package manager.
2. **`eslint.config.mjs`** (flat, ESM) wiring the webkit preset — or a merge snippet if an ESLint config already exists.
3. **`.stylelintrc.json`** extending the webkit config, with the `.vue` / `.scss` custom syntaxes wired — or a merge snippet if a Stylelint config already exists.
4. **`.mcp.json`** — the `webkit` MCP server merged in (other servers untouched).
5. **`prepare` script + `.husky/pre-commit`** — lint on commit. The install runs `prepare` (husky), which activates the hooks.
6. **`.claude/` bundle** — rules, the `webkit-usage` skill, and agents — only files that are missing.
7. **`CLAUDE.md` fragment** — appended once, guarded by a marker.
8. **Theme wiring advice** — if `src/main.*` lacks the theme import, it suggests adding it (never edits your entry file).

## Options

| Flag | Effect |
|---|---|
| `--dry-run` | Print the plan; write nothing. |
| `--strict` | Strict ESLint preset (default). |
| `--recommended` | Recommended preset (correctness = error, performance = warn). |

Unknown flags are rejected (so a typo'd `--dryrun` never becomes a real write run).

## `doctor` — check the wiring is healthy

```bash
npx @aziontech/webkit-cli doctor
```

The toolkit is fail-open by design (a missing catalog disables the lint rules rather than crashing), so a half-broken install is otherwise silent. `doctor` reads the project and reports each check as `OK` / `WARN` / `FAIL`:

- **webkit catalog** resolvable (`FAIL` = lint rules are disabled — install webkit or set `WEBKIT_CATALOG_PATH`);
- **eslint / stylelint config** present;
- **mcp server** registered in `.mcp.json`;
- **husky** `prepare` script + `.husky/pre-commit` lint block present;
- **theme import** at the app entry;
- **dependency versions** — the resolved installed version of each toolkit dependency, with a `WARN` for any still pinned as `latest` (and the suggested `^x.y.z` pin).

It writes nothing and exits non-zero if any check is `FAIL` — safe to run in CI as a setup gate.

## Dependency versions

`init` records the toolkit dependencies as `latest` (so a fresh setup installs the newest published packages) and never re-pins a dependency you already pinned. After you install, run `doctor` to see the **resolved** versions and pin the ones you want to freeze — this keeps `init` simple and offline while giving you a reproducible pin when you're ready.

## Idempotency

`init` is safe to run repeatedly: existing files are skipped or merged, never overwritten; the MCP server, the `prepare` script, and the CLAUDE.md fragment are added only if absent. A malformed `package.json` / `.mcp.json` is reported as an error and left untouched — never replaced. `doctor` is read-only.

## License

MIT

# `.claude/hooks/`

`PreToolUse` hooks for the Azion Webkit monorepo. Wired up in [`../settings.json`](../settings.json). Each hook runs **before** the matching tool call and can either approve (exit 0) or block (exit 2) the operation.

The hooks fail open on unexpected errors (invalid JSON input, missing files, etc.) — they never silently break the workflow.

## Hooks

### [`validate-tokens.mjs`](./validate-tokens.mjs)

Blocks `Write`/`Edit`/`MultiEdit` on `.vue` / `.css` / `.scss` / `.ts` files under `packages/webkit/src/components/webkit/**` when the **new** content introduces any of:

- Hex/RGB/HSL colors
- Tailwind palette names (`bg-gray-500`, `text-violet-600`, ...)
- Raw Tailwind text sizes (`text-xs|sm|base|lg|...`)
- Raw typography tokens (`text-[length:var(--text-*)]`, `leading-*`, `tracking-*`, `font-family`, `font-sora`, ...)
- PrimeVue color utilities (`text-color`, `surface-*`)
- `class` declared in `defineProps`
- `any` type
- `// @ts-ignore` / `// @ts-nocheck` / `// @ts-expect-error`

Pre-existing violations in the baseline file are **not** retroactively blocked — the hook only rejects newly-introduced ones.

### [`validate-references.mjs`](./validate-references.mjs)

Blocks `Write`/`Edit`/`MultiEdit` on any `.vue` / `.ts` / `.js` / `.mjs` / `.cjs` / `.tsx` / `.jsx` file when the **new** content introduces an import whose target does not exist:

- `@aziontech/webkit/<subpath>` not present in `packages/webkit/package.json#exports`
- Relative path with no matching file (`.vue`/`.ts`/`.js`/`/index.*` fallbacks all tried)
- Bare npm package not installed in any `node_modules/` of the monorepo
- `@aziontech/*` workspace that does not exist under `packages/`

Prevents the agent from hallucinating paths or speculatively importing modules that have not been installed yet.

### [`enforce-component-create.mjs`](./enforce-component-create.mjs)

Blocks the **first** `Write` that creates a new `.vue` under `packages/webkit/src/components/webkit/<category>/<name>/` when the session transcript shows no reference to the `component-create` skill. Forces the agent to read [`../../skills/component-create.md`](../../skills/component-create.md) and follow its workflow before creating webkit-layer components.

## Adding a new hook

1. Create `<name>.mjs` in this directory.
2. Read the tool input from stdin as JSON (`{ tool_name, tool_input, transcript_path, ... }`).
3. Exit `0` to approve, exit `2` with a message on stderr to block.
4. Wrap the entry point in `try/catch` and exit `0` on unexpected errors (fail open) — never break the workflow because of a hook bug.
5. Register the hook in [`../settings.json`](../settings.json) under the appropriate matcher (`Write|Edit|MultiEdit`, `Write`, etc.).
6. Add a section to this README describing what it blocks.

## Testing a hook manually

Save a sample input to a file and pipe it:

```bash
cat > /tmp/input.json <<'EOF'
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/abs/path/to/file.vue",
    "content": "..."
  }
}
EOF
node .claude/hooks/<hook>.mjs < /tmp/input.json
echo "exit: $?"
```

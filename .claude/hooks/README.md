# `.claude/hooks/`

`PreToolUse`/`PostToolUse` hooks for the Azion Webkit monorepo. Wired up in [`../settings.json`](../settings.json). Each hook runs around the matching tool call and can either approve (exit 0) or block (exit 2) the operation.

The hooks fail open on unexpected errors (invalid JSON input, missing files, etc.) — they never silently break the workflow.

Hooks do not own their logic: the checks live in **shared engines** ([`_lib/`](./_lib/) shims re-exporting [`packages/webkit/src/eslint-plugin/*.js`](../../packages/webkit/src/eslint-plugin/), plus the DS-internal `_lib/spec-compliance-checks.mjs` and `_lib/story-source-checks.mjs`) that the CI ratchet ([`packages/webkit/scripts/check-authoring.mjs`](../../packages/webkit/scripts/check-authoring.mjs)) re-runs repo-wide. The rule ⇄ gate pairing is declared in [`_lib/standards.mjs`](./_lib/standards.mjs) and asserted in CI by [`packages/webkit/test/standards/invariant.test.mjs`](../../packages/webkit/test/standards/invariant.test.mjs).

## Hooks

### [`validate-tokens.mjs`](./validate-tokens.mjs)

Blocks `Write`/`Edit`/`MultiEdit` on `.vue` / `.css` / `.scss` / `.ts` files under `packages/webkit/src/components/**` when the **new** content introduces any of:

- Hex/RGB/HSL colors
- Tailwind palette names (`bg-gray-500`, `text-violet-600`, ...)
- Raw Tailwind text sizes (`text-xs|sm|base|lg|...`)
- Raw typography tokens (`text-[length:var(--text-*)]`, `leading-*`, `tracking-*`, `font-family`, `font-sora`, ...)
- External/legacy color utilities (`text-color`, `surface-*`)
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

### [`validate-authoring.mjs`](./validate-authoring.mjs)

Blocks `Write`/`Edit`/`MultiEdit` when the resulting file introduces a construction-standard violation ([`props`](../rules/props.md), [`v-model`](../rules/v-model.md), [`emits`](../rules/emits.md), [`slots`](../rules/slots.md), [`composables`](../rules/composables.md), [`deprecation`](../rules/deprecation.md)):

- Hand-rolled `modelValue` prop + `update:modelValue` emit (use `defineModel`)
- Runtime `defineProps({...})` / `defineEmits([...])` (use the typed generic forms)
- `<slot>` in the template without a typed `defineSlots`
- A composable returning `reactive()` state or authored as `.js`
- `@deprecated` without a named replacement + removal version

Engine: [`_lib/authoring-checks.mjs`](./_lib/authoring-checks.mjs) → [`packages/webkit/src/eslint-plugin/authoring-checks.js`](../../packages/webkit/src/eslint-plugin/authoring-checks.js) — the same module the CI ratchet and the consumer ESLint rule (`authoring-standards`) run.

### [`validate-story-source.mjs`](./validate-story-source.mjs)

Blocks `Write`/`Edit`/`MultiEdit` on any `*.stories.*` file whose **resulting content** violates the [storybook-source](../rules/storybook-source.md) contract — the Docs "Show code" must be a single runnable PascalCase SFC. **Strict**: the whole stories tree is on the canonical pattern, so every check applies to the full result of the write (no "newly-introduced-only" grandfathering). 13 checks: `docs-not-literal`, `handrolled-transform`, `dynamic-source`, `nested-template`, `lowercase-tag` (native HTML tags exempt), `import-binding-mismatch`, `argtypes-regex`, `legacy-csf2-assignment`, `figma-reference`, `args-destructure`, `missing-helper`, `missing-source-code`, `missing-sourcestate` (foundations pages exempt from the helper/`toSfc` requirement).

Also runs standalone: `node .claude/hooks/validate-story-source.mjs --all` audits the entire stories tree and exits non-zero on any violation.

Engine: [`_lib/story-source-checks.mjs`](./_lib/story-source-checks.mjs) — shared with the CI ratchet.

### [`enforce-component-create.mjs`](./enforce-component-create.mjs)

Blocks the **first** `Write` that creates a new `.vue` under `packages/webkit/src/components/<category>/<name>/` when the session transcript shows no reference to the spec-driven pipeline. Forces the agent to run `/spec-create` then `/component-create`, which load the orchestrator at [`../commands/component-create.md`](../commands/component-create.md) and the focused skills under [`../skills/`](../skills/).

### [`enforce-spec-exists.mjs`](./enforce-spec-exists.mjs)

PreToolUse hook on `Write` of any `packages/webkit/src/components/<category>/<name>/<file>.vue`. Blocks when:

- `.specs/<name>.md` is missing.
- The spec's `status` is not `approved` or `implemented` (drafts cannot drive code generation; locked specs require a `spec_version` bump).
- The body sha256 does not match the frontmatter `checksum` (tamper detection).

Bypassed for components on the legacy whitelist ([`_lib/legacy-components.json`](./_lib/legacy-components.json)).

### [`validate-spec-compliance.mjs`](./validate-spec-compliance.mjs)

PostToolUse hook on `Write|Edit|MultiEdit` of the same `.vue` paths. Re-reads the file, parses `defineProps` / `defineEmits` / `defineSlots` / `defineOptions.name` / animation classes, and diffs against `.specs/<name>.md`. Blocks on any divergence:

- Missing or extra prop, event, slot, sub-component.
- Type mismatch in a union-literal prop.
- `defineOptions.name` not equal to the spec's PascalCase name.
- `data-testid` fallback different from `'<category>-<name>'`.
- Animation classes in the `.vue` that aren't in the spec's "Motion & Animations" table (or vice versa).
- Motion-bearing classes without a `motion-reduce:*` escape.

Bypassed for legacy components (same whitelist). Shared parser library: [`_lib/spec.mjs`](./_lib/spec.mjs).

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

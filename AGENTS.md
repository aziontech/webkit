# AGENTS.md

You are developing **WebKit itself** (the `@aziontech/webkit`, `@aziontech/theme` and
`@aziontech/icons` packages). If you are building an app _with_ WebKit, stop here: install it and
follow the `webkit-usage` skill that `npx @aziontech/webkit init` writes into your project.

## Where things live

| Area                                                                      | Audience                            | Ships to npm |
| ------------------------------------------------------------------------- | ----------------------------------- | ------------ |
| `packages/*`                                                              | everyone (the libraries)            | yes          |
| `skills/`, `rules/`, `adapters/`                                          | apps that consume WebKit            | yes          |
| `.claude/` (agents, commands, docs, hooks, rules, skills)                 | people and agents developing WebKit | no           |
| `.specs/`                                                                 | the contract of every component     | no           |
| `apps/docs/`, `apps/demos/`, `apps/visual/`, `lint-canaries/`, `.github/` | docs site, demos, visual suite, CI  | no           |

A skill or rule for building apps goes in `skills/` or `rules/` (`scope: general`). Anything only
WebKit developers need goes in `.claude/` (`scope: webkit`). `test/standards/ai-bundle-boundary`
fails the build when the two mix.

## Start here

1. Read [`.claude/AGENTS.md`](./.claude/AGENTS.md) — monorepo rules, commands, conventions.
2. New component or block: the AI flow, from a request issue to a PR —
   [`/webkit-new`](./.claude/commands/webkit-new.md) (component) or
   [`/webkit-new-block`](./.claude/commands/webkit-new-block.md) (block). It runs these steps in
   order and stops on the first failure:
   1. read the issue (`.github/ISSUE_TEMPLATE/new-component.yml` / `new-block.yml`);
   2. research the benchmarks (Cloudscape `index.html.md`, shadcn) and the catalog for reuse
      (`reuse-audit`, MCP `search_components` / `search_patterns`, `catalog.json#aliases`);
   3. write the spec as `draft` (`spec-create`, template 2) or the block brief;
   4. spec review by a second agent ([`spec-reviewer`](./.claude/agents/spec-reviewer.md)); on
      approval `spec-validate` flips it to `approved` with a checksum;
   5. build (`/component-create`: component, test, examples, story — or `block.json`, `.vue`,
      `variants/`);
   6. machine gates (`pnpm --filter @aziontech/webkit run gates`, lint, types, size, Vitest);
   7. `ui-craft` review ([`.claude/skills/ui-craft/SKILL.md`](./.claude/skills/ui-craft/SKILL.md)),
      findings fixed or listed;
   8. usage check (`packages/webkit/scripts/usage-check.mjs`): a fresh agent must pick the new
      piece through the MCP and pass `webkit doctor`;
   9. PR from [`.github/pull_request_template.md`](./.github/pull_request_template.md).

   Nothing under `packages/webkit/src/components/` is written without an approved
   `.specs/<name>.md`; the hooks block it.

3. A change to an existing component runs the same flow from step 2 with its spec; every new or
   changed component, example or block goes through the `ui-craft` review before its PR opens.
   Add, Change, Deprecate and Remove: [component lifecycle](./CONTRIBUTING.md#component-lifecycle).
4. What to regenerate when WebKit changes, and the AI flow in detail: [`CONTRIBUTING.md`](./CONTRIBUTING.md).
5. The plan: [`ROADMAP.md`](./ROADMAP.md).

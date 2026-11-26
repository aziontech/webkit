# AGENTS.md

WebKit has two audiences, and each has one door. Any coding agent works with both (Claude Code,
Codex, Cursor, Copilot, Gemini); nothing depends on one vendor.

| You are                                                                         | Your door                                                                                                                                                                                                                                                           | Where the material lives                                                                                                                 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Using WebKit**: building an app on it (a person or an agent)                  | Run `npx @aziontech/webkit init` in the app. It writes a WebKit block into the app's `AGENTS.md`, which sends the agent to the `webkit-usage` skill, then to the pattern for the job; the MCP server `@aziontech/webkit-mcp` answers component and block questions. | In the npm package: `skills/` (patterns and working steps), `rules/`, the catalog and `llms/`. Nothing from this repo's `contributing/`. |
| **Improving WebKit**: adding or changing components, blocks, tokens (this repo) | This file, then [`contributing/AGENTS.md`](./contributing/AGENTS.md).                                                                                                                                                                                               | `contributing/` (rules, skills, commands, agents, hooks, docs) and `.specs/`. Never shipped.                                             |

If you are building an app, stop here and follow the first door.

**One folder for any agent.** The contributor material lives in `contributing/`, which every agent
reads. `.claude/` is only the Claude Code adapter: `settings.json` wires the hooks
(`contributing/hooks/`), and `agents`, `commands`, `rules`, `skills` and `AGENTS.md` there are links
into `contributing/`, so Claude Code loads the same files. Never add a file under `.claude/` itself.
An app gets the same split: `init` writes the agent-neutral `AGENTS.md` block, and the `.claude/`
copy it also writes is a convenience for Claude Code.

**`TOKENS.md` is not a DESIGN.md.** [`contributing/docs/TOKENS.md`](./contributing/docs/TOKENS.md) is
the contributors' guide to the tokens, type, spacing and motion. WebKit ships no `DESIGN.md` (the
file other tools generate to describe a design to agents): apps get the same facts from
`rules/webkit-tokens.md`, the catalog and the MCP `list_tokens` (decision B45).

## Where things live

| Area                                                                      | Audience                            | Ships to npm |
| ------------------------------------------------------------------------- | ----------------------------------- | ------------ |
| `packages/*`                                                              | everyone (the libraries)            | yes          |
| `skills/`, `rules/`, `adapters/`                                          | apps that consume WebKit            | yes          |
| `contributing/` (agents, commands, docs, hooks, rules, skills)            | people and agents developing WebKit | no           |
| `.specs/`                                                                 | the contract of every component     | no           |
| `apps/docs/`, `apps/demos/`, `apps/visual/`, `lint-canaries/`, `.github/` | docs site, demos, visual suite, CI  | no           |

A skill or rule for building apps goes in `skills/` or `rules/` (`scope: general`). Anything only
WebKit developers need goes in `contributing/` (`scope: webkit`). `test/standards/ai-bundle-boundary`
fails the build when the two mix.

## Start here

1. Read [`contributing/AGENTS.md`](./contributing/AGENTS.md) — monorepo rules, commands, conventions.
2. New component or block: the AI flow, from a request issue to a PR —
   [`/component-new`](./contributing/commands/component-new.md) (component) or
   [`/block-new`](./contributing/commands/block-new.md) (block). It runs these steps in
   order and stops on the first failure:
   1. read the issue (`.github/ISSUE_TEMPLATE/new-component.yml` / `new-block.yml`);
   2. research the benchmarks (Cloudscape `index.html.md`, shadcn) and the catalog for reuse
      (`reuse-audit`, MCP `search_components` / `search_blocks`, `catalog.json#aliases`);
   3. write the spec as `draft` (`spec-create`, template 2) or the block brief;
   4. spec review by a second agent ([`spec-reviewer`](./contributing/agents/spec-reviewer.md)); on
      approval `spec-validate` flips it to `approved` with a checksum;
   5. build (`/component-create`: component, test, examples — or `block.json`, `.vue`,
      `variants/`);
   6. machine gates (`pnpm --filter @aziontech/webkit run gates`, lint, types, size, Vitest);
   7. `ui-craft` review ([`contributing/skills/ui-craft/SKILL.md`](./contributing/skills/ui-craft/SKILL.md)),
      findings fixed or listed;
   8. usage check (`packages/webkit/scripts/check-usage.mjs`): a fresh agent must pick the new
      piece through the MCP and pass `webkit doctor`;
   9. PR from [`.github/pull_request_template.md`](./.github/pull_request_template.md).

   Nothing under `packages/webkit/src/components/` is written without an approved
   `.specs/<name>.md`; the hooks block it.

3. A change to an existing component runs the same flow from step 2 with its spec; every new or
   changed component, example or block goes through the `ui-craft` review before its PR opens.
   Add, Change, Deprecate and Remove: [component lifecycle](./CONTRIBUTING.md#component-lifecycle).
4. What to regenerate when WebKit changes, and the AI flow in detail: [`CONTRIBUTING.md`](./CONTRIBUTING.md).
5. The plan: [`ROADMAP.md`](./ROADMAP.md).

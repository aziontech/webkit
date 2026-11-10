# AGENTS.md

You are developing **WebKit itself** (the `@aziontech/webkit`, `@aziontech/theme` and
`@aziontech/icons` packages). If you are building an app _with_ WebKit, stop here: install it and
follow the `webkit-usage` skill that `npx @aziontech/webkit init` writes into your project.

## Where things live

| Area                                                      | Audience                            | Ships to npm |
| --------------------------------------------------------- | ----------------------------------- | ------------ |
| `packages/*`                                              | everyone (the libraries)            | yes          |
| `skills/`, `rules/`, `adapters/`                          | apps that consume WebKit            | yes          |
| `.claude/` (agents, commands, docs, hooks, rules, skills) | people and agents developing WebKit | no           |
| `.specs/`                                                 | the contract of every component     | no           |
| `apps/storybook/`, `lint-canaries/`, `.github/`           | development tooling and CI          | no           |

A skill or rule for building apps goes in `skills/` or `rules/` (`scope: general`). Anything only
WebKit developers need goes in `.claude/` (`scope: webkit`). `test/standards/ai-bundle-boundary`
fails the build when the two mix.

## Start here

1. Read [`.claude/AGENTS.md`](./.claude/AGENTS.md) — monorepo rules, commands, conventions.
2. New or changed component: the spec-driven pipeline in
   [`.claude/commands/component-create.md`](./.claude/commands/component-create.md). Nothing under
   `packages/webkit/src/components/` is written without an approved `.specs/<name>.md`.
3. Before a PR opens, every new or changed component, example or block goes through the
   `ui-craft` review ([`.claude/skills/ui-craft/SKILL.md`](./.claude/skills/ui-craft/SKILL.md)).
4. What to regenerate when WebKit changes: [`CONTRIBUTING.md`](./CONTRIBUTING.md).
5. The plan: [`ROADMAP.md`](./ROADMAP.md).

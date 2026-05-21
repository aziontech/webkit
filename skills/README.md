# Skills

Operational skills that speed up recurring tasks in the monorepo.

## When to use a skill

- The task is repetitive and demands the same implementation decisions every time.
- The output format, checklist, and Definition of Done must be standardized across PRs.
- There is a real risk that different PRs for the same change diverge.

## Conventions

- Each skill lives in a single Markdown file under `skills/*.md`.
- Each skill follows the canonical structure described in `skills/_template.md`.
- New skills and updates must follow `skills/CONTRIBUTING.md`.
- Skills are scope-driven (directory/glob), never tied to a single fixed file.

## Catalog

- **`migracao-azion-theme`** — migrates legacy styling (default Tailwind palette + hardcoded HEX) to `@aziontech/theme` tokens, focusing on semantic mapping, visual consistency, and light/dark mode support.
- **`component-create`** — creates components under `packages/webkit/src/components/webkit/<category>/<name>/`. TypeScript with JSDoc on every public prop. Composition Pattern only when justified (shadcn-vue criterion). Adheres to `Design.md` (typography via generated classes, semantic tokens) and the canonical files (button / icon-button / card-pricing). Produces hierarchical BEM `data-testid`, typed slots, v-model + controlled/uncontrolled state, a complete Storybook story (argTypes / args / parameters / actions / a11y / decorators), the shadcn-vue patterns currently available (`data-state`, `VariantProps`), and a structured final report. Patterns whose dependencies are not yet installed (`asChild`, `cn`, Figma Code Connect, `play` functions) are marked as pending instead of emulated.

## Slash command shortcuts (Claude Code)

For Claude Code users there is a native slash command that dispatches the skill:

- **`/component-create <name> [--category <category>] [--structure monolithic|composition] [--figma <url>]`** — shortcut for the `component-create` skill. Defined in [`.claude/commands/component-create.md`](../.claude/commands/component-create.md). If `--category` is omitted, the skill infers the best fit from the component name + Figma context and asks the user to confirm before writing files.

In other IDEs/agents (Cursor, Codex CLI, Continue) the slash command does not exist — there, the agent reads `AGENTS.md`, detects intent through the triggers below, or the user mentions the skill in natural language.

## Intent → skill routing

This table helps agents decide which skill to dispatch when interpreting a user request. Before writing any file, check whether the request matches one of the rows below and invoke the corresponding skill automatically — without waiting for the user to mention it explicitly.

- **Create or modify a UI component or its Storybook story.** Triggered by a creation verb (`create`/`add`/`make`/`build`/`new`/`criar`/`crie`/`gerar`/`adicionar`/`novo`) combined with a UI noun (`button`/`dialog`/`drawer`/`tooltip`/`tabs`/`card`/`input`/`dropdown`/...), or by any `Write`/`Edit` of a `.vue` file under `packages/webkit/src/components/webkit/**`, or by a Figma link in the request. Files involved: `packages/webkit/src/components/webkit/<category>/<name>/` and `apps/storybook/src/stories/webkit/<category>/`. Skill: **`component-create`**.
- **Migrate hardcoded HEX or legacy Tailwind classes to `@aziontech/theme` tokens** in existing code. Files involved: any scope provided by the user under `packages/webkit/src/**`. Skill: **`migracao-azion-theme`**.

**General rule:** when intent is detected, the agent should state which skill is being applied before touching any file. If intent is ambiguous, ask the user before creating anything.

# `packages/webkit/docs/` — `@aziontech/webkit` documentation

Source-of-truth docs for the webkit package. Edit only with explicit human approval — agents must not modify these files autonomously.

## Index

| Doc                                                      | Topic                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Design.md](./Design.md)                                 | Visual rules: typography (always via generated classes like `text-heading-md`, `text-body-sm`, `text-button-lg`), spacing, max-width, shape, semantic colors. **Wins any visual conflict.**                                                                                             |
| [COMPONENT_REQUIREMENTS.md](./COMPONENT_REQUIREMENTS.md) | Component structure (core vs. regular), `package.json`, TypeScript declarations, testing, export configuration, Vue Router considerations. Includes the in-depth **Webkit Layer Pattern** section covering TS conventions, naming, slots, controlled/uncontrolled, a11y, UX, Storybook. |
| [PRIMEVUE_ABSTRACTION.md](./PRIMEVUE_ABSTRACTION.md)     | How `@aziontech/webkit` wraps PrimeVue: plugin setup, `useToast`/`useDialog` composables, component re-exports, consumer migration guide.                                                                                                                                               |

## Related

- **Package agent guide:** [`../AGENTS.md`](../AGENTS.md) — what an agent must read and do when working inside `packages/webkit/`.
- **Skill `component-create`:** [`../../skills/component-create.md`](../../skills/component-create.md) — workflow for creating new webkit-layer components.
- **Active enforcement hooks:** [`../../.claude/hooks/`](../../.claude/hooks/) — physical guard rails (validate-tokens, validate-references, enforce-component-create).

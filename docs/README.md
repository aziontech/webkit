# `docs/` — Repository-level documentation

Cross-package docs for the Azion Webkit monorepo. Package-specific docs live next to the package (`packages/<name>/docs/`).

## Index

| Doc                                                            | Topic                                                                                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [GOVERNANCE_IMPLEMENTATION.md](./GOVERNANCE_IMPLEMENTATION.md) | Current governance pipeline (CI checks, type coverage, dependency audit, security scans, lint and storybook gates).         |
| [GOVERNANCE_NEXT_STEPS.md](./GOVERNANCE_NEXT_STEPS.md)         | Roadmap and outstanding governance work.                                                                                    |
| [ESLINT_DEPENDENCIES_GUIDE.md](./ESLINT_DEPENDENCIES_GUIDE.md) | ESLint plugins, configuration choices, and how to extend rules.                                                             |
| [MIGRACAO_AZION_THEME.md](./MIGRACAO_AZION_THEME.md)           | Historical guide for migrating legacy styles to `@aziontech/theme` tokens (referenced by `skills/migracao-azion-theme.md`). |

## Where docs live elsewhere

- **Per-package design docs:** [`../packages/webkit/docs/`](../packages/webkit/docs/) — `Design.md`, `COMPONENT_REQUIREMENTS.md`, `PRIMEVUE_ABSTRACTION.md`.
- **Agent guidance (universal):** [`../AGENTS.md`](../AGENTS.md), [`../packages/webkit/AGENTS.md`](../packages/webkit/AGENTS.md).
- **Skills (operational workflows):** [`../skills/`](../skills/).
- **Claude Code config:** [`../.claude/`](../.claude/) (settings + hooks).

# `docs/` — Repository-level documentation

Cross-package docs for the Azion Webkit monorepo. Package-specific docs live next to the package (`packages/<name>/docs/`).

## Index

| Doc                                                            | Topic                                                                                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [GOVERNANCE_IMPLEMENTATION.md](./GOVERNANCE_IMPLEMENTATION.md) | Current governance pipeline (CI checks, type coverage, dependency audit, security scans, lint and storybook gates).         |
| [GOVERNANCE_NEXT_STEPS.md](./GOVERNANCE_NEXT_STEPS.md)         | Roadmap and outstanding governance work.                                                                                    |
| [ESLINT_DEPENDENCIES_GUIDE.md](./ESLINT_DEPENDENCIES_GUIDE.md) | ESLint plugins, configuration choices, and how to extend rules.                                                             |

## Where docs live elsewhere

- **Webkit design docs:** [`../.claude/docs/`](../.claude/docs/) — `Design.md`, `COMPONENT_REQUIREMENTS.md`, `PRIMEVUE_ABSTRACTION.md` (centralized here so agents, hooks, and the spec pipeline load a single source of truth).
- **Agent guidance (universal):** [`../.claude/AGENTS.md`](../.claude/AGENTS.md), [`../packages/webkit/AGENTS.md`](../packages/webkit/AGENTS.md).
- **Spec-driven pipeline (agent rules + workflow):** [`../.claude/`](../.claude/) — commands, skills, agents, rules, hooks, settings.
- **Per-component contracts:** [`../.specs/`](../.specs/) — one spec per webkit-layer component.

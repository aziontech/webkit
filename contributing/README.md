# `contributing/` — everything for improving Azion UI

This folder is for people and agents who add or change Azion UI's components, blocks and tokens. Any
coding agent reads it (`.agents/skills` links to its skills); `.claude/` only links Claude Code to it. Building an app with Azion UI is the
other door: see the root [`AGENTS.md`](../AGENTS.md). The standards here apply by construction and
block off-standard code; this is the map, and each area links to its own index.

## Folder layout

```
contributing/
├── rules/                 # the 23 construction standards (one .md each) — see rules/README.md
│   └── README.md          #   ↳ index (foundational/construction · general/ui · enforcer)
├── hooks/                 # write-time gates — exit 2 blocks (PreToolUse, except where noted)
│   ├── validate-authoring.mjs        # blocks off-standard component authoring
│   ├── validate-spec-compliance.mjs  # .vue must match its spec 1:1 (PostToolUse)
│   ├── validate-tokens.mjs           # tokens only; no hex/palette/raw typography
│   ├── validate-references.mjs       # no phantom imports / forbidden deps
│   ├── enforce-spec-exists.mjs       # no .vue without an approved spec
│   ├── enforce-component-create.mjs  # authoring only via the pipeline
│   └── lib/              # shared, single-source engines
│       ├── standards.mjs         #   the registry: rule ↔ enforcement + scope (general/ui)
│       ├── authoring-checks.mjs  #   construction checks (one of the shared engines: authoring, token, spec, naming)
│       ├── prop-vocabulary.mjs   #   canonical prop dictionary
│       ├── spec.mjs              #   SFC/spec parsing
│       └── legacy-components.json #   grandfather list
├── skills/                # executable playbooks (spec-create, component-scaffold, …)
├── agents/                # isolated sub-agents that run the skills — see agents/_README.md
├── commands/              # orchestrators (/component-create, /pr-open, …)
├── docs/                  # internal sources of truth: TOKENS.md, COMPONENT_REQUIREMENTS.md
(../.claude/settings.json: hook registration + permissions for Claude Code)

packages/ui/           # the parts of the system that live in the package
├── scripts/check-authoring.mjs      # CI ratchet — runs the four shared engines repo-wide
├── scripts/authoring-baseline.json  #   frozen debt; a new violation fails the PR
├── test/standards/invariant.test.mjs# the meta-check: rule ↔ enforcement can't drift
├── src/eslint-plugin/     # consumer lints (11 rules, all error)
├── src/catalog/           # catalog queries behind the CLI and @aziontech/ui-mcp (the MCP server package)
├── docs/GUIDELINES.md     # consumer-facing styleguide (build & use)
└── catalog.json           # generated manifest read by the lints + MCP
```

## Where each concern lives (index)

| Concern                           | Path                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------- |
| The standards (human)             | [`rules/`](./rules/) → [`rules/README.md`](./rules/README.md)                |
| Standard ↔ enforcement (machine)  | [`hooks/lib/standards.mjs`](./hooks/lib/standards.mjs)                       |
| The check engine (hook + ratchet) | [`hooks/lib/authoring-checks.mjs`](./hooks/lib/authoring-checks.mjs)         |
| Write-time gates                  | [`hooks/`](./hooks/)                                                         |
| CI ratchet + baseline             | `packages/ui/scripts/check-authoring.mjs` · `authoring-baseline.json`        |
| The invariant (anti-drift)        | `packages/ui/test/standards/invariant.test.mjs`                              |
| Consumer lints                    | `packages/ui/src/eslint-plugin/rules/*.js`                                   |
| Creation pipeline                 | [`skills/`](./skills/) · [`agents/`](./agents/) · [`commands/`](./commands/) |
| Tokens (source of truth)          | [`docs/TOKENS.md`](./docs/TOKENS.md)                                         |
| Consumer styleguide               | `packages/ui/docs/GUIDELINES.md`                                             |

## The standards flow (single source, no drift)

```
rules/<id>.md ──registered in──► hooks/lib/standards.mjs ──scope: general|ui
      │                                    │
      │ mechanizable check                 │ invariant test asserts the pairing
      ▼                                    ▼
hooks/lib/authoring-checks.mjs  ──used by──►  validate-authoring.mjs (write-time)
                                 └─used by──►  scripts/check-authoring.mjs (CI ratchet)
```

One rule, one enforcement, two surfaces — the write-time hook and the CI ratchet run the
**same** engine, and `invariant.test.mjs` fails CI if a rule loses its gate (or vice-versa).
Nothing is advisory: every standard blocks the merge, automatically or by mandatory review.

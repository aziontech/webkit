# `.claude/` — governance system: folder map & index

Everything that makes the design system's standards apply by construction and block off-
standard code. This is the entry-point map; each area links to its own index.

## Folder layout

```
.claude/
├── rules/                 # the 23 construction standards (one .md each) — see rules/README.md
│   └── README.md          #   ↳ index (foundational/construction · general/webkit · enforcer)
├── hooks/                 # write-time gates — exit 2 blocks (PreToolUse, except where noted)
│   ├── validate-authoring.mjs        # blocks off-standard component authoring
│   ├── validate-spec-compliance.mjs  # .vue must match its spec 1:1 (PostToolUse)
│   ├── validate-tokens.mjs           # tokens only; no hex/palette/raw typography
│   ├── validate-references.mjs       # no phantom imports / forbidden deps
│   ├── validate-story-source.mjs     # runnable "Show code"
│   ├── enforce-spec-exists.mjs       # no .vue without an approved spec
│   ├── enforce-component-create.mjs  # authoring only via the pipeline
│   └── _lib/              # shared, single-source engines
│       ├── standards.mjs         #   the registry: rule ↔ enforcement + scope (general/webkit)
│       ├── authoring-checks.mjs  #   construction checks (one of FOUR shared engines: authoring, token, spec, story)
│       ├── prop-vocabulary.mjs   #   canonical prop dictionary
│       ├── spec.mjs              #   SFC/spec parsing
│       └── legacy-components.json #   grandfather list
├── skills/                # executable playbooks (spec-create, component-scaffold, …)
├── agents/                # isolated sub-agents that run the skills — see agents/_README.md
├── commands/              # orchestrators (/component-create, /open-pr, …)
├── docs/                  # internal sources of truth: DESIGN.md, COMPONENT_REQUIREMENTS.md
└── settings.json          # hook registration + permissions

packages/webkit/           # the parts of the system that live in the package
├── scripts/check-authoring.mjs      # CI ratchet — runs the four shared engines repo-wide
├── scripts/authoring-baseline.json  #   frozen debt; a new violation fails the PR
├── test/standards/invariant.test.mjs# the meta-check: rule ↔ enforcement can't drift
├── src/eslint-plugin/     # consumer lints (11 rules, all error)
├── src/mcp/               # MCP server (guides the AI to the right usage)
├── docs/GUIDELINES.md     # consumer-facing styleguide (build & use)
└── catalog.json           # generated manifest read by the lints + MCP
```

## Where each concern lives (index)

| Concern | Path |
|---|---|
| The standards (human) | [`rules/`](./rules/) → [`rules/README.md`](./rules/README.md) |
| Standard ↔ enforcement (machine) | [`hooks/_lib/standards.mjs`](./hooks/_lib/standards.mjs) |
| The check engine (hook + ratchet) | [`hooks/_lib/authoring-checks.mjs`](./hooks/_lib/authoring-checks.mjs) |
| Write-time gates | [`hooks/`](./hooks/) |
| CI ratchet + baseline | `packages/webkit/scripts/check-authoring.mjs` · `authoring-baseline.json` |
| The invariant (anti-drift) | `packages/webkit/test/standards/invariant.test.mjs` |
| Consumer lints | `packages/webkit/src/eslint-plugin/rules/*.js` |
| Creation pipeline | [`skills/`](./skills/) · [`agents/`](./agents/) · [`commands/`](./commands/) |
| Tokens (source of truth) | [`docs/DESIGN.md`](./docs/DESIGN.md) |
| Consumer styleguide | `packages/webkit/docs/GUIDELINES.md` |

## The standards flow (single source, no drift)

```
rules/<id>.md ──registered in──► hooks/_lib/standards.mjs ──scope: general|webkit
      │                                    │
      │ mechanizable check                 │ invariant test asserts the pairing
      ▼                                    ▼
hooks/_lib/authoring-checks.mjs  ──used by──►  validate-authoring.mjs (write-time)
                                 └─used by──►  scripts/check-authoring.mjs (CI ratchet)
```

One rule, one enforcement, two surfaces — the write-time hook and the CI ratchet run the
**same** engine, and `invariant.test.mjs` fails CI if a rule loses its gate (or vice-versa).
Nothing is advisory: every standard blocks the merge, automatically or by mandatory review.

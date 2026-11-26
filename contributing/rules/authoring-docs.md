# Rule: authoring docs — skills and agents carry conforming frontmatter, name no files as examples

The contributor bundle in `contributing/` that steers the AI — the **skills** and **agents**, both the DS-internal set and the consumer-facing set kept at the repo root (`skills/`, `rules/`, `adapters/claude/agents/`) and shipped in the package by its `prepack` — is a public interface as much as a component is. A skill whose `name` disagrees with its folder, an agent with an empty `description`, a doc missing its `scope`, or a skill that hardcodes a component **source path** as an example are all the same class of drift the component standards already forbid in code. This rule fixes the frontmatter shape and bans the file-as-example anti-pattern, and it is enforced write-time and in CI exactly like every other standard.

## The populations and their scope

`scope` is not a free choice; it is a fact of **where the file lives**:

| Population      | Glob                                             | `scope` truth |
| --------------- | ------------------------------------------------ | ------------- |
| Internal skills | `contributing/skills/<name>/SKILL.md`                 | `webkit`      |
| Internal agents | `contributing/agents/<name>.md` (except `_README.md`) | `webkit`      |
| Consumer skills | `skills/<name>/SKILL.md` (repo root)             | `general`     |
| Consumer agents | `adapters/claude/agents/<name>.md` (repo root)   | `general`     |

A file inside a skill folder that is not `SKILL.md` (a `references/*.md`) is not governed; nor is `_README.md`; nor are the `contributing/rules/*.md` docs (those are governed by [`standards.mjs`](../hooks/lib/standards.mjs) and the invariant test).

## The frontmatter contract

**Every skill (`SKILL.md`) and every agent (`*.md`):**

- `frontmatter-missing` — has a `--- … ---` block.
- `name-mismatch` — `name` equals the parent **folder** name (skills) / the **filename without `.md`** (agents).
- `description-empty` — `description` is present and non-blank.
- `scope-missing` — declares `scope:`.
- `scope-invalid` — `scope` is exactly `general` or `webkit`.
- `scope-mismatch` — `scope` equals the location truth above.

**Consumer skills additionally:**

- `consumer-skill-prefix` — `name` starts with `webkit-`.
- `consumer-skill-status` — declares `status:`.
- `consumer-skill-last-updated` — declares `last_updated:`.

Internal skills do **not** require `status` / `last_updated`, and agents (either variant) require only name + description + scope. This is deliberate: it matches the existing convention (internal authoring skills never carried a status; consumer agents carry only name + description) so the rule ratchets rather than forcing a redesign of files that were already fine.

## Every skill declares what enforces it (`enforced_by`)

A skill is _guidance_, not a mechanical invariant — so on its own it is advisory, exactly the drift the standards forbid in rules. To close that, **every skill** (`SKILL.md`, internal **and** consumer) declares a non-empty **`enforced_by:`** flow array in its frontmatter, naming the enforcement arm(s) that actually back its prescriptions. This is a **traceability matrix**: each piece of guidance is paired to the mechanism that makes it non-optional, exactly as every rule pairs to a gate in [`standards.mjs`](../hooks/lib/standards.mjs).

- `enforced-by-missing` — a skill has a non-empty `enforced_by: [ … ]`.

Each entry is one of three arms (mirroring a rule's `enforce[]` surfaces):

- a **rule id** — a mechanical claim is backed by that rule, which itself carries a write-time / lint / CI gate. Internal skills reference internal rule ids (`contributing/rules/<id>.md`); consumer skills reference the shipped rule ids (`webkit-<id>`, from `rules/`).
- **`ui-verify`** — a runtime UI behaviour the real-browser gate checks (both themes, loading/empty/error states, axe, focus trap + restore). Consumer/UI skills only.
- **`review`** — pure taste/judgment with no mechanical or runtime backing (heuristics, earned delight, microcopy tone). The honest floor, not an escape hatch: prefer a specific rule or `ui-verify` whenever one applies.

```yaml
# a skill about motion → the motion rule + the a11y rule (mechanical)
enforced_by: [webkit-motion, webkit-accessibility]
# a skill of pure judgment → the honest floor is mandatory review
enforced_by: [review]
```

**Presence** (`enforced-by-missing`) is checked write-time (`validate-authoring-docs`) and in the CI ratchet (`check:authoring-docs`). **Resolution** — every entry is a real rule id of the skill's own population, or the literal `ui-verify` / `review` — is checked by the standards invariant test ([`invariant.test.mjs`](../../packages/webkit/test/standards/invariant.test.mjs)), the same test that pairs every rule to a real gate. A skill that names a non-existent rule, or the wrong population's rule, fails the build.

## The file-as-example ban (skills only)

A skill must **find components through the webkit MCP / catalog**, never by pointing at a movable file. Agents are prose role docs and are not scanned for this. The four banned patterns:

- `component-src-path` — a concrete `packages/webkit/src/components/<a>/<b>/<c>.(vue|ts)` source path. The mandatory `packages/webkit/` prefix means the operational `#exports` map values (`"./src/components/…/index.ts"`) written into `package.json` are **not** flagged — only a hardcoded source path used as an exemplar is.
- `file-as-exemplar` — an exemplar trigger word (`canonical(s)`, `exemplar`, `shape reference`, `for reference`, `Monolithic`, `Atomic`, `used in`) near a **kebab-case** `*.vue` / `*.ts` on the same line. The kebab-basename requirement excludes PascalCase consumer-app filenames, and an operational file-tree diagram with no trigger word is not flagged.
- `src-escape` — a `../…/src/components/` relative climb (forward guard).
- `exports-as-lookup` — a **lookup** verb (`look up`, `find`, `locate`, `search`, `read`, `consult`, `browse`) near `package.json#exports`. A component-scaffold **write** verb ("Update …#exports", "New entries added to …#exports") does not match; components must be discovered via the MCP/catalog, not by reading the exports map.

The current tree carries 7 pre-existing file-as-example references (component-scaffold, structure-decide, reuse-audit) grandfathered in the baseline; every consumer skill is already clean, so a new consumer file-as-example is blocked with zero slack.

## Rendered docs — one pair vocabulary, no task lists, no printed comments

The docs site renders `rules/*.md`, some `skills/*/SKILL.md` (the foundations pages listed in `apps/docs/src/lib/foundations.ts`), every block `guidelines.md` and the spec sections. In every one of those sources, and in every rule and skill the site may render later:

- **One example-pair vocabulary: Do / Don't** (Carbon, Atlassian, Polaris, Material). A guidance list is `## Do` then `## Don't`; a code example is `## Example` then `### Do` and `### Don't`; a labelled list pair is `- **Do:**` and `- **Don't:**`. Never `Correct` / `Wrong`, `Good` / `Bad`, `Incorrect`, `Do not`, `Never`, `Avoid`, `Recommended`, `Dos and Don'ts`, `Best practices` / `Constraints` as a pair label. The usage pair `## When to use` / `## When not to use` is the only other pair. The docs UI uses the same two words (`do` / `dont` in `apps/docs/src/lib/i18n.ts`).
- **The card colours are documented passing pairs.** The Do / Don't check and cross and the coloured top edge are `--success-mark` and `--danger-mark` on the surface (WCAG 2.1 at least 4.4:1 on every surface, APCA Lc 45 for an icon, light and dark); label, text and code stay `--text-default` and the shiki high-contrast themes. A `-foreground` token is the text on its own fill and never colours an icon on a surface (`rules/webkit-tokens.md` § Contrast).
- **No task lists in a rendered page.** The docs are read, not ticked: a checklist is a plain list or numbered steps under a heading such as `## How to check it works`, never `- [ ]`. The renderer also drops a stray `[ ]` marker and never draws a checkbox. Agent-only skills the site does not render may keep their checklists.
- **HTML comments never print.** The pipeline drops every `<!-- … -->` outside code (own paragraph, inside a sentence, over several lines); a comment inside a code span or fence stays, because it is the sample. Do not add tool comments (`prettier-ignore`) above fences.

The authoring guide with the shapes and examples is `apps/docs/README.md` § "Do and Don't".

## Hard prohibitions

- Do not ship a skill/agent without conforming frontmatter (name == folder/filename, non-empty description, correct `scope`).
- Do not set `scope` to anything but `general` (`skills/`, `adapters/`) / `webkit` (`contributing/`).
- Do not ship a consumer skill without a `webkit-` name prefix, a `status:`, and a `last_updated:`.
- Do not ship a skill without a non-empty `enforced_by:`, and do not name an enforcer that does not resolve (a non-existent rule, the wrong population's rule, or anything other than `ui-verify` / `review`).
- Do not label an example pair with anything but Do / Don't, colour its icon with a `-foreground` token on a surface, or put a task list in a page the docs site renders.
- Do not name a component source file (`.vue`/`.ts`) as an example in a skill, or use `#exports` / a `../src/components/` climb as a component lookup — find components via the MCP/catalog.

## Enforcement

- **[`validate-authoring-docs.mjs`](../hooks/validate-authoring-docs.mjs)** (PostToolUse on `Write|Edit|MultiEdit`) re-reads a written/edited skill or agent doc and blocks (exit 2) on any **new** violation; pre-existing debt is grandfathered via [`authoring-docs-baseline.json`](../../packages/webkit/scripts/authoring-docs-baseline.json). Fail-open on error.
- **[`check-authoring-docs.mjs`](../../packages/webkit/scripts/check-authoring-docs.mjs)** is the CI ratchet (the `toolkit` job of [`governance.yml`](../../.github/workflows/governance.yml)) over all four populations; it fails on any introduced key even from an editor that never ran the hook.
- Both share the single engine **[`lib/authoring-docs-checks.mjs`](../hooks/lib/authoring-docs-checks.mjs)** — one definition, two surfaces, so a push cannot bypass the hook.
- The standard is registered in [`standards.mjs`](../hooks/lib/standards.mjs) (`authoring-docs`), paired to these gates, and the pairing is checked by [`invariant.test.mjs`](../../packages/webkit/test/standards/invariant.test.mjs).
- **Rendered docs** — [`check-docs-markdown.mjs`](../../packages/webkit/scripts/check-docs-markdown.mjs) (engine `scripts/lib/docs-markdown.mjs`, the `docs-markdown` gate and the `toolkit` job of [`governance.yml`](../../.github/workflows/governance.yml), plus [`docs-markdown.test.mjs`](../../packages/webkit/test/standards/docs-markdown.test.mjs) in the toolkit tests) fails a pair heading or list label other than Do / Don't in `rules/`, `skills/`, `.specs/` and block guidelines, and a task list in a rendered page; [`apps/docs/test/content.test.ts`](../../apps/docs/test/content.test.ts) (`pnpm test:docs`, same gate and job) proves the pipeline drops HTML comments, renders task lists plain and pairs only Do / Don't; the styled `visual` job ([`apps/visual/tests/do-dont.spec.ts`](../../apps/visual/tests/do-dont.spec.ts)) measures every Do / Don't card on every docs page in light and dark: WCAG 2.1 contrast for label, icon, text and code, and the icon in `--success-mark` / `--danger-mark`; [`apca-contrast.test.mjs`](../../packages/theme/test/apca-contrast.test.mjs) holds those marks to the icon target.
- **`enforced_by` resolution** is enforced by that same [`invariant.test.mjs`](../../packages/webkit/test/standards/invariant.test.mjs): it reads both rule populations (`contributing/rules/` and `rules/`), and fails the build if any skill's `enforced_by` entry is not a rule id of its own population, `ui-verify`, or `review`. Presence (`enforced-by-missing`) is caught earlier, write-time and in the ratchet, by the shared engine.

## Why this rule exists

The contributor bundle had no machine check at all: zero files declared `scope`, and skills freely pointed at `src/components/.../foo.vue` as "the canonical to copy" — a path that breaks the moment a component moves. The steering docs are how the AI builds every component, so drift there is more expensive than drift in any one component. Making the frontmatter a contract and finding components through the MCP/catalog (not a file path) keeps the bundle honest the same way the component standards keep the code honest.

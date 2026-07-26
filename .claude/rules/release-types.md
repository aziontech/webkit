# Rule: release types — one single set of types across commitlint, release-please, CONTRIBUTING and commands

The set of Conventional Commit `type`s and the **release effect** of each one are versioned in four places. They **must be identical**. When they diverge, commitlint accepts a commit that the release automation silently ignores (or the docs promise a bump that never happens), and the `/open-pr` / `/create-branch` flows start offering a type that does not produce the expected release. This rule was originally written for `semantic-release` (`.releaserc` `releaseRules`); **#798 replaced semantic-release with release-please**, whose bump semantics are **not configurable per type** — so the four surfaces now align on release-please's stock behavior instead of a custom table.

## The rule (invariant)

The list of accepted types and the type→release-effect must be **identical** at these four points:

| File | What it defines |
|---|---|
| [`commitlint.config.js`](../../commitlint.config.js) (`type-enum`) | which types pass `commit-msg` |
| [`release-please-config.json`](../../release-please-config.json) (stock `release-type: node`, **no** bump customization) | which types actually release, per release-please semantics |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Commit convention | the type → release-effect table, documented for humans |
| [`open-pr.md`](../commands/open-pr.md) + [`create-branch.md`](../commands/create-branch.md) | the list of types the flows infer/offer |

## Canonical set (today — release-please semantics)

- `feat` → **minor**
- `fix` → **patch**
- `!` after the type or a `BREAKING CHANGE:` footer → **major** (on any type)
- `chore` / `docs` / `style` / `refactor` / `perf` / `test` / `ci` / `revert` → **no release on their own**. They are accepted for hygiene and ride along in the next release cut by a `feat`/`fix`; release-please does not count them as releasable units.

> **`hotfix` was removed from the enum (2026-07-26).** Its name implied a release, but release-please does not recognize the type — a silent trap for exactly the most urgent commits. It had zero uses in the repo's history, so it was dropped: commitlint now rejects it loudly, and urgent production fixes are committed as `fix`.

## release-please details that matter

- **Releasable units.** Stock release-please opens/updates a Release PR only for `feat`, `fix` and `deps` commits — plus anything marked breaking. Other types never trigger or bump a release by themselves. (`deps` is not in our commitlint enum; dependency bumps here land as `ci`/`chore` and therefore do not release.)
- **No per-type bump config.** Unlike semantic-release's `releaseRules`, release-please cannot map `chore` → patch. If a change must ship, give it a releasing type (`fix`/`feat`) — do not invent config that does not exist.
- **Squash-merge means the PR title is the commit.** Merges to `main` are squash merges (#795), so release-please parses the **PR title** as the conventional commit. The title must be commitlint-valid and carry the intended type; a breaking change belongs in the title as `!` — a `BREAKING CHANGE:` footer buried in the squashed body's bullet list is easy to lose.
- **Path filtering per package.** A commit counts toward a package's release only if it touches files under that package's path ([`release-please-config.json`](../../release-please-config.json)`#packages`). A `fix(webkit)` that only edits theme files bumps nothing for webkit.
- **`Release-As:` footer** overrides the computed version when an explicit version is required.
- **The Release PR is the release.** Merging a `feat`/`fix` updates the pending Release PR; merging the Release PR bumps versions, tags, and triggers the `package-*.yml` publish workflows via `release: published`.

## When adding, removing, or re-mapping a type

Make the edits **in the same PR**:

1. `commitlint.config.js` → `type-enum`.
2. `CONTRIBUTING.md` → the type table and the enforcement note.
3. `open-pr.md` + `create-branch.md` → the list of types and the release mapping.
4. If the intent is for a type to start releasing: that is **not** a config edit — release-please cannot express it. The change is "use `fix`/`feat` instead", and this rule + the docs must say so.

## What not to do

- Don't add a type to the commands or to commitlint without updating CONTRIBUTING and the other command in the same PR.
- Don't document a bump release-please won't produce (the old `chore`/`docs`/`style`/`refactor`/`perf` → patch table died with semantic-release).
- Don't re-add `hotfix` (or any alias of `fix`) — a type whose name implies a release but never produces one is a trap; urgent fixes are `fix`.
- Don't reference `.releaserc` files — they were deleted with #798.
- Don't put a breaking change only in a commit footer of a multi-commit PR — put `!` in the PR title (squash merge).

## Why this rule exists

`/open-pr` and `/create-branch` listed `perf` / `test` / `ci` / `revert`, and `commitlint` accepted them, but the (then) `.releaserc` files only enumerated seven types + breaking — a divergence that earned a `CHANGES_REQUESTED`. The same class of bug reappeared when #798 swapped semantic-release for release-please: this rule, CONTRIBUTING and the commands kept promising `hotfix`/`chore`/`docs`/`style`/`refactor`/`perf` → patch while stock release-please releases only on `feat`/`fix`/breaking. Rewritten 2026-07-26 to make release-please's real semantics the single documented truth across all four surfaces.

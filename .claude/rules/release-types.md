# Rule: release types — one single set of types across commitlint, `.releaserc`, CONTRIBUTING and commands

The set of Conventional Commit `type`s and the **version bump** of each one are versioned in four places. They **must be identical**. When they diverge, commitlint accepts a commit that `semantic-release` silently ignores (or vice versa), and the `/open-pr` / `/create-branch` flows start offering a type that does not produce the expected release. This rule is what the reviewer enforces in a PR: _"should match release and commit lint"_.

## The rule (invariant)

The list of accepted types and the type→bump must be **identical** at these four points:

| File | What it defines |
|---|---|
| [`commitlint.config.js`](../../commitlint.config.js) (`type-enum`) | which types pass `commit-msg` |
| `packages/*/.releaserc` (`releaseRules`) | the bump of each type — in **all** packages: [`webkit`](../../packages/webkit/.releaserc), [`theme`](../../packages/theme/.releaserc), [`icons`](../../packages/icons/.releaserc) |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Commit convention | the type → bump table, documented for humans |
| [`open-pr.md`](../commands/open-pr.md) + [`create-branch.md`](../commands/create-branch.md) | the list of types the flows infer/offer |

## Canonical set (today)

- `feat` → **minor**
- `fix` / `hotfix` / `chore` / `docs` / `style` / `refactor` / `perf` → **patch**
- `test` / `ci` / `revert` → `release: false` (no bump; allowed for hygiene)
- `!` after the type or a `BREAKING CHANGE:` footer → **major**

Each type is listed **explicitly** in the `releaseRules` of every `.releaserc` — do not rely on the implicit default of the `conventionalcommits` preset. A type without an explicit rule is a divergence waiting to happen.

## When adding, removing, or re-mapping a type

Make the four edits **in the same PR**:

1. `commitlint.config.js` → `type-enum`.
2. **Every** `packages/*/.releaserc` → `releaseRules` (webkit, theme, icons). Don't forget any package.
3. `CONTRIBUTING.md` → the type → bump table and the enforcement note.
4. `open-pr.md` + `create-branch.md` → the list of types and the bump mapping.

No release? Use `{ "type": "<x>", "release": false }` in `releaseRules` (do not omit the type).

## `@semantic-release/commit-analyzer` details that matter

- The custom `releaseRules` is evaluated **before** `DEFAULT_RELEASE_RULES`; the default only kicks in when **no** custom rule matches (`isUndefined`).
- A custom rule with `release: false` returns `false` (not `undefined`), so it **suppresses** the default. This is how `revert` ends up with no release, instead of falling into the default `{ revert: true } → patch`.
- The rule `{ "breaking": true, "release": "major" }` is **always last** in the array. Because of `compareReleaseTypes`, an earlier `release: false` rule does not downgrade a breaking commit — `major` still wins.
- The analyzer also filters by path: a commit only counts toward a package's release if it touches files under `packages/<scope>/`.

## What not to do

- Don't add a type to the command or to commitlint without adding it to the three `.releaserc` files.
- Don't touch only `webkit`'s `.releaserc` and forget `theme` / `icons`.
- Don't rely on the preset default for a type — list it explicitly.
- Don't let `CONTRIBUTING.md` describe a different bump than the one `releaseRules` produces.

## Why this rule exists

`/open-pr` and `/create-branch` listed `perf` / `test` / `ci` / `revert`, and `commitlint` accepted them, but the `.releaserc` files only enumerated seven types + breaking. `perf` only got a patch from the preset default and `test`/`ci`/`revert` did not appear — a divergence that earned a `CHANGES_REQUESTED`. Making the four points identical and explicit eliminates the entire class of bug.

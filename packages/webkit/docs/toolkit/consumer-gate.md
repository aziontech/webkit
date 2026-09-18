# Webkit Consumer Gate — the reusable adoption CI

A `workflow_call` workflow, published in this repo, that any project consuming
[`@aziontech/webkit`](https://github.com/aziontech/webkit) can `uses:` instead of
hand-wiring its own CI around the CLI's `doctor` / `sync` / `canary` / `report` commands.
webkit ships the rules; this workflow is how a consumer's CI actually enforces them, in
one place, the same way, for every consumer.

## The four stages

| Stage    | Job        | Command                                 | Blocks by default? | Input          |
| -------- | ---------- | --------------------------------------- | ------------------ | -------------- |
| Wiring   | `wiring`   | `webkit doctor` + `webkit sync --check` | Yes                | `block-wiring` |
| Canary   | `canary`   | `webkit canary`                         | Yes                | `block-canary` |
| Adoption | `adoption` | `webkit report`                         | No (publish-only)  | `fail-on`      |
| Style    | `style`    | `stylelint`                             | No                 | `block-style`  |

They are not equally strict on purpose:

- **Wiring and canary are pass/fail, blocking by default.** Either your project's toolkit
  wiring is intact and webkit's rules actually reach your code, or the rest of the gate is
  meaningless — a broken import path or a silently-disabled ESLint rule would let every
  other check pass for the wrong reason. `block-wiring` / `block-canary` exist to opt a
  legacy project OUT while it catches up, not because these checks are optional in spirit.
- **Adoption is a measurement, not a merge gate, until you decide otherwise.** `webkit
report` always runs and always publishes its number (Job Summary + a `webkit-adoption`
  artifact) — every PR sees where the project stands. It is only turned into a hard
  failure when the caller passes `fail-on: any`; the default `never` treats adoption as a
  ratchet you track and improve over time, not a gate that blocks day one.
- **Style is off by default.** A consumer may not run Stylelint the way webkit's own repo
  does (different glob, different config). Turn it on (`block-style: true`) once your own
  Stylelint config is wired.

**Always publish the report before enforcing it.** The `adoption` job's steps are ordered
so the JSON report is generated and uploaded, and the human-readable summary is written to
`$GITHUB_STEP_SUMMARY` (with `if: always()`, so it lands even if an earlier step in the
job already failed), _before_ the optional `--fail-on` enforcement step runs. A PR always
gets the number to look at, whether or not this run happens to fail on it.

`webkit-gate` is the single aggregate job (`needs: [wiring, canary, adoption, style]`,
`if: always()`) that rolls the four stages into one pass/fail check, the same
`declare -A` pattern this repo's own `governance-check` job uses. **Mark `webkit-gate`,
not the individual stage jobs, as the required status check** on your branch — that way
toggling a stage's blocking input in `with:` never requires touching branch protection.

## Inputs

| Input               | Type    | Default                         | Description                                                                                                             |
| ------------------- | ------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `paths`             | string  | `.`                             | Positional path patterns passed to `webkit report` (the adoption scan).                                                 |
| `style-paths`       | string  | `src/**/*.{css,scss,vue,astro}` | Glob passed to `stylelint` when the style stage runs.                                                                   |
| `node-version-file` | string  | `.nvmrc`                        | Path to the Node version file, used when `node-version` is empty.                                                       |
| `node-version`      | string  | `''`                            | Explicit Node version; overrides `node-version-file` when set.                                                          |
| `package-manager`   | string  | `pnpm`                          | `pnpm`, `npm`, or `yarn` — drives the setup step and the derived install command.                                       |
| `install-command`   | string  | `''`                            | Overrides the derived install command (`pnpm install --frozen-lockfile` / `npm ci` / `yarn install --frozen-lockfile`). |
| `fail-on`           | string  | `never`                         | Passed to `webkit report --fail-on`: `never` (publish only) or `any` (fail the adoption job on any violation).          |
| `block-wiring`      | boolean | `true`                          | Fail the gate when `webkit doctor` / `webkit sync --check` fail.                                                        |
| `block-canary`      | boolean | `true`                          | Fail the gate when `webkit canary` reports a broken fixture.                                                            |
| `block-style`       | boolean | `false`                         | Fail the gate when the stylelint pass reports errors.                                                                   |
| `timeout-minutes`   | number  | `20`                            | Per-job timeout.                                                                                                        |

## Outputs

| Output       | Description                                                              |
| ------------ | ------------------------------------------------------------------------ |
| `violations` | Total adoption-report violations — the `total` field of the JSON report. |
| `score`      | Adoption score — the `score` field of the JSON report.                   |

## Usage

```yaml
jobs:
  webkit:
    uses: aziontech/webkit/.github/workflows/webkit-consumer-gate.yml@<sha> # main
    with:
      fail-on: any
```

Pin to a commit SHA (with a `# main` comment naming the branch it tracks), not `@main`
unadorned — SHA-pinning a reusable workflow is the same supply-chain hygiene as pinning
any other third-party Action. Dependabot's `github-actions` ecosystem updates the pin
automatically when it is configured for this repo, the same as any `uses:` reference.
`@main` is an acceptable fallback only where you deliberately want to float. A
release-please tag is not a good `uses:` ref here: it's built from the whole-repo version
(e.g. `v5.1.0`) and the `@` inside a tag that also contains `@` after `webkit-consumer-gate.yml`
reads awkwardly and is easy to mistype — a SHA is unambiguous.

**Minimum CLI version:** `@aziontech/webkit@5.1.0` or later (the first release to ship
`report`, `canary`, and `sync` — **confirm this number at release time**, once the CLI
PRs land and actually cut a release).

## The `paths:` trap

This file has no `on:` trigger — `workflow_call` workflows can't declare one. **The
calling workflow owns the trigger**, and that has one sharp edge: if your caller's own
workflow is gated behind a `paths:` filter (e.g. only running on `pull_request:` when
`src/**` changes) and you mark `webkit-gate` as a required status check, any PR that
doesn't touch a matching path **never gets a run of this workflow at all**. GitHub then
waits forever for a required check that will never report, and the PR can never merge.

Trigger the caller **unconditionally** (no `paths:` filter on its `pull_request:`) if
`webkit-gate` is a required check. If you need to skip paths, do it inside this
workflow's own inputs (e.g. narrow `paths` / `style-paths`), not on the caller's trigger.

## Reading the Summary

Every run of the `adoption` job appends a human-readable `webkit report` table to the
run's **Job Summary** (visible on the workflow run page, and linked from the PR's checks
tab), regardless of `fail-on` and regardless of whether the run otherwise failed. The same
data, as machine-readable JSON, is uploaded as the `webkit-adoption` artifact — fetch it
from the run's Artifacts list, or from `needs.webkit.outputs.violations` /
`needs.webkit.outputs.score` in a workflow that calls this one, to track the number over
time (e.g. post it as a PR comment, or graph it across `main`).

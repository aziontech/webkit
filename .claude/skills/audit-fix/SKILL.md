---
name: audit-fix
description: Fix `pnpm audit --audit-level=high` failures by bumping the offending dependency to its patched version, with a semver-aware guardrail (patch = auto, minor = validate carefully, major = ALERT and ask). Identifies the owning monorepo project and emits a status report.
status: active
last_updated: 2026-06-28
---

# Skill: audit-fix

## Purpose

`pnpm audit --audit-level=high` is a required gate in CI — the **Security Scans** job in [`.github/workflows/governance.yml`](../../../.github/workflows/governance.yml) (and the local `pnpm run security:audit`). When it exits non-zero, at least one **high** or **critical** advisory matched a package in the workspace dependency graph.

This skill takes the failing audit, finds the **minimal** version bump that clears every high+ advisory, applies it to the **owning** workspace project, and verifies the gate passes again — while honoring a strict **semver** policy so a fix never silently performs a risky major upgrade.

Scope discipline: `--audit-level=high` ignores `low` / `moderate`. Those stay reported (informational) and are **not** a reason to bump anything.

## When to invoke

- CI's "Audit dependencies" step fails, or `pnpm run security:audit` exits non-zero locally.
- A dependency review surfaces a new high/critical advisory you want remediated.

## Inputs

- The repo (write access limited to manifests + the lockfile).
- Optional: a captured audit log. If none is provided, the skill runs the audit itself.

## Semver policy (the core guardrail)

Compare the **current resolved version** against the **minimum patched version** that clears the advisory, per the SemVer spec (https://semver.org/lang/pt-BR/). Classify the bump and act accordingly:

| Bump class | Example | Action |
|---|---|---|
| **patch** (`x.y.Z`) | `1.2.3 → 1.2.9` | ✅ **Apply automatically.** Patches are backward-compatible bug fixes. |
| **minor** (`x.Y.z`) | `10.30.3 → 10.34.4` | ⚠️ **Apply, then validate carefully** — frozen-lockfile install + re-audit; for runtime/build deps also run the affected `governance` checks (lint / type-check / storybook build). |
| **major** (`X.y.z`) | `10.x → 11.x` | 🚨 **ALERT and ASK first** (`AskUserQuestion`). Majors carry breaking changes — **never auto-apply.** Present the advisory, the current → target jump, and the blast radius (which project; runtime vs tooling). |

**Pre-1.0 caveat (SemVer §4):** for a `0.y.z` package, a **minor** bump (`0.Y.z`) MAY break — treat it with the **major** rule (ALERT + ask). Only `0.y.Z` patch stays patch.

If the *only* version that clears a high advisory is a major (or a `0.x` minor) and the user declines, **STOP and report** — do not apply a weaker bump that leaves the high unresolved.

## Workflow

1. **Capture structured advisories** from the repo root:
   ```bash
   pnpm audit --audit-level=high --json > audit.json   # machine-readable
   pnpm audit --audit-level=high                        # human view + exit code
   ```
   Already exit 0 → nothing to do; report "no high/critical advisories" and stop.

2. **Per advisory, resolve four facts:** the **package**, the **current resolved version** (`pnpm why <pkg>` or the lockfile), the **patched range** (advisory *Patched versions*), and the **owning path** (advisory *Paths*). Map the first path segment to a workspace project:
   - `.` → root [`package.json`](../../../package.json)
   - `packages/<name>` → `packages/<name>/package.json`
   - `apps/<name>` → `apps/<name>/package.json`

3. **Pick the target version** = the lowest published version satisfying **every** advisory for that package (intersect the patched ranges; confirm it exists with `npm view <pkg> versions`). Watch for **lagging dist-tags** — e.g. `latest-10` can point below the newest published `10.x` (`npm view <pkg>@<version> version` confirms a specific version exists even when no tag points at it).

4. **Classify with the semver policy** above. For **major** (or `0.x` minor): ALERT + ASK before continuing.

5. **Apply to the OWNING manifest, by dependency kind:**
   - **Direct dependency** (the package is in some project's `dependencies`/`devDependencies`): raise its range floor in *that* project's `package.json` (e.g. `^10.34.4`). If the package is `pnpm` itself, also bump the root **`packageManager`** field to the same exact version.
   - **Transitive dependency** (appears only deep in *Paths*, in no manifest): pin it via **`pnpm.overrides`** in the **root** `package.json` (and mirror it in [`pnpm-workspace.yaml`](../../../pnpm-workspace.yaml) `overrides` if that file also declares overrides — keep the two consistent). Use the lowest safe constraint, e.g. `">=1.2.9"`.

6. **Refresh the lockfile minimally** — prefer a targeted update so the diff stays reviewable:
   ```bash
   COREPACK_ENABLE_DOWNLOAD_PROMPT=0 pnpm update <pkg> --lockfile-only
   ```
   A bare `pnpm install` can re-resolve every `^`/`~` range to its newest in-range version, producing a large, noisy lockfile diff. Avoid it for a security fix unless that broad refresh is the explicit intent.

7. **Verify (CI parity).**
   ```bash
   pnpm install --frozen-lockfile                       # CI's first step — must pass
   cd packages/webkit && pnpm audit --audit-level=high  # CI runs the audit HERE; exit must be 0
   ```
   For a **minor**+ bump of a runtime/build dependency, also run the affected `governance` checks (`pnpm run webkit:lint`, `pnpm run webkit:type-check`, `pnpm run storybook:build`).
   If a high advisory remains, return to step 3 with a higher target — and **re-apply the semver policy**, because a higher target may cross into major (→ ASK).

8. **Repeat** until `pnpm audit --audit-level=high` exits **0**.

## Environment notes (this repo)

- `pnpm` runs through **corepack**. If `pnpm` is not on PATH, run `corepack enable` — the husky `pre-commit` (`pnpm lint-staged`) and `commit-msg` (`pnpm exec commitlint`) hooks call `pnpm`, so it must resolve. **Never** `--no-verify` past them.
- When bumping the `packageManager` field, prefix install commands with `COREPACK_ENABLE_DOWNLOAD_PROMPT=0` so corepack fetches the new pnpm non-interactively.
- The audit gate runs in `working-directory: packages/webkit`, but `pnpm audit` covers the **whole workspace** lockfile — a root-only dependency surfaces as the path `.>pnpm` and is still fixed at the root.

## Outputs — status report

Emit this Markdown report (the semver class is always visible):

```markdown
## pnpm audit — high/critical remediation

**Gate:** `pnpm audit --audit-level=high` — before: ❌ exit 1 (N high) · after: ✅ exit 0 (0 high)

| Advisory | Package | Owns (workspace) | Current → Target | Bump | Mechanism | Result |
|---|---|---|---|---|---|---|
| GHSA-… | pnpm | root (`.`) | 10.30.3 → 10.34.4 | minor ⚠️ | `dependencies` + `packageManager` | ✅ cleared |
| GHSA-… | foo  | packages/webkit | 1.2.0 → 1.2.9   | patch ✅ | `pnpm.overrides`              | ✅ cleared |

**Validation:** `pnpm install --frozen-lockfile` ✅ · re-audit ✅ exit 0 · (minor/major) governance ✅
**Remaining (below the gate, informational):** e.g. 2 low, 2 moderate — not addressed; they do not fail `--audit-level=high`.
**Deferred / needs decision:** any major bump the user declined, with the advisory link.
```

## Rules

- **Never** clear an advisory by lowering `--audit-level`, deleting the audit step, or using `--no-verify`. The gate stays as-is; only versions move.
- **Never** auto-apply a **major** bump (or a `0.x` **minor**) — ALERT and ask first.
- Keep the diff **minimal** — bump only the offending package(s); do not opportunistically refresh the whole lockfile.
- Apply the bump to the **owning** project's manifest, not blindly to the root, unless the dependency is the root's.
- Branches/PRs go through [`/create-branch`](../../commands/create-branch.md) and [`/open-pr`](../../commands/open-pr.md). This skill's own file is a `.claude/skills/*` change → it ships in a **separate PR from the dependency fix** (see [`.claude/rules/git-workflow.md`](../../rules/git-workflow.md)).
- A dependency bump is commit type **`chore`** (per [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) § Commit convention); honor the type→bump invariant in [`.claude/rules/release-types.md`](../../rules/release-types.md).

## Fallbacks

- No published version clears the advisory → emit `BLOCKED: <pkg> <advisory> has no patched release; options: pnpm.overrides to a fixed fork, remove the dependency, or document an accepted-risk exception` and stop.
- The patched version requires a Node engine the repo/CI doesn't provide → surface it; do **not** silently raise the Node baseline.
- `pnpm audit` cannot reach the registry → emit `BLOCKED: audit endpoint unreachable` and stop.
- Clearing all highs for `pnpm` itself needs a major (`11.x`) → ALERT and ask (the common case this policy exists for).

## Definition of Done

- [ ] `pnpm audit --audit-level=high` exits **0** (run from `packages/webkit`, matching CI).
- [ ] `pnpm install --frozen-lockfile` succeeds against the updated lockfile.
- [ ] Every applied bump is patch, or minor-with-validation; any major was explicitly approved.
- [ ] The lockfile diff is limited to the offending package(s).
- [ ] The status report (table + validation + remaining + deferred) is emitted.

# Plan: `@aziontech/webkit.dev` — Parallel Dev Channel

## Goal

Stand up a **parallel publish channel** for the webkit package so we can release work-in-progress versions (the new Buttons/Messages components are mid-replacement and have already broken the stable line) without touching `@aziontech/webkit@latest` on `main`.

The dev channel is a **publication channel**, not a fork. It re-uses the same source code, the same hooks, the same component contracts. Only the package name, the release branch, the published artifact, and the Storybook deploy target differ.

## Scope (do)

- Add a second npm package identity: `@aziontech/webkit.dev`.
- Add a long-lived git branch `dev` that is the release branch for that identity.
- Add a GitHub Actions workflow that publishes from `dev` on push, using semantic-release with `dev` as the release branch (so versioning continues to be automatic and conventional-commit-driven).
- Add a parallel Storybook deploy that builds from `dev` and publishes to a custom Azion domain (custom domain is configured **manually** in the Azion console).

## Scope (don't)

- Don't edit any component code.
- Don't remove or rename components, props, events, slots, or exports.
- Don't change the existing `main` → `@aziontech/webkit` pipeline.
- Don't introduce new dependencies (rule [`dependencies.md`](../.claude/rules/dependencies.md)).
- Don't migrate or rewrite anything (rule [`migration.md`](../.claude/rules/migration.md)).

---

## Current state (snapshot)

| Concern | File | Today |
|---|---|---|
| Package identity | `packages/webkit/package.json#name` | `@aziontech/webkit` |
| Package version | `packages/webkit/package.json#version` | `3.9.0` |
| Release branch | `packages/webkit/.releaserc#branches` | `["main"]` |
| Tag format | `packages/webkit/.releaserc#tagFormat` | `@aziontech/webkit@${version}` |
| Publish workflow | `.github/workflows/package-webkit.yml` | Triggers on push to `main` for `packages/webkit/**` |
| Storybook workflow | `.github/workflows/app-storybook.yml` | Triggers on push to `main` for `apps/storybook/**`, deploys via Azion CLI |
| Azion app name | `apps/storybook/azion.config.mjs` | `webkit-storybook` (single workload / single connector / single bucket) |
| Workspace | `pnpm-workspace.yaml` | `apps/*`, `packages/*` |

---

## Design choices (decide before code)

### 1. How to expose the dev name without duplicating the package

**Choice A — single source, swap `name` at publish time (recommended)**
Keep `packages/webkit/package.json#name` as `@aziontech/webkit` on `main`. On `dev`, that field reads `@aziontech/webkit.dev`. Same files, same exports, same `src/`. The only diff between `main` and `dev` is:

- `package.json#name`
- `package.json#version` (handled by semantic-release per branch)
- `.releaserc#branches` / `#tagFormat` (per branch)
- `CHANGELOG.md` (per branch, semantic-release-managed)

**Why A over duplicating the folder:**
- A duplicate `packages/webkit-dev/` would double-maintain every export, every spec, every hook target, every reference in `validate-references.mjs`. It violates "don't make unnecessary changes."
- A duplicate folder also forces consumers of the workspace (Storybook, future apps) to pick one — defeating the purpose of a parallel channel.

**Choice B — semantic-release `pkgRoot` + a generated `package.json`**
Possible but adds a build step before publish and surprises maintainers reading `package.json` directly. Skip unless A proves unworkable.

> Decision: **A**. The dev branch's working tree differs from main only in the four files listed above. Component code is identical.

### 2. How semantic-release tracks two channels

semantic-release supports `branches` with multiple entries. We do **not** want pre-release semantics (`@beta`, `@next`) — the user requested a fully separate package name, not a dist-tag. So the two channels are independent:

- `main` branch → publishes `@aziontech/webkit` (config lives at `.releaserc` on `main`).
- `dev` branch → publishes `@aziontech/webkit.dev` (config lives at `.releaserc` on `dev`, with `branches: ["dev"]` and `tagFormat: "@aziontech/webkit.dev@${version}"`).

Version numbers on `dev` start fresh from `1.0.0` (semantic-release will compute it from the first conventional commit on `dev` once the tag namespace `@aziontech/webkit.dev@` is empty). This is intentional — the dev channel's version line is independent from stable and reflects what's actually been merged into `dev`.

### 3. Storybook deploy target

The existing `app-storybook.yml` only runs on `main`. We need:

- A second workflow `app-storybook-dev.yml` that triggers on push to `dev` under `apps/storybook/**` **or** on push to `dev` under `packages/webkit/**` (Storybook content is driven by component stories, so a webkit change must redeploy Storybook).
- A second `azion.config.mjs` profile for the dev deploy. Cleanest path: keep `apps/storybook/azion.config.mjs` untouched on `main`, and on `dev` overwrite it with a profile whose `name`/`storage[].name`/`connectors[].name`/`applications[].name`/`workloads[].name` are suffixed `-dev` (e.g. `webkit-storybook-dev`). Same caveat as §1: the only delta between the two branches at this file is the resource names.

Custom domain is **manual** in the Azion console — bind `dev.webkit.<our-domain>` (or whatever the team picks) to the `webkit-storybook-dev` workload. Document the domain in the workflow's README block; do not commit it to the config file unless Azion requires it for the deploy step.

---

## Step-by-step plan

> Each step lists the file(s) touched and whether the change lands on `main`, on `dev`, or on both.

### Step 1 — create the `dev` branch from `main`

- Branch off the current `main` tip.
- Push as `origin/dev`.
- Set branch protection mirroring `main` (required reviews, required status checks) — manual in GitHub settings.

No files change. Repository operation only.

### Step 2 — on `dev`, rename the package and reset the version

File: `packages/webkit/package.json` (on `dev` only)

```diff
-  "name": "@aziontech/webkit",
-  "version": "3.9.0",
+  "name": "@aziontech/webkit.dev",
+  "version": "0.0.0",
```

Notes:
- `0.0.0` is a placeholder; semantic-release computes the first real version from the first conventional commit on `dev` after the tag namespace is empty.
- Do **not** change `dependencies`, `devDependencies`, `exports`, `scripts`, or `files`. Source code is shared.
- Do **not** touch the `workspace:*` references in `apps/storybook/package.json` — pnpm resolves them by directory, not by package name. (Verified: pnpm matches workspace deps by the package's `name` field. **This means the storybook workspace dep `@aziontech/webkit: workspace:*` will need a parallel update on `dev` to `@aziontech/webkit.dev: workspace:*`. Add it to this step.**)

File: `apps/storybook/package.json` (on `dev` only)

```diff
-    "@aziontech/webkit": "workspace:*",
+    "@aziontech/webkit.dev": "workspace:*",
```

And every Storybook story/import on `dev` that reads `@aziontech/webkit/...` — **stop**. That's a code edit and contradicts "don't edit the current code." Resolution: keep imports as `@aziontech/webkit` and use a pnpm `aliases` field or a Vite `resolve.alias` so that on `dev`, `@aziontech/webkit/*` resolves to the local `packages/webkit/src/*`. **Re-examine in Step 3.**

### Step 3 — on `dev`, alias the import path so stories stay untouched

The constraint "don't edit the current code" means story imports like `import { Button } from '@aziontech/webkit/button'` must keep working under both names. Two options:

**Option 3a — pnpm alias in `apps/storybook/package.json`** (Storybook only sees the dev package, but imports the same specifier):

```diff
   "dependencies": {
-    "@aziontech/webkit": "workspace:*",
+    "@aziontech/webkit": "npm:@aziontech/webkit.dev@workspace:*",
```

But pnpm `npm:` aliases against `workspace:*` are not universally supported. Verify before committing.

**Option 3b — Vite alias in the Storybook config** (pragmatic, zero ambiguity):

In `apps/storybook/.storybook/main.js` (on `dev` only), add a `viteFinal` hook that aliases `@aziontech/webkit` → `../../packages/webkit/src`. The workspace dep still says `"@aziontech/webkit.dev": "workspace:*"`, but no story import touches that name — Vite resolves the original specifier locally.

> Decision: **3b** — Vite alias. Avoids the `npm:`+`workspace:*` interaction question entirely and keeps every story file unchanged.

### Step 4 — on `dev`, switch the semantic-release config

File: `packages/webkit/.releaserc` (on `dev` only)

```diff
-  "branches": ["main"],
-  "tagFormat": "@aziontech/webkit@${version}",
+  "branches": ["dev"],
+  "tagFormat": "@aziontech/webkit.dev@${version}",
```

The rest of the file (commit-analyzer rules, plugins, exec prepareCmd, github plugin) stays identical. The `@semantic-release/npm` block already has `npmPublish: false` and the actual publish runs through `@semantic-release/exec`'s `publishCmd: "npm publish --provenance --access public"`. Because `package.json#name` on `dev` is `@aziontech/webkit.dev`, that same command publishes the dev package to the dev namespace on npm. **No change needed in `.releaserc`'s exec block.**

### Step 5 — add the dev publish workflow

New file: `.github/workflows/package-webkit-dev.yml` (lands on `dev`; also lands on `main` so a future merge from `dev` → `main` doesn't reintroduce confusion — but on `main` it remains dormant because its trigger is `branches: [dev]`).

Mirror `package-webkit.yml` with:

```yaml
name: Publish @aziontech/webkit.dev to NPM
on:
  push:
    branches:
      - dev
    paths:
      - 'packages/webkit/**'
jobs:
  release:
    # ...identical to package-webkit.yml...
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
    # secrets: GIT_PKG, NPM_TOKEN (same as today; semantic-release reads NODE_AUTH_TOKEN via setup-node)
```

Pre-flight check: confirm the npm org `@aziontech` allows the scoped name `@aziontech/webkit.dev` (npm permits dots in scoped package names but the org's access control may require a publish-once initialization by a maintainer with the publish-new-packages permission).

### Step 6 — add the dev Storybook workflow + Azion profile

New file: `.github/workflows/app-storybook-dev.yml` (on `dev`; mirrors `app-storybook.yml` with):

- `on.push.branches: [dev]`
- `on.push.paths: ['apps/storybook/**', 'packages/webkit/**']` — a webkit change on `dev` should redeploy Storybook so consumers can browse the new components.
- Same Azion CLI steps; the difference is the `azion.config.mjs` on `dev` already names every resource `*-dev` (see Step 7), so `azion build` + `azion deploy` target a separate workload.

File: `apps/storybook/azion.config.mjs` (on `dev` only)

Replace every occurrence of `webkit-storybook` with `webkit-storybook-dev` (storage name, prefix, connector name + bucket, application name, cache name, workload name, deployment name). The `prefix` is a versioned string — pick a fresh value (e.g. timestamp of when the dev env is created) to avoid colliding with the prod bucket.

Custom domain: register `dev.webkit.<azion-domain>` (or chosen subdomain) and bind it to the `webkit-storybook-dev` workload **in the Azion console**. Document the chosen domain in `apps/storybook/README.md` so the next operator knows where to look. Do not encode it in the workflow.

### Step 7 — verify the dev release end-to-end

On a feature branch off `dev`:

1. Make a no-op conventional commit on `dev` (`chore: bootstrap @aziontech/webkit.dev publish channel`) and merge.
2. Watch `package-webkit-dev.yml` run. Expected: semantic-release computes `1.0.0`, publishes `@aziontech/webkit.dev@1.0.0`, writes a tag `@aziontech/webkit.dev@1.0.0`, opens a release on GitHub.
3. Watch `app-storybook-dev.yml` run. Expected: Storybook builds, deploys to the `*-dev` workload, returns a `.map.azionedge.net` URL.
4. Verify the custom domain (once DNS + Azion binding propagate) serves the same content.
5. Install `@aziontech/webkit.dev` in a downstream app and verify a single export (`@aziontech/webkit.dev/button`) loads.

If any of those fails, the channel is broken — fix it on `dev` before any further work depends on it.

### Step 8 — document the channel

File: `packages/webkit/README.md` (one paragraph added, on both branches eventually)

```
## Channels
- `@aziontech/webkit` — stable, released from `main`.
- `@aziontech/webkit.dev` — in-progress components (currently: Buttons + Messages replacement). Released from the `dev` branch. Use this in apps that need to validate unreleased changes before they land on stable. Versioning is independent.
```

---

## Open questions (need a decision before Step 1)

1. **npm publish credentials.** Does `NPM_TOKEN` (or whatever secret semantic-release uses) have permission to publish a new scoped package name? Confirm with whoever owns `@aziontech` on npm. **Blocking.**
2. **Custom domain.** Which subdomain? Suggest `dev.webkit.azion.com` or `webkit-dev.azion.com`. Needs ops/marketing sign-off because the domain is publicly visible.
3. **Branch protection for `dev`.** Same gates as `main` (1 approval + green CI), or looser (no approval, just CI)? The point of dev is to move faster than main, so likely looser — but confirm.
4. **Lifetime.** Is `dev` permanent (long-lived) or temporary until Buttons + Messages stabilize on main? Plan assumes **permanent**. If temporary, add a Step 9 "Decommission" with: delete branch, remove workflows, unpublish (or deprecate) the dev npm package, remove the Azion workload.
5. **Cherry-pick policy.** When a commit lands on `main`, does it also need to land on `dev`? Probably yes (so dev stays a superset). Convention: every `main` merge gets cherry-picked or merged into `dev` within 24h. Owner: whoever opened the original PR.

---

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Two parallel `.releaserc` configs drift apart | Add a CI check on `main` and `dev` that diffs the two files and fails if any field other than `branches` / `tagFormat` differs. |
| Storybook on `dev` accidentally consumes the published `@aziontech/webkit.dev` from npm instead of the local source | Vite alias in `apps/storybook/.storybook/main.js` (Step 3b) — Vite resolves the workspace path before pnpm dependency resolution. |
| Someone publishes from `dev` to the stable name by editing `package.json` locally | `.releaserc#tagFormat` and the workflow's release branch list are the gates. The workflow runs on `dev` only and the tagFormat is `@aziontech/webkit.dev@`. A manual `npm publish` from a laptop is a separate problem solved by npm 2FA. |
| Consumers confuse the two packages | The `.dev` suffix in the npm name is the strongest signal possible. README documents the channel difference. |
| Azion resource name collision | Every resource on `dev` gets the `-dev` suffix (Step 6). The `prefix` field on the storage bucket is also fresh. |

---

## What "done" looks like

- `git push origin dev` succeeds.
- A conventional commit on `dev` triggers `package-webkit-dev.yml`, which publishes `@aziontech/webkit.dev@1.0.0` to npm and tags `@aziontech/webkit.dev@1.0.0`.
- A change under `apps/storybook/**` on `dev` triggers `app-storybook-dev.yml`, which deploys to the `webkit-storybook-dev` Azion workload, reachable via the custom domain bound manually in the Azion console.
- `main` and `@aziontech/webkit@3.x` are untouched.
- No `.vue`, no spec, no component contract, no export entry has changed.

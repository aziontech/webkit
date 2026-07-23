# Merge → Release → Bump — Visual Flow

The full lifecycle of a merge to `main` with the current pipeline (post #787 + #795):
release published by CI, bump PR opened and **auto-merged** — zero human steps after
the feature merge. Complements `SEMANTIC_RELEASE_FLOW.md` (version math, conflict and
race cases). Diagrams render on GitHub, VS Code (Mermaid extension) or https://mermaid.live.

---

## 1. One merge, end to end (example: webkit at 4.1.0, a `feat:` PR merges)

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant M as main
    participant W as Publish workflow
    participant S as semantic-release
    participant N as npm registry
    participant B as Bump PR

    Dev->>M: merge feature PR (feat)
    M->>W: push event (paths packages/webkit/**)
    Note over W: concurrency group release-webkit<br/>waits here if another release run is active
    W->>S: npx semantic-release
    S->>S: last tag reachable from main = 4.1.0
    S->>S: commits since tag contain feat, next = 4.2.0
    S->>S: prepare (runner only): CHANGELOG.md + package.json + catalog.json
    S->>M: push tag @aziontech/webkit@4.2.0
    S->>N: npm publish --provenance (4.2.0 + SLSA attestation)
    S->>M: create GitHub Release 4.2.0
    W->>B: push branch ci/release-webkit-4.2.0 and open PR
    W->>B: arm auto-merge (squash, subject carries skip ci)
    B->>B: required checks run
    B->>M: auto squash-merge "ci(release): bump ... [skip ci] (#N)"
    Note over M: skip ci in the commit: no workflow runs<br/>ci type: release false (backstop layer)
```

Key points:

- Steps 1–2 are the **only human action**. Everything after is CI.
- The **release exists at step 9–10** (npm + GitHub Release) — the bump PR (steps 11–14)
  is bookkeeping that follows; npm never waits for it.
- The tag lands on the **feature merge commit**; the bump commit gets no tag and
  triggers nothing.

---

## 2. Two PRs merged seconds apart — the concurrency queue

```mermaid
sequenceDiagram
    participant M as main
    participant Q as queue release-webkit
    participant R1 as Run 1 (PR-A fix)
    participant R2 as Run 2 (PR-B feat)

    M->>Q: push (PR-A merged)
    Q->>R1: start
    M->>Q: push (PR-B merged seconds later)
    Note over Q: Run 2 queued - cancel-in-progress false<br/>a release run is never killed, only delayed
    R1->>R1: last tag 4.1.0, next = 4.1.1
    R1->>M: tag 4.1.1 + npm publish + bump PR (auto-merges)
    Q->>R2: start after Run 1 finishes
    R2->>R2: last tag 4.1.1 (fresh!), next = 4.2.0
    R2->>M: tag 4.2.0 + npm publish + bump PR (auto-merges)
```

Without the queue both runs would read `4.1.0`, compute `4.1.1` and `4.2.0` in
parallel, and whichever published the **lower** version **second** would be rejected
by npm. With the queue each run starts from the tag the previous one just pushed —
two clean releases, in order, always.

---

## 3. What main looks like after both cycles

```mermaid
gitGraph
    commit id: "earlier work" tag: "4.1.0"
    commit id: "PR-A merged (fix)" tag: "4.1.1"
    commit id: "auto bump 4.1.1 - skip ci"
    commit id: "PR-B merged (feat)" tag: "4.2.0"
    commit id: "auto bump 4.2.0 - skip ci"
```

Reading it:

| Commit | Created by | Tagged? | Triggers a workflow? |
| --- | --- | --- | --- |
| feature merge | human merging the PR | yes — the release tag | yes — the release run |
| auto bump | CI (auto-merged bump PR) | no | no (`skip ci` + `ci:` type) |

The repeating pattern on `main` is always: *feature commit (tagged) → bump commit
(silent)* — one pair per release, no human in the loop after the feature merge.

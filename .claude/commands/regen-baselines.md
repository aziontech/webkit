# /regen-baselines <branch | pr-number | pr-url> [modes]

Regenerate the **Linux visual baselines** for a PR branch **in CI** and land them on the
branch. Never generate baselines locally — macOS rendering does not match the `linux/`
snapshots the PR visual gate (`governance.yml` → `test:visual:ci`) compares against.

Run the **regen-baselines** skill (`.claude/skills/regen-baselines/SKILL.md`). It:

1. Resolves the branch (from the PR number/URL when given) and confirms the state to
   snapshot — e.g. the `main` merge/rebase — is already pushed to origin.
2. Triggers `Storybook Regenerate Baseline`
   (`.github/workflows/app-storybook-generate-baseline.yml`) with `update_baselines=true`,
   optionally narrowing to a `modes` subset.
3. Waits for the run (~5 min with warm caches) and downloads the
   `visual-baselines-linux` artifact into a fresh temp dir.
4. Mirrors it into `apps/storybook/.storybook/test-visual/__image_snapshots__/linux/`
   with `rsync -a --delete`, so deletions of stale snapshots propagate.
5. Reviews the diff **scope** — every changed story must be explainable by the branch's
   changes; unexplained stories stop the flow.
6. Commits only the snapshots folder (`test(storybook): regenerate linux baselines …`)
   and pushes, updating the PR.

`modes` is a comma-separated subset of the matrix in
`apps/storybook/.storybook/visual-modes.js` (e.g. `light-desktop,dark-mobile`);
empty = the full `{dark,light} × {desktop,tablet,mobile}` cross product. The
**dark-desktop** snapshot is the historical unsuffixed `<story>.png`.

Conflict recovery: when `main` and the branch both regenerated the same snapshots,
finish the merge/rebase first (any side of a conflicted PNG is fine — it is about to be
overwritten), push, then run this flow so the committed baselines come from the merged
tree.

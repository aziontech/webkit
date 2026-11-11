# /regen-baselines <branch | pr-number | pr-url> [grep]

Regenerate the **styled visual baselines** (`apps/visual/baselines/`) for a PR branch **in CI**
and land them on the branch. Baselines are valid only when rendered in
`mcr.microsoft.com/playwright:v1.62.0-noble`, the image the `governance.yml` `visual` job runs in.

Run the **regen-baselines** skill (`.claude/skills/regen-baselines/SKILL.md`). It:

1. Resolves the branch and confirms the state to snapshot (e.g. the `main` merge) is pushed.
2. Dispatches `Visual baselines` (`.github/workflows/visual-baselines.yml`) with
   `update_baselines=true`, optionally narrowed by a Playwright `grep` pattern.
3. Downloads the `visual-baselines` artifact into a fresh directory.
4. Mirrors it into `apps/visual/baselines/` (`rsync -a --delete` for a full run).
5. Reviews the scope: every changed image must be explained by the branch.
6. Commits only the baselines (`test(visual): regenerate baselines …`) and pushes.

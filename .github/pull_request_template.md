## Summary

<!-- 1–3 bullets: what changed and why. Don't restate the diff. -->

## How to test

<!-- Numbered, concrete steps to verify THIS PR: the command to run, where to look (story / page / component), and the expected result. -->

## Notes

<!-- Breaking change (what + migration), new dependency, related issue. Write "None" when there is nothing. -->

<!--
  Component or block PRs (the AI flow: /webkit-new, /webkit-new-block) fill every section below;
  the orchestrator generates them. Other PRs delete everything from here down.
-->

## Request and spec

- Closes #<!-- issue -->
- Spec: `.specs/<name>.md` (`status: implemented`, `template: 2`) <!-- or the block folder: packages/webkit/blocks/... -->
- Spec review (`spec-reviewer`): <!-- approve after N rounds; paste the checklist -->

| Item                 | Result |
| -------------------- | ------ |
| naming               |        |
| reuse                |        |
| prop vocabulary      |        |
| states               |        |
| internationalization |        |
| right-to-left        |        |
| responsive           |        |
| accessibility        |        |
| tokens               |        |
| performance          |        |

## Gates

<!-- Paste the table printed by `pnpm --filter @aziontech/webkit run gates`. -->

| Command                                                          | Result |
| ---------------------------------------------------------------- | ------ |
| `pnpm --filter @aziontech/webkit run gates`                      |        |
| `pnpm --filter @aziontech/webkit lint` and `lint:style`          |        |
| `pnpm --filter @aziontech/webkit type-check` and `type-coverage` |        |
| `pnpm --filter @aziontech/webkit format:check`                   |        |
| `pnpm --filter @aziontech/webkit run size`                       |        |
| `vitest run <name>.test copyable-sfcs`                           |        |

## `ui-craft` review

<!-- One heading per child skill with its findings; then the findings left open, each with its reason. -->

## Usage check

<!-- Paste usage-report.md (scripts/usage-check.mjs or the usage-check.yml run): prompt, checks, turns and cost. -->

## Screenshots

- [ ] Light
- [ ] Dark
- [ ] Right-to-left (`dir="rtl"`)
- [ ] Mobile (320 px)
- [ ] Wide (1920 px)

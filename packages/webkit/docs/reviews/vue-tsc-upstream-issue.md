# vue-tsc `//` attribute bug: already reported upstream, not filed

M2.10 row 82. Before filing, an audit on 2026-11-17 reproduced the bug in a fresh app and searched
`vuejs/language-tools`. It is already reported, with our minimal repro, so WebKit files nothing.

## What the audit found

- A static attribute containing `//` on a component inside a `v-for` drops the loop variable from
  type-checking (TS2552 / TS2304). Cause: a regex in `@vue/language-core`
  (`codegen/template/element.js`, `.replace(/\/\/(.*)$/gm, …)`) also rewrites `//` inside string
  literals, so the generated code no longer parses.
- Affected: 3.3.12, 3.3.13 and 3.3.14 (3.3.14 also types later expressions as refs). Clean:
  3.3.8, 3.3.9, 3.3.11. 3.3.14 is the latest stable release.
- Upstream: issues #6240 (exact repro), #6322, #6352, #6360, all open; fix PR #6357 open
  (#6241 closed unmerged).

## What WebKit changed

`VUE_TSC_KNOWN_GOOD` is 3.3.11 and `VUE_TSC_BROKEN` lists 3.3.12 to 3.3.14
(`src/cli/toolchain.js`); the workspace ranges skip them; `MIGRATION_V6.md` and
`docs/toolkit/CLI.md` say the same. Drop the pin once a release with the fix from #6357 ships.

#!/usr/bin/env node

import { parseArgs } from './commands/args.js'
import { runAdd, runDiff, runRemove } from './commands/blocks.js'
import {
  runCanaryCommand,
  runCheckCommand,
  runCss,
  runDoctor,
  runReportCommand
} from './commands/health.js'
import { runInit } from './commands/init.js'
import { runMigrate } from './commands/migrate.js'
import { err, out } from './commands/output.js'
import { runQuery } from './commands/query.js'
import { runSync } from './commands/sync.js'

const COMMANDS = new Set([
  'init',
  'add',
  'remove',
  'diff',
  'search',
  'view',
  'check',
  'doctor',
  'css',
  'report',
  'canary',
  'sync',
  'migrate'
])

const HELP = `@aziontech/webkit — adopt the design system in one command

Usage:
  npx @aziontech/webkit init [options]
  npx @aziontech/webkit add <block-id> [--variant <name>] [--dest <dir|file.vue>] [options]
  npx @aziontech/webkit remove <block-id|path> [--dry-run] [--json]
  npx @aziontech/webkit diff <block-id|path> [--json]
  npx @aziontech/webkit search <query> [--json]
  npx @aziontech/webkit view <id> [--variant <name>] [--example <name>] [--json]
  npx @aziontech/webkit check [--json] [--max-warnings <n>] [--no-lint] [--url <url,...>]
  npx @aziontech/webkit doctor
  npx @aziontech/webkit css [--check]
  npx @aziontech/webkit report [options] [patterns...]
  npx @aziontech/webkit canary
  npx @aziontech/webkit sync [options]
  npx @aziontech/webkit migrate v6 [--dry-run] [--from <major>]

Commands:
  init            Wire @aziontech/webkit into the current project.
  add             Start a screen: copy a block (the reviewed SFC) into the project, check
                   its imports against the installed webkit, record it in webkit.blocks.json
                   and print the route entry to add.
  remove          Delete a copied block: its files (the primary, variants, data files and
                   guidelines; a path removes that one file) and its webkit.blocks.json
                   entry. Lists the app files that still import it and the route to drop.
                   --dry-run prints what would be deleted.
  diff            Compare a copied block with the canonical one of the installed version.
  search          Find blocks, components and examples by plain words.
  view            Show a block (guidelines, variants, SFC) or a component (API, examples).
  check           CI gate: doctor + v5 names + unknown imports + ESLint + Stylelint
                   + block drift.
  doctor          Check the wiring is healthy; report resolved dependency versions.
  css             Rewrite src/webkit.sources.css, the WebKit files Tailwind compiles,
                   from this app's @aziontech/webkit imports (the Vite plugin,
                   @aziontech/webkit/vite-plugin, does it on every dev and build). --check writes nothing and
                   exits 1 when the file is stale.
  report          Measure webkit adoption via this project's own ESLint.
  canary          Prove the design-system lint rules still reach this project.
  sync            Reconcile the copied .claude/ bundle + CLAUDE.md fragment against
                   this webkit version's templates. In a monorepo app with no agent
                   files of its own, works on the repository root that has them.
  migrate v6      Rewrite this project for the v6 major: renamed imports and components,
                   renamed props and values, icon classes (pi pi-times → az az-x,
                   ai ai-edge-functions → az az-functions); lists
                   removed components to replace by hand.
                   --from <major> sets the version the project is on (read from
                   package.json, or detected from v3-only imports, when omitted).

Options (init):
  --dry-run       Print the plan without writing anything.
  --strict        Use the strict ESLint preset (default; every rule is an error).
  --recommended   Use the recommended ESLint preset (also every rule an error).
  -y, --yes       Accept every default; never prompt (CI / scripted runs).
  --no-icons      Skip @aziontech/icons (the icon font) and its entry import.
  --no-entry      Do not edit the app entry (src/main.*); print the imports instead.
  -h, --help      Show this help.

Options (add):
  --variant <name>  Also copy this variant (state) of the block, as <Name><Variant>.vue.
  --dest <path>     Directory (or .vue file) for the copy; default: the router's views
                    directory, else src/views, else src/pages.
  --with-guidelines Copy the block guidelines next to it as <Name>.guidelines.md.
  --dry-run         Print what would be written; write nothing.
  --force           Overwrite files that already exist.

Options (diff, search, view, check):
  --json            Machine-readable output.
  --example <name>  view: print this example of a component instead of the first.
  --max-warnings <n> check: also fail when there are more than n warnings.
  --no-lint         check: skip the project's ESLint and Stylelint runs (built-in
                    scans only).
  --url <url,...>   check: also open these running routes in Chromium (the project's
                    Playwright) and fail on navigation levels that repeat a route or
                    disagree on the current page (rule webkit-navigation-levels).
  diff exits 0 when the copy matches the canonical block, 1 when it differs.

Options (report):
  --format <markdown|json>   Output format (default: markdown).
  --fail-on <never|any>      Exit 1 when violations exist (default: never).
  [patterns...]              ESLint file patterns to lint (default: .).

Options (sync):
  --check         Apply nothing; print the state table; exit 1 if anything has drifted.
  --dry-run       Apply nothing; print what would happen; always exits 0.
  --force         Also overwrite files edited locally after they were stamped.
  --json          Print the report as JSON instead of the state table.

Run interactively (a TTY, no --yes) and init asks about the optional pieces —
icons, entry wiring — before writing anything.
`

const HANDLERS = {
  init: runInit,
  doctor: (projectDir) => runDoctor(projectDir),
  css: runCss,
  add: (projectDir, parsed) => runAdd(projectDir, parsed.args[0], parsed),
  remove: (projectDir, parsed) => runRemove(projectDir, parsed.args[0], parsed),
  diff: (projectDir, parsed) => runDiff(projectDir, parsed.args[0], parsed),
  search: (projectDir, parsed) => runQuery(projectDir, 'search', parsed),
  view: (projectDir, parsed) => runQuery(projectDir, 'view', parsed),
  check: runCheckCommand,
  report: runReportCommand,
  canary: (projectDir) => runCanaryCommand(projectDir),
  migrate: (projectDir, parsed) =>
    runMigrate(projectDir, parsed.args[0], { dryRun: parsed.dryRun, from: parsed.from }),
  sync: (projectDir, parsed) =>
    runSync(projectDir, {
      check: parsed.check,
      dryRun: parsed.dryRun,
      force: parsed.force,
      json: parsed.json
    })
}

async function run(argv) {
  const parsed = parseArgs(argv)
  const { command, help, unknown } = parsed

  if (help || !command) {
    out(HELP)
    return command || help ? 0 : 1
  }
  if (unknown.length) {
    err(`Unknown option(s): ${unknown.join(', ')}\n\n${HELP}`)
    return 1
  }
  if (!COMMANDS.has(command)) {
    err(`Unknown command: ${command}\n\n${HELP}`)
    return 1
  }
  return HANDLERS[command](process.cwd(), parsed)
}

run(process.argv).then(
  (code) => {
    process.exitCode = code
  },
  (error) => {
    err(`${error?.message || error}\n`)
    process.exitCode = 1
  }
)

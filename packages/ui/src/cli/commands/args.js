import { parseUrls } from '../navigation-check.js'

const KNOWN_FLAGS = new Set([
  '--dry-run',
  '--strict',
  '--recommended',
  '--yes',
  '-y',
  '--no-icons',
  '--no-entry',
  '--check',
  '--force',
  '--json',
  '--with-guidelines',
  '--no-lint',
  '--claude',
  '-h',
  '--help'
])
const VALUE_FLAGS = new Set([
  '--format',
  '--fail-on',
  '--from',
  '--dest',
  '--variant',
  '--example',
  '--max-warnings',
  '--url'
])

function splitValues(args) {
  const values = {}
  const rest = []
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (VALUE_FLAGS.has(a)) {
      values[a] = args[i + 1]
      i += 1
      continue
    }
    rest.push(a)
  }
  return { values, rest }
}

export function parseArgs(argv) {
  const args = argv.slice(2)
  const command = args.find((a) => !a.startsWith('-')) || null
  const { values, rest } = splitValues(args)

  const flagList = rest.filter((a) => a.startsWith('-'))
  const unknown = flagList.filter((f) => !KNOWN_FLAGS.has(f))
  const flags = new Set(flagList)
  const positionals = rest.filter((a) => a !== command && !a.startsWith('-'))

  return {
    command,
    unknown,
    dryRun: flags.has('--dry-run'),
    recommended: flags.has('--recommended') && !flags.has('--strict'),
    yes: flags.has('--yes') || flags.has('-y'),
    noIcons: flags.has('--no-icons'),
    noEntry: flags.has('--no-entry'),
    help: flags.has('-h') || flags.has('--help'),
    format: values['--format'],
    failOn: values['--fail-on'],
    from: values['--from'],
    args: positionals,
    check: flags.has('--check'),
    force: flags.has('--force'),
    json: flags.has('--json'),
    withGuidelines: flags.has('--with-guidelines'),
    noLint: flags.has('--no-lint'),
    claude: flags.has('--claude'),
    dest: values['--dest'],
    variant: values['--variant'],
    example: values['--example'],
    maxWarnings: values['--max-warnings'],
    urls: parseUrls(values['--url'])
  }
}

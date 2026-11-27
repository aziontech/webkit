export const UI_EXTENSIONS = ['vue', 'astro']

const RULE_PURPOSE = {
  'no-page-navigation-menu': 'free Menu in a page body (one navigation per level)',
  'no-viewport-height-calc':
    'page height hand-computed from the viewport (calc(100dvh - …)) instead of data-layout-fill',
  'no-root-relative-asset':
    'site-only /marketing-components or /media URL a copied app does not serve',
  'no-unknown-import': 'import path that does not exist in the installed version',
  'no-deep-internal-import': 'reaches into the package internals instead of a published entry',
  'no-barrel-import': 'bare-package barrel import (there is no barrel entry)',
  'no-whole-icon-set-import': 'pulls the whole icon set instead of one icon',
  'no-hardcoded-color': 'hardcoded colour, palette class or raw text size',
  'no-hardcoded-motion': 'literal duration/easing, or motion with no reduced-motion escape',
  'no-physical-direction': 'physical left/right utility that does not mirror under RTL',
  'prefer-tree-shakeable-root': 'compound entry imported where the root would do',
  'no-deprecated-component': 'component marked deprecated in the catalog',
  'no-deprecated-name': 'component, prop, value or icon name Azion UI 6.0 renamed or removed',
  'prefer-azion-ui-component': 'foreign UI library where an Azion UI component exists',
  'prefer-define-model': 'hand-rolled modelValue + update:modelValue pair',
  'no-style-override': 'class/style on an Azion UI component — restyling it',
  'require-authoring-standards': 'shared authoring standards (typed slots, comments, deprecation)',
  'require-container-width': 'Card, StatTile or ChartCard as a flex item with no width',
  'require-header-search': 'app header without SearchTrigger, or a hand-rolled ⌘K field',
  'no-wrapped-page-chrome':
    'SiteFooterSection or SiteHeaderSection inside a bordered or padded wrapper',
  'no-output-in-command': 'shell code sample that mixes the command with what it prints',
  'prefer-href-in-menu-node': 'navigation node naming its destination path/to/url instead of href',
  'no-gap-after-closing-section':
    'Spacer or closing frame after a section that draws its own close',
  'require-accessible-name': 'IconButton or ButtonGroup with no aria-label or aria-labelledby',
  'prefer-value-control':
    'text Input used for a number, a date, a phone number or a secret (native type or a date format)',
  'prefer-date-picker': 'date or time typed as text instead of DatePicker or DateRangePicker',
  'no-raw-id-input': 'resource ID typed as text instead of a searchable picker',
  'no-dropped-children':
    'content inside an Azion UI component with no default slot, never rendered',
  'prefer-hint': 'hand-made help (a typed ?, an info icon in a Tooltip) or a paragraph in a Tooltip'
}

const TEMPLATE_ONLY_RULES = [
  'no-style-override',
  'require-container-width',
  'require-header-search',
  'no-wrapped-page-chrome',
  'no-gap-after-closing-section',
  'require-accessible-name',
  'prefer-value-control',
  'prefer-date-picker',
  'no-raw-id-input',
  'no-dropped-children',
  'prefer-hint'
]

function bare(rule) {
  return rule.replace(/^azion-ui\//, '')
}

function headerSection(report, catalog) {
  const out = ['## Azion UI adoption', '']
  if (!catalog.available) {
    out.push(
      '> **The Azion UI catalog could not be resolved, so the catalog-backed rules did nothing.** ' +
        'This is not a clean bill of health — install `@aziontech/ui`, or set ' +
        '`AZION_UI_CATALOG_PATH`, and run it again.',
      ''
    )
  }
  out.push(
    catalog.version
      ? `Measured against \`${catalog.package}@${catalog.version}\`.`
      : `Measured against \`${catalog.package}\` (version unknown).`,
    '',
    '| | |',
    '|---|---|',
    `| Violations | **${report.total}** |`,
    `| Files affected | ${report.filesAffected} |`,
    `| UI files clean | ${report.uiFilesClean} of ${report.uiFilesTotal} — **${report.score}%** |`,
    ''
  )
  return out
}

function byRuleSection(report) {
  return [
    '### By rule',
    '',
    '| Rule | Count | What it catches |',
    '|---|---:|---|',
    ...report.byRule.map(
      ([rule, count]) => `| \`${bare(rule)}\` | ${count} | ${RULE_PURPOSE[bare(rule)] ?? '—'} |`
    ),
    ''
  ]
}

function byFileSection(report) {
  const shown = report.byFile.slice(0, 15)
  const out = [
    '### By file',
    '',
    '| File | Count | Rules |',
    '|---|---:|---|',
    ...shown.map(
      ({ file, count, rules }) =>
        `| \`${file}\` | ${count} | ${rules.map((r) => `\`${bare(r)}\``).join(', ')} |`
    )
  ]
  if (report.byFile.length > shown.length) {
    out.push('', `_${report.byFile.length - shown.length} more file(s) not shown._`)
  }
  out.push('')
  return out
}

function violationSections(report) {
  if (report.total === 0) {
    return ['No `azion-ui/*` violations. Read the coverage note before celebrating.', '']
  }
  return [...byRuleSection(report), ...byFileSection(report)]
}

function coverageSection(report) {
  const found = report.byExtension.length
    ? report.byExtension.map(([ext, n]) => `\`.${ext || 'no extension'}\` (${n})`).join(', ')
    : 'none'
  const out = [
    '### Coverage — what this did and did not look at',
    '',
    `- Violations found in: ${found}.`,
    `- The score counts ${UI_EXTENSIONS.map((e) => `\`.${e}\``).join(' and ')} files only — those are ` +
      'the ones the design system governs.',
    `- ${TEMPLATE_ONLY_RULES.map((r) => `\`${r}\``).join(', ')} cannot run on \`.astro\`: it needs ` +
      "vue-eslint-parser's template visitor, which astro-eslint-parser does not provide. Restyled " +
      'components inside Astro files are invisible here.',
    '- Raw HTML where an Azion UI component exists (`<button>`, `<input>`, a hand-rolled modal) is ' +
      'caught by no rule yet — `prefer-azion-ui-component` matches imports from a foreign package, ' +
      'not markup.'
  ]
  if (report.fatalFiles.length) {
    out.push(
      `- ${report.fatalFiles.length} file(s) had a fatal parse error and were not checked at all: ` +
        report.fatalFiles.map((f) => `\`${f}\``).join(', ') +
        '.'
    )
  }
  out.push('')
  return out
}

export function renderMarkdown(report, { catalog }) {
  const out = [
    ...headerSection(report, catalog),
    ...violationSections(report),
    ...coverageSection(report)
  ]
  return out.join('\n') + '\n'
}

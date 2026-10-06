export const indent = (markup, depth = 1) =>
  markup
    .split('\n')
    .map((line) => (line ? `${'  '.repeat(depth)}${line}` : line))
    .join('\n')

export const each = (items, render, depth = 0) =>
  items.map((item, index) => indent(render(item, index), depth)).join('\n')

export const inColumn = (markup) =>
  `<SectionContainer max-width="site">\n  <SectionGap hatch />\n\n${indent(markup)}\n\n  <SectionGap hatch />\n</SectionContainer>`

export const COLUMN_IMPORTS = [
  "import SectionContainer from '@aziontech/webkit/section-container'",
  "import SectionGap from '@aziontech/webkit/section-gap'"
]

const text = (value) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

const multiline = (value) =>
  `\`${value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``

export const declareTabs = (name, tabs) =>
  `const ${name} = [\n${tabs
    .map(
      (tab) =>
        `  {\n${Object.entries(tab)
          .map(([key, value]) => `    ${key}: ${key === 'code' ? multiline(value) : text(value)}`)
          .join(',\n')}\n  }`
    )
    .join(',\n')}\n]`

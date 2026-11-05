const kebab = (key) => key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const attribute = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

const isInline = (value) => typeof value === 'string' && !value.includes('\n')

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

const quote = (value) =>
  `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`

const literal = (value, depth = 0) => {
  const pad = '  '.repeat(depth + 1)
  const close = '  '.repeat(depth)
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return `[\n${value.map((item) => `${pad}${literal(item, depth + 1)}`).join(',\n')}\n${close}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined)
    if (!entries.length) return '{}'
    return `{\n${entries
      .map(
        ([key, item]) =>
          `${pad}${IDENTIFIER.test(key) ? key : quote(key)}: ${literal(item, depth + 1)}`
      )
      .join(',\n')}\n${close}}`
  }
  if (typeof value === 'string') return quote(value)
  return String(value)
}

/**
 * Render a page section's site-JSON `props` as concrete component markup.
 *
 * Strings become plain attributes, numbers and booleans become bound attributes,
 * and anything structured (arrays, objects, multi-line strings) becomes a
 * `<script setup>` const that the matching bound attribute references — so the
 * "Show code" panel stays a runnable SFC with no `v-bind="args"`.
 *
 * @param {string} tag - the PascalCase component tag (`UseCases`).
 * @param {Record<string, unknown>} props - the section's `SITE_SECTION.props`.
 * @param {Record<string, string>} [bindings] - extra attributes written verbatim after the props, such as `{ '@submit': 'onSubmit', ':loading': 'loading' }`.
 * @returns {{ body: string, script: string[] }} the element markup and the
 *   script lines to pass to `toSfc` after the imports.
 */
export const sectionMarkup = (tag, props, bindings = {}) => {
  const attributes = []
  const script = []

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue
    const name = kebab(key)
    if (isInline(value)) {
      attributes.push(`${name}="${attribute(value)}"`)
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      attributes.push(`:${name}="${value}"`)
    } else {
      if (script.length) script.push('')
      script.push(`const ${key} = ${literal(value)}`)
      attributes.push(`:${name}="${key}"`)
    }
  }

  for (const [name, expression] of Object.entries(bindings)) {
    attributes.push(`${name}="${expression}"`)
  }

  const body = attributes.length
    ? `<${tag}\n${attributes.map((line) => `  ${line}`).join('\n')}\n/>`
    : `<${tag} />`

  return { body, script }
}

export const SUBMIT_STATE_BINDINGS = {
  ':loading': 'loading',
  ':submitted': 'submitted',
  ':error': 'error',
  '@submit': 'onSubmit'
}

export const submitWiring = (request) => [
  'const loading = ref(false)',
  'const submitted = ref(false)',
  'const error = ref(false)',
  '',
  'const onSubmit = async (event, values) => {',
  '  loading.value = true',
  '  error.value = false',
  '  try {',
  ...request.map((line) => `    ${line}`),
  '    submitted.value = response.ok',
  '    error.value = !response.ok',
  '  } catch {',
  '    error.value = true',
  '  } finally {',
  '    loading.value = false',
  '  }',
  '}'
]

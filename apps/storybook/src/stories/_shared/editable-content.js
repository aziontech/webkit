import { computed } from 'vue'

const CONTENT_ATTRIBUTES = new Set([
  'alt',
  'description',
  'eyebrow',
  'highlight',
  'href',
  'job-title',
  'label',
  'link-label',
  'media-href',
  'placeholder',
  'src',
  'subtitle',
  'text',
  'title',
  'title-muted'
])

const STRUCTURAL_BINDINGS = new Set(['class', 'style', 'key', 'ref', 'is'])

const RAW_TEXT_TAGS = new Set(['pre', 'code', 'script', 'style', 'textarea'])

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr'
])

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

const decode = (value) =>
  value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, name) => {
    if (name.startsWith('#x') || name.startsWith('#X')) {
      return String.fromCodePoint(parseInt(name.slice(2), 16))
    }
    if (name.startsWith('#')) return String.fromCodePoint(parseInt(name.slice(1), 10))
    return ENTITIES[name] ?? match
  })

const hasWords = (value) => /[\p{L}\p{N}]/u.test(value)

const carriesCopy = (value) => {
  if (typeof value === 'string') return hasWords(value)
  if (value && typeof value === 'object') return Object.values(value).some(carriesCopy)
  return false
}

const literal = (expression) => {
  const source = decode(expression).trim()
  if (!/^[[{'"`]/.test(source)) return null
  try {
    return { value: JSON.parse(JSON.stringify(new Function(`return (${source})`)())) }
  } catch {
    return null
  }
}

const identifier = (words) =>
  words
    .join(' ')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('')

const isComponent = (tag) => /^[A-Z]/.test(tag)

const scanTag = (template, start) => {
  const nameMatch = /^<([\w.-]+)/.exec(template.slice(start))
  const tag = nameMatch[1]
  const attributes = []
  let cursor = start + nameMatch[0].length

  while (cursor < template.length) {
    while (/\s/.test(template[cursor])) cursor += 1
    if (template[cursor] === '>') return { tag, attributes, end: cursor + 1, selfClosing: false }
    if (template.startsWith('/>', cursor)) {
      return { tag, attributes, end: cursor + 2, selfClosing: true }
    }

    const attributeStart = cursor
    while (cursor < template.length && !/[\s=>]/.test(template[cursor])) {
      if (template.startsWith('/>', cursor)) break
      cursor += 1
    }
    const name = template.slice(attributeStart, cursor)
    let value = null

    if (template[cursor] === '=') {
      cursor += 1
      const quote = template[cursor]
      if (quote === '"' || quote === "'") {
        const close = template.indexOf(quote, cursor + 1)
        value = template.slice(cursor + 1, close)
        cursor = close + 1
      } else {
        const valueStart = cursor
        while (cursor < template.length && !/[\s>]/.test(template[cursor])) cursor += 1
        value = template.slice(valueStart, cursor)
      }
    }

    attributes.push({ name, value, start: attributeStart, end: cursor })
  }

  return { tag, attributes, end: template.length, selfClosing: true }
}

const extract = (template) => {
  const edits = []
  const fields = []
  const keys = new Set()
  const instances = {}
  const stack = []
  const fieldCounts = {}

  const categoryOf = (entry) => {
    if (!entry) return 'Section'
    if (!entry.category) {
      instances[entry.tag] = (instances[entry.tag] ?? 0) + 1
      const label = entry.tag.replaceAll('.', '')
      entry.category = instances[entry.tag] === 1 ? label : `${label} ${instances[entry.tag]}`
    }
    return entry.category
  }

  const nearestComponent = () => [...stack].reverse().find((entry) => isComponent(entry.tag))

  const addField = (category, name, value, control) => {
    const countKey = `${category}\u0000${name}`
    fieldCounts[countKey] = (fieldCounts[countKey] ?? 0) + 1
    const label = fieldCounts[countKey] === 1 ? name : `${name} ${fieldCounts[countKey]}`
    let key = identifier([category, label])
    while (keys.has(key)) key = `${key}_`
    keys.add(key)
    fields.push({ key, name: label, category, value, control })
    return key
  }

  let cursor = 0
  while (cursor < template.length) {
    if (template.startsWith('<!--', cursor)) {
      cursor = template.indexOf('-->', cursor) + 3
      continue
    }

    if (template.startsWith('</', cursor)) {
      const close = template.indexOf('>', cursor)
      const tag = template.slice(cursor + 2, close).trim()
      const index = stack.map((entry) => entry.tag).lastIndexOf(tag)
      if (index !== -1) stack.length = index
      cursor = close + 1
      continue
    }

    if (template[cursor] === '<' && /[A-Za-z]/.test(template[cursor + 1] ?? '')) {
      const { tag, attributes, end, selfClosing } = scanTag(template, cursor)
      const entry = { tag, category: null }
      const owner = isComponent(tag) ? entry : nearestComponent()

      for (const attribute of attributes) {
        if (attribute.value === null) continue

        if (CONTENT_ATTRIBUTES.has(attribute.name) && hasWords(attribute.value)) {
          const key = addField(categoryOf(owner), attribute.name, decode(attribute.value), 'text')
          edits.push({
            start: attribute.start,
            end: attribute.end,
            replacement: `:${attribute.name}="sectionContent.${key}"`
          })
          continue
        }

        const bound = /^(?::|v-bind:)([\w-]+)$/.exec(attribute.name)
        if (!bound || STRUCTURAL_BINDINGS.has(bound[1])) continue

        const parsed = literal(attribute.value)
        if (!parsed || !carriesCopy(parsed.value)) continue

        const control = typeof parsed.value === 'string' ? 'text' : 'object'
        if (control === 'text' && !CONTENT_ATTRIBUTES.has(bound[1])) continue
        const key = addField(categoryOf(owner), bound[1], parsed.value, control)
        edits.push({
          start: attribute.start,
          end: attribute.end,
          replacement: `:${bound[1]}="sectionContent.${key}"`
        })
      }

      if (!selfClosing && !VOID_TAGS.has(tag.toLowerCase())) stack.push(entry)
      cursor = end
      continue
    }

    const next = template.indexOf('<', cursor + 1)
    const textEnd = next === -1 ? template.length : next
    const text = template.slice(cursor, textEnd)
    const parent = stack.at(-1)
    const insideRawText = stack.some((entry) => RAW_TEXT_TAGS.has(entry.tag.toLowerCase()))

    if (parent && !insideRawText && !text.includes('{{') && hasWords(text)) {
      const [, leading, body, trailing] = /^([ \t\n\r\f]*)([\s\S]*?)([ \t\n\r\f]*)$/.exec(text)
      const value = decode(body.replace(/[ \t\n\r\f]+/g, ' '))
      const owner = isComponent(parent.tag) ? parent : nearestComponent()
      const name = isComponent(parent.tag) ? 'text' : `${parent.tag} text`
      const key = addField(categoryOf(owner), name, value, 'text')
      const expression = [leading && "' '", `sectionContent.${key}`, trailing && "' '"]
        .filter(Boolean)
        .join(' + ')
      edits.push({ start: cursor, end: textEnd, replacement: `{{ ${expression} }}` })
    }

    cursor = textEnd
  }

  const markup = edits
    .sort((a, b) => b.start - a.start)
    .reduce(
      (result, edit) => result.slice(0, edit.start) + edit.replacement + result.slice(edit.end),
      template
    )

  return { markup, fields }
}

const isPlainData = (value) => {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return true
  if (Array.isArray(value)) return value.every(isPlainData)
  if (typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return (proto === Object.prototype || proto === null) && Object.values(value).every(isPlainData)
}

const extractSafely = (template) => {
  try {
    return extract(template)
  } catch {
    return null
  }
}

export const editable = (factory, data = {}) => {
  const extracted =
    typeof factory().template === 'string' ? extractSafely(factory().template) : null
  if (!extracted) return { render: () => factory() }
  const { fields, markup } = extracted

  const plainData = Object.entries(data).filter(([, value]) => isPlainData(value))
  const dataFields = plainData.map(([binding, value]) => {
    let key = identifier(['data', binding])
    while (fields.some((field) => field.key === key)) key = `${key}_`
    return { key, binding, name: binding, category: 'Data', value, control: 'object' }
  })

  const all = [...fields, ...dataFields]

  return {
    args: Object.fromEntries(all.map((field) => [field.key, field.value])),
    argTypes: Object.fromEntries(
      all.map((field) => [
        field.key,
        { name: field.name, control: field.control, table: { category: field.category } }
      ])
    ),
    render: (args) => {
      const options = factory()
      return {
        ...options,
        setup: (props, context) => ({
          ...(options.setup?.(props, context) ?? {}),
          ...Object.fromEntries(
            dataFields.map((field) => [field.binding, computed(() => args[field.key])])
          ),
          sectionContent: args
        }),
        template: markup
      }
    }
  }
}

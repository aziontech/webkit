import { cached, keys } from './data'
import type { BlockIndexItem, ComponentDoc, ComponentIndexItem, Highlighted, Row } from './types'

function text(html: string): string {
  return html
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<a [^>]*>(.*?)<\/a>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()
}

function table(rows: Row[], columns: string[]): string {
  if (!rows.length) return ''
  const head = `| ${columns.join(' | ')} |\n| ${columns.map(() => '---').join(' | ')} |`
  const body = rows
    .map(
      (row) => `| ${columns.map((key) => text(row[key] ?? '').replace(/\|/g, '\\|')).join(' | ')} |`
    )
    .join('\n')
  return `${head}\n${body}`
}

export function componentMarkdown(item: ComponentIndexItem, doc: ComponentDoc): string {
  const parts = [
    `# ${item.title}`,
    text(doc.purpose),
    '```js\n' + `import ${item.title} from '${doc.import}'` + '\n```'
  ]
  if (doc.useWhen.length)
    parts.push('## When to use\n' + doc.useWhen.map((line) => `- ${text(line)}`).join('\n'))
  if (doc.avoidWhen.length)
    parts.push('## When not to use\n' + doc.avoidWhen.map((line) => `- ${text(line)}`).join('\n'))
  if (doc.props.length)
    parts.push('## Props\n' + table(doc.props, ['name', 'type', 'default', 'doc']))
  if (doc.events.length) parts.push('## Events\n' + table(doc.events, ['name', 'payload', 'notes']))
  if (doc.slots.length) parts.push('## Slots\n' + table(doc.slots, ['name', 'scope', 'notes']))
  if (doc.bestPractices.length)
    parts.push(
      '## Best practices\n' + doc.bestPractices.map((line) => `- ${text(line)}`).join('\n')
    )
  if (doc.exampleDir) {
    for (const example of doc.examples) {
      const source = cached<Highlighted>(keys.exampleSource(doc.exampleDir, example.file))
      if (!source) continue
      parts.push(
        `## Example: ${example.name}\n${text(example.summary)}\n\n\`\`\`vue\n${source.code}\n\`\`\``
      )
    }
  }
  return parts.filter(Boolean).join('\n\n') + '\n'
}

export function blockMarkdown(block: BlockIndexItem, summary: string): string {
  const parts = [
    `# ${block.title}`,
    summary,
    '```bash\n' + `npx @aziontech/webkit add ${block.id}` + '\n```'
  ]
  for (const state of block.states) {
    const source = cached<Highlighted>(keys.blockSource(block.dir, state.file))
    if (source) parts.push(`## ${state.name}\n\n\`\`\`vue\n${source.code}\n\`\`\``)
  }
  return parts.join('\n\n') + '\n'
}

export async function copyText(value: string, llms: string | null): Promise<void> {
  let content = value
  if (llms) {
    try {
      const response = await fetch(llms)
      if (response.ok) content = await response.text()
    } catch {}
  }
  await navigator.clipboard.writeText(content)
}

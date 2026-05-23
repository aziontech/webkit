#!/usr/bin/env node
/** Cross-check .specs/<name>.md against root .vue files (props/events/slots). */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import {
  bodyChecksum,
  getSection,
  parseSpecFile,
  parseTable,
  parseVueSfc
} from '../.claude/hooks/_lib/spec.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const WEBKIT = join(ROOT, 'packages/webkit/src/components/webkit')

function resolveRootVue(componentDir, name) {
  const candidates = [`${name}.vue`, `${name}-root.vue`]
  for (const f of candidates) {
    const p = join(componentDir, f)
    if (existsSync(p)) return p
  }
  const vueFiles = readdirSync(componentDir).filter((f) => f.endsWith('.vue'))
  const rootish = vueFiles.find((f) => f.includes('root'))
  if (rootish) return join(componentDir, rootish)
  return vueFiles.length === 1 ? join(componentDir, vueFiles[0]) : null
}

function diff(actualSet, expectedSet) {
  const missing = [...expectedSet].filter((x) => !actualSet.has(x))
  const extra = [...actualSet].filter((x) => !expectedSet.has(x))
  return { missing, extra }
}

function main() {
  const failures = []
  let count = 0
  for (const category of readdirSync(WEBKIT)) {
    const catPath = join(WEBKIT, category)
    if (!statSync(catPath).isDirectory()) continue
    for (const name of readdirSync(catPath)) {
      const componentDir = join(catPath, name)
      if (!statSync(componentDir).isDirectory()) continue
      const rootPath = resolveRootVue(componentDir, name)
      if (!rootPath) continue
      count++
      const specPath = join(ROOT, '.specs', `${name}.md`)
      if (!existsSync(specPath)) {
        failures.push(`${name}: missing spec`)
        continue
      }
      const { frontmatter, body } = parseSpecFile(specPath)
      if (frontmatter.checksum !== bodyChecksum(body)) {
        failures.push(`${name}: checksum mismatch`)
      }
      const vueText = readFileSync(rootPath, 'utf-8')
      const sfc = parseVueSfc(vueText)
      const script = vueText.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? ''
      const runtimeBlock = script.match(/defineProps\s*\(\s*\{([\s\S]*?)\}\s*\)/)?.[1]
      const runtimeProps = []
      if (runtimeBlock) {
        const re = /(\w+):\s*\{([\s\S]*?)\n\s*\}/g
        let m
        while ((m = re.exec(runtimeBlock)) !== null) runtimeProps.push(m[1])
      }
      const codeProps = new Set([...sfc.props.map((p) => p.name), ...runtimeProps])
      const specProps = new Set(
        parseTable(getSection(body, 'Props'))
          .map((r) => (r.prop ?? '').replace(/`/g, '').trim())
          .filter((p) => p && p !== '_none_')
      )
      const propsDiff = diff(codeProps, specProps)
      if (propsDiff.missing.length || propsDiff.extra.length) {
        failures.push(
          `${name} props: missing in .vue [${propsDiff.missing}] extra in .vue [${propsDiff.extra}]`
        )
      }
      const codeEmits = new Set([
        ...sfc.emits.map((e) => e.name),
        ...(script.match(/defineEmits\s*\(\s*\[([^\]]*)\]/)?.[1] ?? '')
          .split(',')
          .map((s) => s.trim().replace(/['"]/g, ''))
          .filter(Boolean)
      ])
      const specEvents = new Set(
        parseTable(getSection(body, 'Events'))
          .map((r) => (r.event ?? '').replace(/`/g, '').trim())
          .filter((e) => e && e !== '_none_')
      )
      const eventsDiff = diff(codeEmits, specEvents)
      if (eventsDiff.missing.length || eventsDiff.extra.length) {
        failures.push(
          `${name} events: missing [${eventsDiff.missing}] extra [${eventsDiff.extra}]`
        )
      }
    }
  }
  if (failures.length) {
    console.error(failures.join('\n'))
    process.exit(1)
  }
  console.log(`OK: ${count} components verified`)
}

main()

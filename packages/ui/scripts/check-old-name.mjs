#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const allowed = JSON.parse(
  readFileSync(new URL('./old-name-allowed.json', import.meta.url), 'utf8')
)
const files = allowed.files.map((s) => new RegExp(s))
const patterns = allowed.patterns.map((s) => new RegExp(s, 'g'))

export function strip(line) {
  return patterns.reduce((text, re) => text.replace(re, ''), line)
}

export function findOldNames(lines) {
  const found = []
  for (const raw of lines) {
    const m = raw.match(/^(.*?):(\d+):(.*)$/)
    if (!m) continue
    const [, file, line, text] = m
    if (files.some((re) => re.test(file))) continue
    if (/webkit/i.test(strip(text))) found.push({ file, line: Number(line), text: text.trim() })
  }
  return found
}

function grep() {
  try {
    return execFileSync('git', ['grep', '-I', '-n', '-i', 'webkit'], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 1 << 28
    }).split('\n')
  } catch (error) {
    if (error.status === 1) return []
    throw error
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const found = findOldNames(grep())
  for (const f of found) console.error(`${f.file}:${f.line}: ${f.text.slice(0, 160)}`)
  if (found.length) {
    console.error(
      `\ncheck:old-name: ${found.length} line(s) still say "webkit". The library is Azion UI (@aziontech/ui). ` +
        'A browser-engine or CSS-prefix use goes in scripts/old-name-allowed.json.'
    )
    process.exit(1)
  }
  console.log('check:old-name: no old library name outside the allowed list')
}

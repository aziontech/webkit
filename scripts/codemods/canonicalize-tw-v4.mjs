#!/usr/bin/env node
// ENG-47001 — canonicalize Tailwind v4 arbitrary-value syntax.
//
// Rewrites the three families the real v4 compiler (tailwindcss 4.3.3) proved emit
// byte-identical CSS:
//   A  whole-value var   prop-[var(--x)]        -> prop-(--x)
//   B  typed value       prop-[type:var(--x)]   -> prop-(type:--x)
//   E  numeric arbitrary z-[<int>]              -> z-<int>          (z-index only; the
//                                                  only numeric-arbitrary prefix in-repo,
//                                                  and z-<n> == z-[n] for any integer)
//
// It provably LEAVES two families bracketed, because converting them emits no CSS:
//   C  custom-property declaration  [--x:var(--y)]      (type segment starts with `--`)
//   D  expression value             w-[calc(var(--a)*2)] (bracket opens with calc/min/…)
//
// Both are excluded by construction: A only fires when `[` is immediately followed by
// `var(`; B only when the type segment starts with a letter. Neither can match C or D.
// verify-skips.test.mjs pins that.
//
// Usage:  node scripts/codemods/canonicalize-tw-v4.mjs [--write]
//         (default is a dry run that only reports)

import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = fileURLToPath(new URL('../..', import.meta.url))

// Areas the sweep covers (acceptance criteria). apps/icons-gallery (Tailwind v3) is
// deliberately absent — it must stay untouched.
const ROOTS = [
  'packages/webkit/src',
  'packages/webkit/docs',
  'packages/webkit/cli-templates',
  'packages/theme',
  'apps/storybook',
  '.specs',
  '.claude'
]

const EXTS = new Set(['.vue', '.ts', '.js', '.mjs', '.cjs', '.md', '.mdx', '.css', '.scss'])
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', 'storybook-static'])

// --- the three conversions ------------------------------------------------------
// B first (it consumes `[type:var(--x)]`); A next (`[var(--x)]`); E last.
const A = { re: /\[var\((--[A-Za-z0-9-]+)\)\]/g, to: '($1)' }
const B = { re: /\[([a-z][a-z-]*):var\((--[A-Za-z0-9-]+)\)\]/g, to: '($1:$2)' }
const E = { re: /\bz-\[(\d+)\]/g, to: 'z-$1' }

// Strong invariant: collect every arbitrary bracket value that mentions `var(` — the
// full var-bearing surface. The ones A/B convert leave the brackets; every OTHER
// var-bearing bracket (family C custom-property declarations, family D expression
// values) must survive the codemod byte-for-byte. We compare this residual multiset
// before and after; if a single C/D bracket changed, the codemod is unsafe.
const VAR_BRACKET = /\[[^\][]*var\([^\][]*\)[^\][]*\]/g
const A_MATCH = /^\[var\(--[A-Za-z0-9-]+\)\]$/
const B_MATCH = /^\[[a-z][a-z-]*:var\(--[A-Za-z0-9-]+\)\]$/

function residualVarBrackets(text) {
  return (text.match(VAR_BRACKET) || [])
    .filter((b) => !A_MATCH.test(b) && !B_MATCH.test(b))
    .sort()
}

export function convert(text) {
  let out = text
  let a = 0
  let b = 0
  let e = 0
  out = out.replace(B.re, (...m) => (b++, `(${m[1]}:${m[2]})`))
  out = out.replace(A.re, (...m) => (a++, `(${m[1]})`))
  out = out.replace(E.re, (...m) => (e++, `z-${m[1]}`))
  return { out, a, b, e }
}

function walk(dir, acc) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.specs' && entry.name !== '.claude') {
      // allow the two dotted roots through, skip other dotfiles/dirs
      if (!(dir === REPO && (entry.name === '.specs' || entry.name === '.claude'))) {
        if (entry.isDirectory() && entry.name.startsWith('.')) continue
      }
    }
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      walk(full, acc)
    } else if (EXTS.has(extname(entry.name))) {
      acc.push(full)
    }
  }
  return acc
}

function main() {
  const write = process.argv.includes('--write')
  const files = []
  for (const root of ROOTS) walk(join(REPO, root), files)

  let totalA = 0
  let totalB = 0
  let totalE = 0
  let changedFiles = 0
  let residualTotal = 0

  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    const before = residualVarBrackets(text)
    residualTotal += before.length

    const { out, a, b, e } = convert(text)
    if (a + b + e === 0) continue

    // Invariant: every var-bearing bracket that is NOT an A/B conversion (i.e. every
    // family C / family D site) must be byte-identical after the codemod.
    const after = residualVarBrackets(out)
    if (before.length !== after.length || before.some((v, i) => v !== after[i])) {
      throw new Error(`residual var-bracket set changed in ${file} — unsafe, aborting.`)
    }

    totalA += a
    totalB += b
    totalE += e
    changedFiles++
    if (write) writeFileSync(file, out)
  }

  console.log(`${write ? 'APPLIED' : 'DRY RUN'} — scanned ${files.length} files`)
  console.log(`  Family A (prop-[var(--x)]   -> prop-(--x))     : ${totalA}`)
  console.log(`  Family B (prop-[type:var()] -> prop-(type:--x)): ${totalB}`)
  console.log(`  Family E (z-[<int>]         -> z-<int>)        : ${totalE}`)
  console.log(`  files changed                                  : ${changedFiles}`)
  console.log(`  C/D var-bearing brackets left untouched        : ${residualTotal}`)
}

// Only run when invoked directly (not when imported by the test).
if (process.argv[1] && process.argv[1].endsWith('canonicalize-tw-v4.mjs')) main()

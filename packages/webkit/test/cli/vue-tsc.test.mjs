import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { applyPlan } from '../../src/cli/apply.js'
import { planDoctor } from '../../src/cli/doctor.js'
import { planInit } from '../../src/cli/plan.js'
import { rangeAdmits, VUE_TSC_KNOWN_GOOD } from '../../src/cli/toolchain.js'

function makeProject(pkg, files = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-vue-tsc-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'app', ...pkg }, null, 2))
  for (const [rel, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true })
    writeFileSync(join(dir, rel), content)
  }
  return dir
}

const installed = (name, version) => ({
  [`node_modules/${name}/package.json`]: JSON.stringify({ name, version })
})

const vueTscCheck = (dir) => planDoctor(dir).find((c) => c.check === 'vue-tsc version')

test('rangeAdmits matches the ranges package managers resolve', () => {
  assert.equal(rangeAdmits('^3.3.14', '3.3.14'), true)
  assert.equal(rangeAdmits('^3.2.5', '3.3.14'), true)
  assert.equal(rangeAdmits('~3.3.0', '3.3.14'), true)
  assert.equal(rangeAdmits('latest', '3.3.14'), true)
  assert.equal(rangeAdmits('3.3.14', '3.3.14'), true)
  assert.equal(rangeAdmits('3.3.13', '3.3.14'), false)
  assert.equal(rangeAdmits('~3.2.0', '3.3.14'), false)
  assert.equal(rangeAdmits('^3.3.15', '3.3.14'), false)
  assert.equal(rangeAdmits('^2.0.0', '3.3.14'), false)
})

test('init pins a vue-tsc range that admits the broken release', () => {
  const dir = makeProject({ devDependencies: { 'vue-tsc': '^3.3.14', typescript: '~5.9.3' } })
  try {
    const plan = planInit(dir, { wireEntry: false })
    const pin = plan.find((a) => a.type === 'add-dep' && a.dep === 'vue-tsc')
    assert.equal(pin.version, VUE_TSC_KNOWN_GOOD)
    assert.ok(plan.some((a) => a.type === 'advise' && a.message.includes('vue-tsc')))
    applyPlan(dir, plan)
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    assert.equal(pkg.devDependencies['vue-tsc'], VUE_TSC_KNOWN_GOOD)
    assert.equal(pkg.devDependencies.typescript, '~5.9.3')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('init leaves a safe vue-tsc pin alone', () => {
  const dir = makeProject({ devDependencies: { 'vue-tsc': '3.3.12' } })
  try {
    const plan = planInit(dir, { wireEntry: false })
    assert.equal(
      plan.some((a) => a.type === 'add-dep' && a.dep === 'vue-tsc'),
      false
    )
    applyPlan(dir, plan)
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    assert.equal(pkg.devDependencies['vue-tsc'], '3.3.12')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('init advises the known-good vue-tsc in a TypeScript project without it', () => {
  const dir = makeProject({}, { 'tsconfig.json': '{}' })
  try {
    const plan = planInit(dir, { wireEntry: false })
    const note = plan.find((a) => a.type === 'advise' && a.message.includes('vue-tsc@'))
    assert.ok(note.message.includes(`vue-tsc@${VUE_TSC_KNOWN_GOOD}`))
    assert.equal(
      plan.some((a) => a.type === 'add-dep' && a.dep === 'vue-tsc'),
      false
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('init says nothing about vue-tsc in a JavaScript project', () => {
  const dir = makeProject({})
  try {
    const plan = planInit(dir, { wireEntry: false })
    assert.equal(
      plan.some((a) => JSON.stringify(a).includes('vue-tsc')),
      false
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns when vue-tsc 3.3.14 is installed', () => {
  const dir = makeProject(
    { devDependencies: { 'vue-tsc': '^3.3.8' } },
    { ...installed('vue-tsc', '3.3.14'), ...installed('@vue/language-core', '3.3.14') }
  )
  try {
    const check = vueTscCheck(dir)
    assert.equal(check.status, 'warn')
    assert.match(check.detail, /3\.3\.14/)
    assert.match(check.detail, new RegExp(`vue-tsc@${VUE_TSC_KNOWN_GOOD.replaceAll('.', '\\.')}`))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor accepts an installed known-good vue-tsc', () => {
  const dir = makeProject(
    { devDependencies: { 'vue-tsc': VUE_TSC_KNOWN_GOOD } },
    {
      ...installed('vue-tsc', VUE_TSC_KNOWN_GOOD),
      ...installed('@vue/language-core', VUE_TSC_KNOWN_GOOD)
    }
  )
  try {
    assert.equal(vueTscCheck(dir).status, 'ok')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('doctor warns on an uninstalled range that resolves to the broken release', () => {
  const dir = makeProject({ devDependencies: { 'vue-tsc': '^3.3.14' } })
  try {
    assert.equal(vueTscCheck(dir).status, 'warn')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

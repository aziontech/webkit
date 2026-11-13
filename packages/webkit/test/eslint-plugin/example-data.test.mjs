import assert from 'node:assert/strict'
import test from 'node:test'

import { exampleDataApplies, scanExampleData } from '../../src/eslint-plugin/example-data.js'

const ids = (content) => scanExampleData(content)

test('domain fires on a sample host outside the reserved domains', () => {
  for (const content of [
    "const domain = 'origin.edgeflow.com'",
    'email: "jane@company.com"',
    "href: 'https://www.example.com.br'",
    "{ name: 'resource-01.example.app' }",
    "endpoint: 'https://api.provider.io/v1'"
  ]) {
    assert.ok(ids(content).includes('domain'), `expected domain for: ${content}`)
  }
})

test('domain stays silent on reserved domains, allowed hosts and code', () => {
  for (const content of [
    "email: 'm@example.com'",
    "host: 'api.example.org'",
    "href: 'https://docs.example.net/start'",
    "href: 'https://www.azion.com/en/documentation/'",
    "host: 'k7q2.map.azionedge.net'",
    "repo: 'https://github.com/aziontech/webkit'",
    'toast.info(message)',
    "import config from './tsconfig.app.json'",
    'run ./deploy.sh first'
  ]) {
    assert.ok(!ids(content).includes('domain'), `expected domain silent for: ${content}`)
  }
})

test('regional-format fires on Brazilian formats', () => {
  for (const content of [
    "postalCode: '01310-100'",
    'placeholder="00000-000"',
    "taxId: '00.000.000/0001-00'",
    "cpf: '115.023.039-10'",
    "phone: '+55 11 99999-0000'",
    'label="CNPJ"',
    "price: 'R$ 49'",
    "line1: 'Avenida Paulista, 1000'"
  ]) {
    assert.ok(ids(content).includes('regional-format'), `expected regional-format for: ${content}`)
  }
})

test('regional-format stays silent on the house format', () => {
  for (const content of [
    "postalCode: '94105'",
    "phone: '+1 555-0100'",
    "line1: '100 Market Street'",
    "price: '$49'",
    "label: 'Tax ID'"
  ]) {
    assert.ok(!ids(content).includes('regional-format'), `expected silent for: ${content}`)
  }
})

test('invented-brand fires on invented companies, not on Acme', () => {
  assert.ok(ids("name: 'edgeflow-production'").includes('invented-brand'))
  assert.ok(ids("org: 'Contoso'").includes('invented-brand'))
  assert.ok(!ids("org: 'Acme Inc.'").includes('invented-brand'))
})

test('exampleDataApplies skips tests, translated catalogs and the country list', () => {
  assert.ok(exampleDataApplies('packages/webkit/examples/hero-form/default.vue'))
  assert.ok(exampleDataApplies('packages/webkit/blocks/platform/account/profile/profile.vue'))
  assert.ok(exampleDataApplies('skills/webkit-forms/SKILL.md'))
  assert.ok(!exampleDataApplies('packages/webkit/src/components/inputs/chip/chip.test.ts'))
  assert.ok(!exampleDataApplies('packages/webkit/src/i18n/messages/pt-BR.ts'))
  assert.ok(!exampleDataApplies('packages/webkit/src/locales/pt-BR.ts'))
  assert.ok(!exampleDataApplies('rules/webkit-example-data.md'))
  assert.ok(!exampleDataApplies('packages/webkit/src/components/inputs/phone-input/countries.ts'))
})

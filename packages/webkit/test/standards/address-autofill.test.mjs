import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BLOCKS = join(dirname(fileURLToPath(import.meta.url)), '../../blocks/platform/account')

const TOKENS = {
  'Postal code': 'postal-code',
  Address: 'address-line1',
  'Address line 2': 'address-line2',
  'Cardholder name': 'cc-name'
}

const FORMS = [
  'change-plan-drawer/change-plan-drawer.vue',
  'change-plan-drawer/variants/checkout.vue',
  'onboarding-form/variants/plan.vue'
]

const fieldTokens = (source) => {
  const found = {}
  for (const field of source.matchAll(/<Field\b[^.>]*>([\s\S]*?)<\/Field>/g)) {
    const label = field[1].match(/<Field\.Label[^>]*>([^<]*)<\/Field\.Label>/)?.[1].trim()
    const input = field[1].match(/<Input\b[^>]*>/)?.[0]
    if (label && input) found[label] = input.match(/autocomplete="([^"]*)"/)?.[1]
  }
  return found
}

for (const form of FORMS) {
  test(`${form} names every address and cardholder field for autofill`, () => {
    const found = fieldTokens(readFileSync(join(BLOCKS, form), 'utf8'))
    for (const [label, token] of Object.entries(TOKENS)) {
      assert.equal(found[label], token, `${label} in ${form}`)
    }
  })
}

test('profile address rows and company name carry autofill tokens', () => {
  const source = readFileSync(join(BLOCKS, 'profile/profile.vue'), 'utf8')
  for (const token of ['postal-code', 'address-line1', 'address-line2', 'organization']) {
    assert.match(source, new RegExp(`autocomplete="${token}"`))
  }
})

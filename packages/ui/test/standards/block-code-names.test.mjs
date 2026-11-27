import assert from 'node:assert/strict'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { checkBlockCodeNames, sfcUserText } from '../../scripts/lib/block-code-names.mjs'
import { readBlocks } from '../../scripts/lib/blocks.mjs'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const block = (name, extra = {}) => ({
  name,
  source: `blocks/x/${name}.vue`,
  sfc: '<template><div /></template>',
  summary: '',
  intents: [],
  variants: [],
  ...extra
})

test('a block code name in a title, a label, an error string, JSDoc, a summary or guidelines prose fails', () => {
  const sfc = `<script setup lang="ts">
  interface Props {
    /** AccountBilling cycle. */
    cycle?: string
  }
  const error = 'AccountBilling must be valid.'
</script>
<template>
  <PageHeader title="AccountBilling" :description="ready ? 'Open AccountBilling' : ''" />
  <p>Back to AccountBilling</p>
</template>`
  const errors = checkBlockCodeNames({
    'account/account-billing': block('AccountBilling', {
      sfc,
      summary: 'The AccountBilling page.',
      intents: ['open AccountBilling'],
      guidelines: '# AccountBilling\n\nTitle `AccountBilling` and one sentence.\n'
    })
  })
  assert.equal(errors.length, 4)
  assert.ok(errors.every((e) => e.includes('"AccountBilling"')))
  assert.equal(sfcUserText(sfc, ['AccountBilling']).match(/AccountBilling/g).length, 5)
})

test('imports, tags, identifiers, the guidelines heading and the block own variant names pass', () => {
  const variant = `<script setup lang="ts">
  import AccountBilling from '../account-billing.vue'
  const component = AccountBilling
</script>
<template>
  <AccountBilling :is="AccountBilling" loading />
  </AccountBilling>
</template>`
  const errors = checkBlockCodeNames({
    'account/account-billing': block('AccountBilling', {
      variants: [
        {
          name: 'Loading',
          summary: 'The page while it loads.',
          file: 'blocks/account/account-billing/variants/loading.vue',
          sfc: variant
        }
      ],
      guidelines:
        '# AccountBilling\n\nThe billing page.\n\n```vue\n<AccountBilling loading />\n```\n'
    }),
    'top-bar/top-bar-creation': block('TopBarCreation', {
      variants: [
        {
          name: 'CreateHub',
          summary: 'The CreateHub header.',
          file: 'blocks/top-bar/top-bar-creation/variants/create-hub.vue',
          sfc: '<template><div /></template>'
        }
      ],
      guidelines: '# TopBarCreation\n\n- CreateHub: the back link returns Home.\n'
    }),
    'create/create-hub': block('CreateHub', {
      sfc: '<template><p>AccountBillingProps is a type, not the name</p></template>'
    })
  })
  assert.deepEqual(errors, [])
})

test('no block shows a block code name to the person reading it', () => {
  assert.deepEqual(checkBlockCodeNames(readBlocks(PKG_ROOT)), [])
})

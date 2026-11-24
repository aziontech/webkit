import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

const rule = (await import('../../src/eslint-plugin/rules/prefer-hint.js')).default

const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})

const sfc = (body, filename = 'a.vue') => ({ code: `<template>${body}</template>`, filename })
const bad = (body, messageId, count = 1) => ({
  ...sfc(body),
  errors: Array.from({ length: count }, () => ({ messageId }))
})

const LONG_TOOLTIP =
  'Sum of requests grouped by identifying traffic as Legitimate, Bad Bot, Good Bot and Under Evaluation.'
const LONG_HINT =
  'This note explains the setting in more words than a short note can hold. '.repeat(4)

test('prefer-hint', () => {
  vue.run('prefer-hint', rule, {
    valid: [
      sfc('<Tooltip content="Copy"><IconButton icon="az az-copy" aria-label="Copy" /></Tooltip>'),
      sfc(
        '<Tooltip content="Delete domain"><IconButton icon="az az-trash" aria-label="Delete domain" /></Tooltip>'
      ),
      sfc(`<Tooltip :content="t('long.key')"><Button label="Save" /></Tooltip>`),
      sfc('<Tooltip :content="label"><Button label="Save" /></Tooltip>'),
      sfc('<label>Name <Hint content="The name other people see." /></label>'),
      sfc('<Hint content="Short note." side="end" />'),
      sfc('<Hint :content="note" />'),
      sfc(
        '<template #actions><IconButton icon="az az-circle-help" aria-label="Help" @click="toggleTools" /></template>'
      ),
      sfc(
        '<Tooltip content="Help"><IconButton icon="az az-circle-help" aria-label="Help" @click="toggleTools" /></Tooltip>'
      ),
      sfc(
        '<Alert severity="info"><i class="az az-circle-info" aria-hidden="true" /> Saved</Alert>'
      ),
      sfc('<p>Press <Kbd>?</Kbd> to see the shortcuts.</p>'),
      sfc('<code>?</code>'),
      sfc('<span>Why?</span>'),
      sfc('<Button label="What is this?" />'),
      sfc(
        '<Tooltip content="Info"><button><i class="az az-circle-info" /></button></Tooltip>',
        'src/components/input/hint/hint.vue'
      )
    ],
    invalid: [
      bad(
        `<Tooltip content="${LONG_TOOLTIP}"><span tabindex="0">Top bots</span></Tooltip>`,
        'longTooltip'
      ),
      bad(
        `<Tooltip :content="'${LONG_TOOLTIP}'"><span tabindex="0">Top bots</span></Tooltip>`,
        'longTooltip'
      ),
      bad('<Tooltip content="Help"><button type="button">?</button></Tooltip>', 'handMadeHelp'),
      bad('<span class="size-10 rounded bg-(--bg-muted)">?</span>', 'handMadeHelp'),
      bad('<Button label="?" variant="ghost" />', 'handMadeHelp'),
      bad('<Tag label="?" />', 'handMadeHelp'),
      bad(
        '<Tooltip content="Estimated charges."><i class="az az-circle-help" tabindex="0" /></Tooltip>',
        'handMadeHelp'
      ),
      bad(
        '<Tooltip content="More information"><IconButton icon="az az-circle-info" aria-label="More information" /></Tooltip>',
        'handMadeHelp'
      ),
      bad(
        '<Popover><Popover.Trigger><IconButton icon="az az-circle-question" aria-label="About" /></Popover.Trigger></Popover>',
        'handMadeHelp'
      ),
      bad(
        '<Popover><PopoverTrigger><IconButton icon="az az-info" aria-label="About" /></PopoverTrigger></Popover>',
        'handMadeHelp'
      ),
      bad(
        '<HoverCard><HoverCard.Trigger><span><i class="az az-circle-info" /></span></HoverCard.Trigger></HoverCard>',
        'handMadeHelp'
      ),
      bad(`<Hint content="${LONG_HINT}" />`, 'longHint')
    ]
  })
})

test('prefer-hint reports a long tooltip on an info icon once for each problem', () => {
  vue.run('prefer-hint', rule, {
    valid: [],
    invalid: [
      {
        ...sfc(
          `<Tooltip content="${LONG_TOOLTIP}"><IconButton icon="az az-circle-info" aria-label="About" /></Tooltip>`
        ),
        errors: [{ messageId: 'longTooltip' }, { messageId: 'handMadeHelp' }]
      }
    ]
  })
})

test('prefer-hint messages are plain English', () => {
  const { messages } = rule.meta
  if (!/^A tooltip names a control in a few words\./.test(messages.longTooltip))
    throw new Error('longTooltip message changed')
  if (messages.handMadeHelp !== 'Use Hint for help beside a label.')
    throw new Error('handMadeHelp message changed')
  if (messages.longHint !== 'Longer help goes in a HelpPanel.')
    throw new Error('longHint message changed')
})

<script setup lang="ts">
  import Kbd from '@aziontech/ui/kbd'
  import Table from '@aziontech/ui/table'
  import { computed } from 'vue'

  import { messages } from '../lib/i18n'

  const t = messages

  type Shortcut = { id: string; action: string; apple: string[]; other: string[] }

  const shortcuts = computed<Shortcut[]>(() => [
    { id: 'close', action: t.value.keyClose, apple: ['Esc'], other: ['Esc'] },
    { id: 'submit', action: t.value.keySubmit, apple: ['Enter'], other: ['Enter'] },
    {
      id: 'submit-multiline',
      action: t.value.keySubmitMultiline,
      apple: ['⌘', 'Enter'],
      other: ['Ctrl', 'Enter']
    },
    { id: 'save', action: t.value.keySave, apple: ['⌘', 'S'], other: ['Ctrl', 'S'] },
    { id: 'palette', action: t.value.keyPalette, apple: ['⌘', 'K'], other: ['Ctrl', 'K'] },
    { id: 'search', action: t.value.keySearch, apple: ['/'], other: ['/'] },
    { id: 'help', action: t.value.keyHelp, apple: ['?'], other: ['?'] },
    { id: 'move', action: t.value.keyMove, apple: ['↑', '↓'], other: ['↑', '↓'] },
    { id: 'open', action: t.value.keyOpen, apple: ['Enter'], other: ['Enter'] },
    { id: 'select', action: t.value.keySelect, apple: ['Space'], other: ['Space'] },
    { id: 'delete', action: t.value.keyDelete, apple: ['Delete'], other: ['Delete'] }
  ])
</script>

<template>
  <section class="flex max-w-4xl flex-col gap-(--spacing-sm)">
    <h2 class="text-heading-sm text-(--text-default)">{{ t.keyTableTitle }}</h2>
    <p class="text-body-sm text-(--text-muted)">{{ t.keyTableNote }}</p>
    <Table
      bordered
      wrap-lines
      :aria-label="t.keyTableTitle"
    >
      <Table.Header>
        <Table.Row>
          <Table.HeadCell
            principal
            :grow="2"
            >{{ t.keyAction }}</Table.HeadCell
          >
          <Table.HeadCell>{{ t.keyApple }}</Table.HeadCell>
          <Table.HeadCell>{{ t.keyOther }}</Table.HeadCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row
          v-for="shortcut in shortcuts"
          :key="shortcut.id"
        >
          <Table.Cell
            principal
            :grow="2"
            >{{ shortcut.action }}</Table.Cell
          >
          <Table.Cell>
            <span class="inline-flex items-center gap-(--spacing-2xs)">
              <Kbd
                v-for="key in shortcut.apple"
                :key="key"
                size="small"
                >{{ key }}</Kbd
              >
            </span>
          </Table.Cell>
          <Table.Cell>
            <span class="inline-flex items-center gap-(--spacing-2xs)">
              <Kbd
                v-for="key in shortcut.other"
                :key="key"
                size="small"
                >{{ key }}</Kbd
              >
            </span>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </section>
</template>

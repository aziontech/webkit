<script setup lang="ts">
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'

  export interface SpendCardProps {
    /** Columns of the 12-column grid the card spans. */
    span: number
    /** The card title; its lower case names the card in the error alert. */
    title: string
    /** One sentence on what the card shows. */
    hint: string
    /** The chart forms of the header toggle; empty hides it. */
    forms?: ToggleGroupOption[]
    /** Export CSV can run. */
    exportable: boolean
    /** Why the period could not load; shows a danger alert with Retry. */
    error: string
  }

  withDefaults(defineProps<SpendCardProps>(), { forms: () => [] })

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  const form = defineModel<string>('form', { default: '' })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <ChartCard :span="span">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
      <ChartCard.Action>
        <ToggleGroup
          v-if="forms.length"
          v-model="form"
          :options="forms"
          size="small"
          :aria-label="`Chart form for ${title}`"
        />
        <DropdownMenu
          side="bottom"
          align="end"
          @select="(event, value) => emit('select', event, value)"
        >
          <DropdownMenu.Trigger>
            <IconButton
              icon="az az-ellipsis"
              variant="ghost"
              size="small"
              :aria-label="`More options for ${title}`"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="export"
              label="Export CSV"
              :disabled="!exportable"
            />
          </DropdownMenu.Group>
        </DropdownMenu>
      </ChartCard.Action>
    </ChartCard.Header>
    <ChartCard.Content>
      <p
        v-if="error"
        class="text-body-sm text-(--text-muted)"
      >
        Not available.
      </p>
      <slot v-else />
    </ChartCard.Content>
  </ChartCard>
</template>

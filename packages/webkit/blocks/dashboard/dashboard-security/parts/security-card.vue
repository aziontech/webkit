<script setup lang="ts">
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** The change tag beside the Sum tag. */
  export interface SecurityCardChange {
    /** The change, written with its sign. */
    label: string
    /** Danger for a rise, success for a fall. */
    severity: TagSeverity
    /** The arrow glyph. */
    icon: string
  }

  export interface SecurityCardProps {
    /** Columns of the 12-column grid the card spans. */
    span: number
    /** The card title. */
    title: string
    /** One sentence on what the card counts. */
    hint: string
    /** What did not load, written after Couldn't load in the alert. */
    subject: string
    /** The change tag; null hides it. */
    change: SecurityCardChange | null
    /** The chart forms of the toggle; empty hides it. */
    forms?: ToggleGroupOption[]
    /** Marks the header actions as the ones of a full-width card. */
    wide?: boolean
    /** The period is loading or failed; Expand and the menu are disabled. */
    blocked: boolean
    /** Why the period could not load; shows a danger alert with Retry. */
    error: string
  }

  withDefaults(defineProps<SecurityCardProps>(), { forms: () => [], wide: false })

  const emit = defineEmits<{
    expand: [event: MouseEvent]
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  const form = defineModel<string>('form', { default: '' })

  defineSlots<{ default(): unknown }>()

  const menuOptions = [
    { value: 'query', label: 'Copy query' },
    { value: 'export', label: 'Export CSV' }
  ]
</script>

<template>
  <ChartCard :span="span">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
      <ChartCard.Action>
        <span
          :data-wide="wide ? '' : undefined"
          class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
        >
          <Tag
            label="Sum"
            severity="neutral"
            size="small"
            icon="az az-calculator"
          />
          <Tag
            v-if="change"
            :label="change.label"
            :severity="change.severity"
            :icon="change.icon"
            size="small"
          />
          <ToggleGroup
            v-if="forms.length"
            v-model="form"
            :options="forms"
            size="small"
            :aria-label="`Chart form for ${title}`"
          />
        </span>
        <Tooltip content="Expand">
          <IconButton
            icon="az az-app-window"
            variant="ghost"
            size="small"
            :aria-label="`Expand ${title}`"
            :disabled="blocked"
            @click="(event: MouseEvent) => emit('expand', event)"
          />
        </Tooltip>
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
              :disabled="blocked"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              v-for="option in menuOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
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

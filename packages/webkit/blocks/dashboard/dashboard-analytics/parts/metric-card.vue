<script setup lang="ts">
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** The change tag in a card header. */
  export interface MetricCardVariation {
    /** The change, written with its sign. */
    label: string
    /** Success for a rise, danger for a fall. */
    severity: TagSeverity
    /** The arrow glyph. */
    icon: string
  }

  /** From which width the header tags and the form toggle show. */
  export type MetricCardFit = 'wide' | 'xl' | 'sm'

  export interface MetricCardProps {
    /** Columns of the 12-column grid the card spans. */
    span: number
    /** The card title. */
    title: string
    /** One sentence that defines the metric. */
    hint: string
    /** The aggregation, written as muted text beside the title. */
    aggregation?: string
    /** The change tag; null hides it. */
    variation?: MetricCardVariation | null
    /** The chart forms of the toggle; empty hides it. */
    forms?: ToggleGroupOption[]
    /** Marks the header actions as the ones of a full-width card. */
    wide?: boolean
    /** From which width the header tags and the toggle show. */
    fit?: MetricCardFit
    /** Shows the Expand button. */
    expandable?: boolean
    /** Disables the Expand button. */
    blank?: boolean
    /** Disables Export CSV. */
    exportDisabled?: boolean
    /** Why the card could not load; shows a danger alert with Retry. */
    error?: string
    /** Text of the footer link; empty hides the footer. */
    footerLabel?: string
    /** Target of the footer link. */
    footerHref?: string
  }

  withDefaults(defineProps<MetricCardProps>(), {
    aggregation: 'Sum',
    variation: null,
    forms: () => [],
    wide: false,
    fit: 'wide',
    expandable: true,
    blank: false,
    exportDisabled: false,
    error: '',
    footerLabel: '',
    footerHref: ''
  })

  const emit = defineEmits<{
    expand: [event: MouseEvent]
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  const form = defineModel<string>('form', { default: '' })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <ChartCard :span="span">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 flex-1 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
      <ChartCard.Action>
        <span
          :data-wide="wide ? '' : undefined"
          class="hidden items-center gap-(--spacing-xs) sm:flex"
          :class="{ 'lg:hidden xl:flex': fit !== 'sm', 'data-wide:lg:flex': fit === 'wide' }"
        >
          <span
            class="text-label-sm text-(--text-muted)"
            data-testid="metric-card__aggregation"
            >{{ aggregation }}</span
          >
          <Tag
            v-if="variation"
            :label="variation.label"
            :severity="variation.severity"
            :icon="variation.icon"
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
        <Tooltip
          v-if="expandable"
          content="Expand"
        >
          <IconButton
            icon="az az-app-window"
            variant="ghost"
            size="small"
            :aria-label="`Expand ${title}`"
            :disabled="blank"
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
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="query"
              label="Copy query"
            />
            <DropdownMenu.Item
              value="export"
              label="Export CSV"
              :disabled="exportDisabled"
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
    <ChartCard.Footer v-if="footerLabel">
      <Link
        :label="footerLabel"
        :href="footerHref"
        size="medium"
      />
    </ChartCard.Footer>
  </ChartCard>
</template>

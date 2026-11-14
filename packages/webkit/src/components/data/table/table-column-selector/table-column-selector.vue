<script setup lang="ts">
  import type { Column } from '@tanstack/vue-table'
  import { computed, defineAsyncComponent, h, inject, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Popover from '../../../overlay/popover/popover.vue'
  import PopoverContent from '../../../overlay/popover/popover-content/popover-content.vue'
  import PopoverHeader from '../../../overlay/popover/popover-header/popover-header.vue'
  import PopoverTitle from '../../../overlay/popover/popover-title/popover-title.vue'
  import PopoverTrigger from '../../../overlay/popover/popover-trigger/popover-trigger.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import { TableInjectionKey, type TableRowRecord } from '../injection-key'

  defineOptions({
    name: 'TableColumnSelector',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Popover heading. Empty uses the locale catalog (`Columns`). */
      title?: string
    }>(),
    {
      title: ''
    }
  )

  defineSlots<{
    /** Replace the default trigger button; it toggles the panel on click by itself. `expanded` is the panel state; `open` opens it from elsewhere. */
    trigger(props: { open: () => void; expanded: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tableColumnSelector: en.tableColumnSelector })
  const heading = computed(() => props.title || t('tableColumnSelector.title'))
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__column-selector` : 'data-table__column-selector')
  )

  const loadSwitch = () => import('../../../inputs/switch/switch.vue')
  const loadButton = () => import('../../../actions/button/button.vue')
  const Switch = defineAsyncComponent({
    loader: loadSwitch,
    loadingComponent: () =>
      h('span', { 'aria-hidden': 'true', class: 'inline-block h-5 w-9 shrink-0' }),
    delay: 0
  })
  const Button = defineAsyncComponent({
    loader: loadButton,
    loadingComponent: () => h('span', { 'aria-hidden': 'true', class: 'block h-7 w-full' }),
    delay: 0
  })
  const preload = (): void => {
    void loadSwitch()
    void loadButton()
  }

  const open = ref<boolean>(false)
  const openPanel = (): void => {
    queueMicrotask(() => {
      open.value = true
    })
  }

  const columns = computed<Column<TableRowRecord, unknown>[]>(() => {
    const table = ctx?.table.value
    if (!table) return []
    return table.getAllLeafColumns().filter((column) => {
      const meta = column.columnDef.meta as { kind?: string } | undefined
      return column.getCanHide() || meta?.kind !== 'action'
    })
  })

  const hiddenCount = computed<number>(
    () => columns.value.filter((column) => column.getCanHide() && !column.getIsVisible()).length
  )

  const showAll = (): void => {
    for (const column of columns.value) if (column.getCanHide()) column.toggleVisibility(true)
  }

  const labelOf = (column: Column<TableRowRecord, unknown>): string => {
    const meta = column.columnDef.meta as { label?: string } | undefined
    const header = column.columnDef.header
    return meta?.label || (typeof header === 'string' && header ? header : column.id)
  }
</script>

<template>
  <Popover
    v-model:open="open"
    placement="bottom-end"
    :data-testid="`${testId}__popover`"
  >
    <PopoverTrigger
      @pointerenter.once="preload"
      @focusin.once="preload"
    >
      <slot
        name="trigger"
        :open="openPanel"
        :expanded="open"
      >
        <Tooltip
          :text="heading"
          :disabled="open"
        >
          <IconButton
            :data-testid="testId"
            icon="ai ai-column"
            :ariaLabel="heading"
            kind="outlined"
            size="medium"
          />
        </Tooltip>
      </slot>
    </PopoverTrigger>

    <PopoverContent>
      <div
        :data-testid="`${testId}__panel`"
        class="flex max-w-(--container-2xs) flex-col"
      >
        <PopoverHeader>
          <PopoverTitle>{{ heading }}</PopoverTitle>
        </PopoverHeader>
        <div
          class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)"
        >
          <label
            v-for="column in columns"
            :key="column.id"
            :data-testid="`${testId}__column-${column.id}`"
            :data-locked="!column.getCanHide() || null"
            class="flex min-h-8 pointer-coarse:min-h-11 cursor-pointer items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none data-[locked]:cursor-default data-[locked]:text-(--text-muted) data-[locked]:hover:bg-transparent"
          >
            <Switch
              :data-testid="`${testId}__switch-${column.id}`"
              :model-value="column.getIsVisible()"
              :disabled="!column.getCanHide()"
              @update:model-value="(value) => column.toggleVisibility(!!value)"
            />
            <span class="min-w-0 truncate">{{ labelOf(column) }}</span>
            <span
              v-if="!column.getCanHide()"
              class="ms-auto shrink-0 text-label-sm text-(--text-muted)"
            >
              {{ t('tableColumnSelector.alwaysShown') }}
            </span>
          </label>
          <p
            v-if="columns.length === 0"
            class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
          >
            {{ t('tableColumnSelector.empty') }}
          </p>
        </div>
        <div
          v-if="hiddenCount > 0"
          class="border-t border-solid border-(length:--border-width-default) border-(--border-default) p-(--spacing-xxs)"
        >
          <Button
            :data-testid="`${testId}__show-all`"
            :label="t('tableColumnSelector.showAll')"
            kind="transparent"
            size="small"
            class="w-full"
            @click="showAll"
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

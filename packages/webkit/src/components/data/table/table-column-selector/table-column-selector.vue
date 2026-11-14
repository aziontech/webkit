<script setup lang="ts">
  import type { Column } from '@tanstack/vue-table'
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { usePortalLocale, useTranslate } from '../../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../../composables/use-placement'
  import * as en from '../../../../i18n/messages/en'
  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Switch from '../../../inputs/switch/switch.vue'
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
    /** Replace the default trigger button. */
    trigger(props: { open: () => void }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tableColumnSelector: en.tableColumnSelector })
  const portalLocale = usePortalLocale()
  const heading = computed(() => props.title || t('tableColumnSelector.title'))
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__column-selector` : 'data-table__column-selector')
  )

  const open = ref<boolean>(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const { panelStyle } = usePlacement({
    triggerRef,
    panelRef,
    isOpen: open,
    placement: 'bottom-end',
    offset: 4
  })
  const toggle = (): void => {
    open.value = !open.value
  }
  const close = (): void => {
    open.value = false
  }
  const onPointerDown = (event: MouseEvent): void => {
    if (!open.value) return
    const target = event.target as Node | null
    if (!target) return
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    close()
  }
  const onKeydown = (event: globalThis.KeyboardEvent): void => {
    if (open.value && event.key === 'Escape') close()
  }
  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onPointerDown)
    globalThis.document?.addEventListener('keydown', onKeydown)
  })
  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onPointerDown)
    globalThis.document?.removeEventListener('keydown', onKeydown)
  })

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
  <div class="relative inline-flex">
    <span
      ref="triggerRef"
      class="inline-flex"
    >
      <slot
        name="trigger"
        :open="() => (open = true)"
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
            :aria-expanded="open"
            @click="toggle"
          />
        </Tooltip>
      </slot>
    </span>

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="open"
          ref="panelRef"
          role="dialog"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          :aria-label="heading"
          :data-testid="`${testId}__panel`"
          :style="panelStyle"
          class="flex min-w-(--container-3xs) max-w-(--container-2xs) flex-col overflow-hidden rounded-(--shape-card) border border-solid border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
        >
          <p
            class="border-b border-solid border-(length:--border-width-default) border-(--border-default) px-(--spacing-md) py-(--spacing-xs) text-label-md text-(--text-default)"
          >
            {{ heading }}
          </p>
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
      </Transition>
    </Teleport>
  </div>
</template>

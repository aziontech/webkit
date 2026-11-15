<script setup lang="ts">
  import { computed, inject, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import type {
    CollectionColumnPreference,
    CollectionDensity,
    CollectionPreferencesValue
  } from '../../../composables/use-collection/lib/preferences'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import RadioGroup from '../../input/radio-group/radio-group.vue'
  import RadioGroupItem from '../../input/radio-group/radio-group-item/radio-group-item.vue'
  import Switch from '../../input/switch/switch.vue'
  import Dialog from '../../overlay/dialog/dialog.vue'
  import DialogContent from '../../overlay/dialog/dialog-content.vue'
  import DialogTitle from '../../overlay/dialog/dialog-title.vue'
  import Drawer from '../../overlay/drawer/drawer.vue'
  import DrawerContent from '../../overlay/drawer/drawer-content.vue'
  import DrawerTitle from '../../overlay/drawer/drawer-title.vue'
  import PanelBody from '../../overlay/panel/panel-body.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'
  import { TableInjectionKey } from '../table/injection-key'

  export type {
    CollectionColumnPreference,
    CollectionDensity,
    CollectionPreferencesValue
  } from '../../../composables/use-collection/lib/preferences'

  /** A section of the preferences panel. */
  export type CollectionPreferencesSection =
    'page-size' | 'columns' | 'wrap-lines' | 'striped' | 'density'

  /** A column the panel lists. A locked column always shows. */
  export interface CollectionPreferencesColumn {
    id: string
    label: string
    locked?: boolean
  }

  defineOptions({
    name: 'CollectionPreferences',
    inheritAttrs: false
  })

  /** Overlay the panel opens in. */
  export type CollectionPreferencesContainer = 'dialog' | 'drawer'

  export interface CollectionPreferencesProps {
    /** Columns to show, hide and order. Empty reads the enclosing DataTable's columns, or hides the columns section outside one. */
    columns?: CollectionPreferencesColumn[]
    /** Page sizes offered. Empty hides the page size section. */
    pageSizeOptions?: number[]
    /** Sections the panel shows, in this order. */
    sections?: CollectionPreferencesSection[]
    /** Opens in a centered dialog or a side drawer. */
    container?: CollectionPreferencesContainer
    /** Panel title and trigger label. Empty uses the locale catalog. */
    title?: string
    /** Disables the trigger. */
    disabled?: boolean
    /** Initial open state when uncontrolled (v-model:open unbound). */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<CollectionPreferencesProps>(), {
    columns: () => [],
    pageSizeOptions: () => [],
    sections: () => ['page-size', 'columns', 'wrap-lines', 'striped', 'density'],
    container: 'dialog',
    title: '',
    disabled: false,
    defaultOpen: false
  })

  /** Whether the panel is open. Supports v-model:open; omit for uncontrolled, seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })
  const open = computed<boolean>({
    get: () => openModel.value ?? props.defaultOpen,
    set: (next) => {
      if (next !== open.value) openModel.value = next
    }
  })
  /** The saved preferences. Supports v-model:preferences; changes apply on Confirm. */
  const preferences = defineModel<CollectionPreferencesValue>('preferences', {
    default: () => ({})
  })

  const emit = defineEmits<{
    confirm: [event: MouseEvent, value: CollectionPreferencesValue]
    cancel: [event: MouseEvent]
  }>()

  defineSlots<{
    /** Replaces the default trigger button; receives an open function. */
    trigger(props: { open: () => void }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ collectionPreferences: en.collectionPreferences })
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'collection-preferences'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )
  const heading = computed<string>(() => props.title || t('collectionPreferences.title'))

  const ctx = inject(TableInjectionKey, null)
  const table = computed(() => (props.columns.length ? null : (ctx?.table.value ?? null)))
  type ColumnMeta = { type?: string; label?: string }
  const columns = computed<CollectionPreferencesColumn[]>(() => {
    if (!table.value) return props.columns
    return table.value
      .getAllLeafColumns()
      .filter((column) => (column.columnDef.meta as ColumnMeta | undefined)?.type !== 'action')
      .map((column) => {
        const header = column.columnDef.header
        return {
          id: column.id,
          label:
            (column.columnDef.meta as ColumnMeta | undefined)?.label ??
            (typeof header === 'string' ? header : column.id),
          locked: !column.getCanHide()
        }
      })
  })
  const fromTable = (): CollectionColumnPreference[] | null => {
    if (!table.value) return null
    const ids = new Set(columns.value.map((c) => c.id))
    return table.value
      .getAllLeafColumns()
      .filter((column) => ids.has(column.id))
      .sort(
        (a, b) =>
          (table.value?.getState().columnOrder.indexOf(a.id) ?? -1) -
          (table.value?.getState().columnOrder.indexOf(b.id) ?? -1)
      )
      .map((column) => ({ id: column.id, visible: column.getIsVisible() }))
  }

  const shown = (section: CollectionPreferencesSection): boolean => {
    if (!props.sections.includes(section)) return false
    if (section === 'page-size') return props.pageSizeOptions.length > 0
    if (section === 'columns') return columns.value.length > 0
    return true
  }
  const ordered = computed<CollectionPreferencesSection[]>(() => props.sections.filter(shown))

  const draftColumns = ref<CollectionColumnPreference[]>([])
  const draftPageSize = ref<number>(0)
  const draftWrap = ref<boolean>(false)
  const draftStriped = ref<boolean>(false)
  const draftDensity = ref<CollectionDensity>('comfortable')

  const seedColumns = (): CollectionColumnPreference[] => {
    const linked = fromTable()
    if (linked) return linked
    const saved = preferences.value.columns ?? []
    const known = new Set(columns.value.map((c) => c.id))
    const kept = saved.filter((c) => known.has(c.id))
    const seen = new Set(kept.map((c) => c.id))
    return [
      ...kept,
      ...columns.value.filter((c) => !seen.has(c.id)).map((c) => ({ id: c.id, visible: true }))
    ]
  }

  const reset = (): void => {
    draftColumns.value = seedColumns()
    draftPageSize.value = preferences.value.pageSize ?? props.pageSizeOptions[0] ?? 0
    draftWrap.value = preferences.value.wrapLines ?? false
    draftStriped.value = preferences.value.striped ?? false
    draftDensity.value = preferences.value.density ?? 'comfortable'
  }

  const triggerHostEl = ref<HTMLElement | null>(null)
  const openPanel = (): void => {
    if (props.disabled) return
    open.value = true
  }

  watch(
    open,
    async (now, before) => {
      if (now) {
        reset()
        return
      }
      if (!before) return
      await nextTick()
      triggerHostEl.value?.querySelector<HTMLElement>('button, [tabindex]')?.focus()
    },
    { immediate: true }
  )

  const columnLabel = (id: string): string => columns.value.find((c) => c.id === id)?.label ?? id
  const locked = (id: string): boolean => columns.value.find((c) => c.id === id)?.locked === true

  const setVisible = (id: string, visible: boolean): void => {
    draftColumns.value = draftColumns.value.map((c) => (c.id === id ? { ...c, visible } : c))
  }

  const move = (index: number, step: -1 | 1): void => {
    const target = index + step
    if (target < 0 || target >= draftColumns.value.length) return
    const next = [...draftColumns.value]
    const [item] = next.splice(index, 1)
    if (!item) return
    next.splice(target, 0, item)
    draftColumns.value = next
    void nextTick(() => {
      const row = document.getElementById(`${uid}-column-${item.id}`)
      const button = row?.querySelector<HTMLButtonElement>(
        step < 0 ? '[data-move="up"]:not(:disabled)' : '[data-move="down"]:not(:disabled)'
      )
      ;(button ?? row?.querySelector<HTMLButtonElement>('[data-move]:not(:disabled)'))?.focus()
    })
  }

  const densityOptions = computed(() => [
    { label: t('collectionPreferences.comfortable'), value: 'comfortable' },
    { label: t('collectionPreferences.compact'), value: 'compact' }
  ])
  const setDensity = (value: string | undefined): void => {
    if (value === 'comfortable' || value === 'compact') draftDensity.value = value
  }

  const confirm = (event: MouseEvent): void => {
    const value: CollectionPreferencesValue = {}
    if (shown('page-size')) value.pageSize = draftPageSize.value
    if (shown('columns')) value.columns = draftColumns.value.map((c) => ({ ...c }))
    if (shown('wrap-lines')) value.wrapLines = draftWrap.value
    if (shown('striped')) value.striped = draftStriped.value
    if (shown('density')) value.density = draftDensity.value
    preferences.value = value
    if (table.value && value.columns) {
      table.value.setColumnVisibility(
        Object.fromEntries(value.columns.map((c) => [c.id, c.visible]))
      )
      table.value.setColumnOrder(value.columns.map((c) => c.id))
    }
    emit('confirm', event, value)
    open.value = false
  }

  const cancel = (event: MouseEvent): void => {
    emit('cancel', event)
    open.value = false
  }

  const Root = computed(() => (props.container === 'drawer' ? Drawer : Dialog))
  const Content = computed(() => (props.container === 'drawer' ? DrawerContent : DialogContent))
  const Title = computed(() => (props.container === 'drawer' ? DrawerTitle : DialogTitle))
</script>

<template>
  <span
    ref="triggerHostEl"
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-state="open ? 'open' : 'closed'"
    class="inline-flex shrink-0"
  >
    <slot
      name="trigger"
      :open="openPanel"
    >
      <IconButton
        icon="ai ai-settings"
        variant="outline"
        size="medium"
        :ariaLabel="heading"
        :disabled="disabled"
        :data-testid="`${testId}__trigger`"
        aria-haspopup="dialog"
        :aria-expanded="open"
        @click="openPanel"
      />
    </slot>
    <component
      :is="Root"
      v-model:open="open"
      :data-testid="`${testId}__panel`"
      size="medium"
    >
      <component :is="Content">
        <PanelHeader class="w-full">
          <component :is="Title">{{ heading }}</component>
        </PanelHeader>
        <PanelBody>
          <div
            :data-testid="`${testId}__sections`"
            class="@container/preferences flex flex-col gap-(--spacing-lg)"
          >
            <template
              v-for="section in ordered"
              :key="section"
            >
              <div
                v-if="section === 'page-size'"
                :data-testid="`${testId}__page-size`"
                class="flex min-w-0 flex-col gap-(--spacing-xs)"
              >
                <span
                  :id="`${uid}-page-size-label`"
                  class="mb-(--spacing-xs) text-label-md text-(--text-default)"
                >
                  {{ t('collectionPreferences.pageSize') }}
                </span>
                <RadioGroup
                  :model-value="String(draftPageSize)"
                  :name="`${uid}-page-size`"
                  :aria-labelledby="`${uid}-page-size-label`"
                  @update:model-value="(value) => (draftPageSize = Number(value))"
                >
                  <RadioGroupItem
                    v-for="size in pageSizeOptions"
                    :key="size"
                    :value="String(size)"
                    >{{
                      t('collectionPreferences.pageSizeOption', { count: size })
                    }}</RadioGroupItem
                  >
                </RadioGroup>
              </div>

              <fieldset
                v-else-if="section === 'columns'"
                :data-testid="`${testId}__columns`"
                :aria-describedby="`${uid}-columns-description`"
                class="flex min-w-0 flex-col gap-(--spacing-xs)"
              >
                <legend class="text-label-md text-(--text-default)">
                  {{ t('collectionPreferences.columns') }}
                </legend>
                <p
                  :id="`${uid}-columns-description`"
                  class="mb-(--spacing-xs) text-body-sm text-(--text-muted)"
                >
                  {{ t('collectionPreferences.columnsDescription') }}
                </p>
                <ul class="flex flex-col gap-(--spacing-2xs)">
                  <li
                    v-for="(column, index) in draftColumns"
                    :id="`${uid}-column-${column.id}`"
                    :key="column.id"
                    :data-testid="`${testId}__column`"
                    class="flex min-h-10 items-center gap-(--spacing-sm) rounded-(--shape-control) border border-(--border-default) px-(--spacing-sm) py-(--spacing-2xs)"
                  >
                    <label
                      :data-locked="locked(column.id) || null"
                      class="flex min-w-0 flex-1 cursor-pointer items-center gap-(--spacing-sm) text-body-sm text-(--text-default) data-[locked]:cursor-default data-[locked]:text-(--text-muted)"
                    >
                      <Switch
                        :model-value="locked(column.id) || column.visible"
                        :disabled="locked(column.id)"
                        @update:model-value="(value: boolean) => setVisible(column.id, value)"
                      />
                      <span class="min-w-0 truncate">{{ columnLabel(column.id) }}</span>
                      <span
                        v-if="locked(column.id)"
                        class="ms-auto shrink-0 text-body-xs text-(--text-muted)"
                        >{{ t('collectionPreferences.alwaysShown') }}</span
                      >
                    </label>
                    <IconButton
                      icon="ai ai-arrow-up"
                      variant="ghost"
                      size="small"
                      data-move="up"
                      :ariaLabel="
                        t('collectionPreferences.moveUp', { column: columnLabel(column.id) })
                      "
                      :disabled="index === 0"
                      @click="move(index, -1)"
                    />
                    <IconButton
                      icon="ai ai-arrow-down"
                      variant="ghost"
                      size="small"
                      data-move="down"
                      :ariaLabel="
                        t('collectionPreferences.moveDown', { column: columnLabel(column.id) })
                      "
                      :disabled="index === draftColumns.length - 1"
                      @click="move(index, 1)"
                    />
                  </li>
                </ul>
              </fieldset>

              <label
                v-else-if="section === 'wrap-lines'"
                :data-testid="`${testId}__wrap-lines`"
                class="flex cursor-pointer items-start gap-(--spacing-sm)"
              >
                <Switch v-model="draftWrap" />
                <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span class="text-label-md text-(--text-default)">{{
                    t('collectionPreferences.wrapLines')
                  }}</span>
                  <span class="text-body-sm text-(--text-muted)">{{
                    t('collectionPreferences.wrapLinesDescription')
                  }}</span>
                </span>
              </label>

              <label
                v-else-if="section === 'striped'"
                :data-testid="`${testId}__striped`"
                class="flex cursor-pointer items-start gap-(--spacing-sm)"
              >
                <Switch v-model="draftStriped" />
                <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span class="text-label-md text-(--text-default)">{{
                    t('collectionPreferences.striped')
                  }}</span>
                  <span class="text-body-sm text-(--text-muted)">{{
                    t('collectionPreferences.stripedDescription')
                  }}</span>
                </span>
              </label>

              <div
                v-else-if="section === 'density'"
                :data-testid="`${testId}__density`"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <span
                  :id="`${uid}-density`"
                  class="text-label-md text-(--text-default)"
                  >{{ t('collectionPreferences.density') }}</span
                >
                <ToggleGroup
                  :model-value="draftDensity"
                  :options="densityOptions"
                  :aria-labelledby="`${uid}-density`"
                  size="medium"
                  class="self-start"
                  @update:model-value="setDensity"
                />
              </div>
            </template>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="@container/preferences-actions w-full">
            <div
              class="flex w-full flex-col gap-(--spacing-sm) @md/preferences-actions:flex-row @md/preferences-actions:items-center @md/preferences-actions:justify-end"
            >
              <Button
                :label="t('collectionPreferences.cancel')"
                :data-testid="`${testId}__cancel`"
                variant="ghost"
                size="medium"
                @click="cancel"
              />
              <Button
                :label="t('collectionPreferences.confirm')"
                :data-testid="`${testId}__confirm`"
                variant="primary"
                size="medium"
                @click="confirm"
              />
            </div>
          </div>
        </PanelFooter>
      </component>
    </component>
  </span>
</template>

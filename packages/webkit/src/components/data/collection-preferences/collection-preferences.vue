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
  import { applyToTable, moveColumn, seedColumns, tableColumns } from './lib/table-columns'

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

  defineOptions({ name: 'CollectionPreferences', inheritAttrs: false })

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
  const columns = computed<CollectionPreferencesColumn[]>(() =>
    table.value ? tableColumns(table.value) : props.columns
  )

  const shown = (section: CollectionPreferencesSection): boolean => {
    if (!props.sections.includes(section)) return false
    if (section === 'page-size') return props.pageSizeOptions.length > 0
    if (section === 'columns') return columns.value.length > 0
    return true
  }
  const ordered = computed<CollectionPreferencesSection[]>(() => props.sections.filter(shown))

  const draftColumns = ref<CollectionColumnPreference[]>([])
  const draftPageSize = ref<number>(0)
  const draftSwitches = ref<Record<SwitchSection, boolean>>({ 'wrap-lines': false, striped: false })
  const draftDensity = ref<CollectionDensity>('comfortable')

  const reset = (): void => {
    draftColumns.value = seedColumns(table.value, preferences.value.columns ?? [], columns.value)
    draftPageSize.value = preferences.value.pageSize ?? props.pageSizeOptions[0] ?? 0
    draftSwitches.value = {
      'wrap-lines': preferences.value.wrapLines ?? false,
      striped: preferences.value.striped ?? false
    }
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
    const next = moveColumn(draftColumns.value, index, index + step)
    const item = next?.[index + step]
    if (!next || !item) return
    draftColumns.value = next
    void nextTick(() => {
      const row = document.getElementById(`${uid}-column-${item.id}`)
      const button = row?.querySelector<HTMLButtonElement>(
        step < 0 ? '[data-move="up"]:not(:disabled)' : '[data-move="down"]:not(:disabled)'
      )
      ;(button ?? row?.querySelector<HTMLButtonElement>('[data-move]:not(:disabled)'))?.focus()
    })
  }

  type SwitchSection = 'wrap-lines' | 'striped'
  const SWITCH_TEXT = {
    'wrap-lines': ['collectionPreferences.wrapLines', 'collectionPreferences.wrapLinesDescription'],
    striped: ['collectionPreferences.striped', 'collectionPreferences.stripedDescription']
  } as const

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
    if (shown('wrap-lines')) value.wrapLines = draftSwitches.value['wrap-lines']
    if (shown('striped')) value.striped = draftSwitches.value.striped
    if (shown('density')) value.density = draftDensity.value
    preferences.value = value
    if (table.value && value.columns) applyToTable(table.value, value.columns)
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
        icon="az az-settings"
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
                      :for="`${uid}-column-${column.id}-switch`"
                      :data-locked="locked(column.id) || null"
                      class="flex min-w-0 flex-1 cursor-pointer items-center gap-(--spacing-sm) text-body-sm text-(--text-default) data-[locked]:cursor-default data-[locked]:text-(--text-muted)"
                    >
                      <Switch
                        :id="`${uid}-column-${column.id}-switch`"
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
                      icon="az az-arrow-up"
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
                      icon="az az-arrow-down"
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
                v-else-if="section === 'wrap-lines' || section === 'striped'"
                :for="`${uid}-${section}`"
                :data-testid="`${testId}__${section}`"
                class="flex cursor-pointer items-start gap-(--spacing-sm)"
              >
                <Switch
                  :id="`${uid}-${section}`"
                  v-model="draftSwitches[section]"
                />
                <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span class="text-label-md text-(--text-default)">{{
                    t(SWITCH_TEXT[section][0])
                  }}</span>
                  <span class="text-body-sm text-(--text-muted)">{{
                    t(SWITCH_TEXT[section][1])
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

<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import type {
    CollectionColumnPreference,
    CollectionDensity,
    CollectionPreferencesValue
  } from '../../../composables/use-collection/preferences'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import ToggleGroup from '../../actions/toggle-group/toggle-group.vue'
  import RadioButton from '../../inputs/radio-button/radio-button.vue'
  import Switch from '../../inputs/switch/switch.vue'
  import Dialog from '../../overlay/dialog/dialog.vue'
  import DialogClose from '../../overlay/dialog/dialog-close.vue'
  import DialogContent from '../../overlay/dialog/dialog-content.vue'
  import DialogOverlay from '../../overlay/dialog/dialog-overlay.vue'
  import DialogPortal from '../../overlay/dialog/dialog-portal.vue'
  import DialogTitle from '../../overlay/dialog/dialog-title.vue'
  import Drawer from '../../overlay/drawer/drawer.vue'
  import DrawerClose from '../../overlay/drawer/drawer-close.vue'
  import DrawerContent from '../../overlay/drawer/drawer-content.vue'
  import DrawerOverlay from '../../overlay/drawer/drawer-overlay.vue'
  import DrawerPortal from '../../overlay/drawer/drawer-portal.vue'
  import DrawerTitle from '../../overlay/drawer/drawer-title.vue'
  import PanelContent from '../../overlay/panel/panel-content.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'

  export type {
    CollectionColumnPreference,
    CollectionDensity,
    CollectionPreferencesValue
  } from '../../../composables/use-collection/preferences'

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

  interface Props {
    /** The saved preferences. Supports v-model:preferences; changes apply on Confirm. */
    preferences?: CollectionPreferencesValue
    /** Columns to show, hide and order. Empty hides the columns section. */
    columns?: CollectionPreferencesColumn[]
    /** Page sizes offered. Empty hides the page size section. */
    pageSizeOptions?: number[]
    /** Sections the panel shows, in this order. */
    sections?: CollectionPreferencesSection[]
    /** Opens in a centered dialog or a side drawer. */
    container?: 'dialog' | 'drawer'
    /** Panel title and trigger label. Empty uses the locale catalog. */
    title?: string
    /** Disables the trigger. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    preferences: () => ({}),
    columns: () => [],
    pageSizeOptions: () => [],
    sections: () => ['page-size', 'columns', 'wrap-lines', 'striped', 'density'],
    container: 'dialog',
    title: '',
    disabled: false
  })

  const open = defineModel<boolean>('open', { default: false })

  const emit = defineEmits<{
    'update:preferences': [value: CollectionPreferencesValue]
    confirm: [value: CollectionPreferencesValue]
    cancel: []
  }>()

  defineSlots<{
    /** Replaces the default trigger button; receives an open function. */
    trigger(props: { open: () => void }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ collectionPreferences: en.collectionPreferences })
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-collection-preferences'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )
  const heading = computed<string>(() => props.title || t('collectionPreferences.title'))

  const shown = (section: CollectionPreferencesSection): boolean => {
    if (!props.sections.includes(section)) return false
    if (section === 'page-size') return props.pageSizeOptions.length > 0
    if (section === 'columns') return props.columns.length > 0
    return true
  }
  const ordered = computed<CollectionPreferencesSection[]>(() => props.sections.filter(shown))

  const draftColumns = ref<CollectionColumnPreference[]>([])
  const draftPageSize = ref<number>(0)
  const draftWrap = ref<boolean>(false)
  const draftStriped = ref<boolean>(false)
  const draftDensity = ref<CollectionDensity>('comfortable')

  const seedColumns = (): CollectionColumnPreference[] => {
    const saved = props.preferences.columns ?? []
    const known = new Set(props.columns.map((c) => c.id))
    const kept = saved.filter((c) => known.has(c.id))
    const seen = new Set(kept.map((c) => c.id))
    return [
      ...kept,
      ...props.columns.filter((c) => !seen.has(c.id)).map((c) => ({ id: c.id, visible: true }))
    ]
  }

  const reset = (): void => {
    draftColumns.value = seedColumns()
    draftPageSize.value = props.preferences.pageSize ?? props.pageSizeOptions[0] ?? 0
    draftWrap.value = props.preferences.wrapLines ?? false
    draftStriped.value = props.preferences.striped ?? false
    draftDensity.value = props.preferences.density ?? 'comfortable'
  }

  const triggerHost = ref<HTMLElement | null>(null)
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
      triggerHost.value?.querySelector<HTMLElement>('button, [tabindex]')?.focus()
    },
    { immediate: true }
  )

  const columnLabel = (id: string): string => props.columns.find((c) => c.id === id)?.label ?? id
  const locked = (id: string): boolean => props.columns.find((c) => c.id === id)?.locked === true

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

  const confirm = (): void => {
    const value: CollectionPreferencesValue = {}
    if (shown('page-size')) value.pageSize = draftPageSize.value
    if (shown('columns')) value.columns = draftColumns.value.map((c) => ({ ...c }))
    if (shown('wrap-lines')) value.wrapLines = draftWrap.value
    if (shown('striped')) value.striped = draftStriped.value
    if (shown('density')) value.density = draftDensity.value
    emit('update:preferences', value)
    emit('confirm', value)
    open.value = false
  }

  const cancel = (): void => {
    emit('cancel')
    open.value = false
  }

  const Root = computed(() => (props.container === 'drawer' ? Drawer : Dialog))
  const Portal = computed(() => (props.container === 'drawer' ? DrawerPortal : DialogPortal))
  const Overlay = computed(() => (props.container === 'drawer' ? DrawerOverlay : DialogOverlay))
  const Content = computed(() => (props.container === 'drawer' ? DrawerContent : DialogContent))
  const Title = computed(() => (props.container === 'drawer' ? DrawerTitle : DialogTitle))
  const Close = computed(() => (props.container === 'drawer' ? DrawerClose : DialogClose))
</script>

<template>
  <span
    ref="triggerHost"
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
        icon="pi pi-cog"
        kind="outlined"
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
      <component :is="Portal">
        <component :is="Overlay" />
        <component :is="Content">
          <PanelHeader class="w-full">
            <component :is="Title">{{ heading }}</component>
            <component :is="Close" />
          </PanelHeader>
          <PanelContent>
            <div
              :data-testid="`${testId}__sections`"
              class="@container/preferences flex flex-col gap-(--spacing-lg)"
            >
              <template
                v-for="section in ordered"
                :key="section"
              >
                <fieldset
                  v-if="section === 'page-size'"
                  :data-testid="`${testId}__page-size`"
                  class="flex min-w-0 flex-col gap-(--spacing-xs)"
                >
                  <legend class="mb-(--spacing-xs) text-label-md text-(--text-default)">
                    {{ t('collectionPreferences.pageSize') }}
                  </legend>
                  <label
                    v-for="size in pageSizeOptions"
                    :key="size"
                    class="flex min-h-8 cursor-pointer items-center gap-(--spacing-sm) text-body-sm text-(--text-default) pointer-coarse:min-h-11"
                  >
                    <RadioButton
                      :model-value="String(draftPageSize)"
                      :value="String(size)"
                      :name="`${uid}-page-size`"
                      @update:model-value="draftPageSize = size"
                    />
                    <span>{{ t('collectionPreferences.pageSizeOption', { count: size }) }}</span>
                  </label>
                </fieldset>

                <fieldset
                  v-else-if="section === 'columns'"
                  :data-testid="`${testId}__columns`"
                  class="flex min-w-0 flex-col gap-(--spacing-xs)"
                >
                  <legend class="text-label-md text-(--text-default)">
                    {{ t('collectionPreferences.columns') }}
                  </legend>
                  <p class="mb-(--spacing-xs) text-body-sm text-(--text-muted)">
                    {{ t('collectionPreferences.columnsDescription') }}
                  </p>
                  <ul class="flex flex-col gap-(--spacing-xxs)">
                    <li
                      v-for="(column, index) in draftColumns"
                      :id="`${uid}-column-${column.id}`"
                      :key="column.id"
                      :data-testid="`${testId}__column`"
                      class="flex min-h-10 items-center gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xxs)"
                    >
                      <label
                        class="flex min-w-0 flex-1 items-center gap-(--spacing-sm) text-body-sm"
                        :class="
                          locked(column.id)
                            ? 'cursor-default text-(--text-muted)'
                            : 'cursor-pointer text-(--text-default)'
                        "
                      >
                        <Switch
                          :model-value="locked(column.id) || column.visible"
                          :disabled="locked(column.id)"
                          @update:model-value="(value: boolean) => setVisible(column.id, value)"
                        />
                        <span class="min-w-0 truncate">{{ columnLabel(column.id) }}</span>
                        <span
                          v-if="locked(column.id)"
                          class="ms-auto shrink-0 text-label-xs text-(--text-muted)"
                          >{{ t('collectionPreferences.alwaysShown') }}</span
                        >
                      </label>
                      <IconButton
                        icon="pi pi-arrow-up"
                        kind="transparent"
                        size="small"
                        data-move="up"
                        :ariaLabel="
                          t('collectionPreferences.moveUp', { column: columnLabel(column.id) })
                        "
                        :disabled="index === 0"
                        @click="move(index, -1)"
                      />
                      <IconButton
                        icon="pi pi-arrow-down"
                        kind="transparent"
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
                  <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
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
                  <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
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
          </PanelContent>
          <PanelFooter>
            <div class="@container/preferences-actions w-full">
              <div
                class="flex w-full flex-col gap-(--spacing-sm) @md/preferences-actions:flex-row @md/preferences-actions:items-center @md/preferences-actions:justify-end"
              >
                <Button
                  :label="t('collectionPreferences.cancel')"
                  :data-testid="`${testId}__cancel`"
                  kind="transparent"
                  size="medium"
                  @click="cancel"
                />
                <Button
                  :label="t('collectionPreferences.confirm')"
                  :data-testid="`${testId}__confirm`"
                  kind="primary"
                  size="medium"
                  @click="confirm"
                />
              </div>
            </div>
          </PanelFooter>
        </component>
      </component>
    </component>
  </span>
</template>

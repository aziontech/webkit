<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import DropdownMenu from '../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuOption from '../../navigation/dropdown-menu/dropdown-menu-option/dropdown-menu-option.vue'
  import DropdownMenuTrigger from '../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import IconButton from '../icon-button/icon-button.vue'

  /** A plain icon action. */
  export interface ButtonGroupActionItem {
    type?: 'icon-button'
    /** Identifier emitted on `click`. */
    id: string
    /** Accessible name, tooltip and overflow label. */
    label: string
    /** PrimeIcons class. */
    icon: string
    disabled?: boolean
    /** Shows a spinner and blocks activation while the action runs. */
    loading?: boolean
  }

  /** An on / off action; the consumer owns `pressed` and flips it on `toggle`. */
  export interface ButtonGroupToggleItem {
    type: 'toggle'
    id: string
    label: string
    icon: string
    /** Icon while pressed; defaults to `icon`. */
    pressedIcon?: string
    pressed?: boolean
    disabled?: boolean
  }

  /** One option of a menu item. */
  export interface ButtonGroupMenuOption {
    /** Identifier emitted on `click`; unique across the group. */
    id: string
    label: string
    disabled?: boolean
  }

  /** An icon that opens a menu of options. */
  export interface ButtonGroupMenuItem {
    type: 'menu'
    id: string
    label: string
    icon: string
    options: ButtonGroupMenuOption[]
    disabled?: boolean
  }

  export type ButtonGroupItem = ButtonGroupActionItem | ButtonGroupToggleItem | ButtonGroupMenuItem

  /** Visual variant of every button in the group. */
  export type ButtonGroupKind = 'transparent' | 'outlined'
  /** Size token of every button in the group. */
  export type ButtonGroupSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'ButtonGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Actions, toggles and menus, in reading order. */
    items?: ButtonGroupItem[]
    /** Accessible name of the toolbar; write it as the aria-label attribute. Leave it empty only when aria-labelledby names the toolbar. */
    ariaLabel?: string
    /** Visual variant of every button. */
    kind?: ButtonGroupKind
    /** Size token of every button. */
    size?: ButtonGroupSize
    /** Items shown as buttons; the rest go into the More actions menu. Unset shows every item. */
    visibleCount?: number
    /** Label of the overflow button. Empty uses the locale catalog (`More actions`). */
    overflowLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    ariaLabel: '',
    kind: 'transparent',
    size: 'medium',
    visibleCount: undefined,
    overflowLabel: ''
  })

  const emit = defineEmits<{
    click: [event: MouseEvent | KeyboardEvent, id: string]
    toggle: [detail: { id: string; pressed: boolean }]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ buttonGroup: en.buttonGroup })
  const rootRef = ref<HTMLElement | null>(null)
  const dir = useDirection(rootRef)
  const focusedId = ref<string | null>(null)

  const OVERFLOW_ID = '__overflow'

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'actions-button-group'
  )

  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const splitAt = computed(() =>
    props.visibleCount === undefined || props.visibleCount >= props.items.length
      ? props.items.length
      : Math.max(0, Math.floor(props.visibleCount))
  )

  const visibleItems = computed(() => props.items.slice(0, splitAt.value))
  const overflowItems = computed(() => props.items.slice(splitAt.value))
  const overflowSections = computed(() => {
    const sections: { key: string; label: string; items: ButtonGroupItem[] }[] = []
    for (const item of overflowItems.value) {
      if (isMenu(item)) {
        sections.push({ key: item.id, label: item.label, items: [item] })
        continue
      }
      const last = sections.at(-1)
      if (last && !last.label) last.items.push(item)
      else sections.push({ key: item.id, label: '', items: [item] })
    }
    return sections
  })

  const overflowName = computed(() => props.overflowLabel || t('buttonGroup.moreActions'))

  const focusableIds = computed(() => {
    const ids = visibleItems.value.filter((item) => !item.disabled).map((item) => item.id)
    if (overflowItems.value.length) ids.push(OVERFLOW_ID)
    return ids
  })

  const tabStopId = computed(() =>
    focusedId.value && focusableIds.value.includes(focusedId.value)
      ? focusedId.value
      : (focusableIds.value[0] ?? null)
  )

  const isToggle = (item: ButtonGroupItem): item is ButtonGroupToggleItem => item.type === 'toggle'
  const isMenu = (item: ButtonGroupItem): item is ButtonGroupMenuItem => item.type === 'menu'

  const iconOf = (item: ButtonGroupItem) =>
    isToggle(item) && item.pressed ? (item.pressedIcon ?? item.icon) : item.icon

  const activate = (event: MouseEvent | KeyboardEvent, item: ButtonGroupItem) => {
    if (item.disabled || (!isToggle(item) && !isMenu(item) && item.loading)) return
    if (isToggle(item)) {
      emit('toggle', { id: item.id, pressed: !item.pressed })
      return
    }
    emit('click', event, item.id)
  }

  const onMenuSelect = (event: MouseEvent | KeyboardEvent, value: string | number) => {
    emit('click', event, String(value))
  }

  const onOverflowSelect = (event: MouseEvent | KeyboardEvent, value: string | number) => {
    const id = String(value)
    const item = overflowItems.value.find((entry) => entry.id === id)
    if (item) {
      activate(event, item)
      return
    }
    emit('click', event, id)
  }

  const controls = () =>
    Array.from(
      rootRef.value?.querySelectorAll<HTMLElement>('[data-button-group-item]') ?? []
    ).filter((el) => !el.hasAttribute('disabled'))

  const onFocusIn = (event: FocusEvent) => {
    const id = (event.target as HTMLElement | null)
      ?.closest('[data-button-group-item]')
      ?.getAttribute('data-button-group-item')
    if (id) focusedId.value = id
  }

  const onKeydown = (event: KeyboardEvent) => {
    const list = controls()
    const current = list.indexOf(document.activeElement as HTMLElement)
    if (current < 0 || !list.length) return
    const key = logicalArrowKey(event.key, dir.value)
    let next = -1
    if (key === 'ArrowRight') next = (current + 1) % list.length
    else if (key === 'ArrowLeft') next = (current - 1 + list.length) % list.length
    else if (key === 'Home') next = 0
    else if (key === 'End') next = list.length - 1
    if (next < 0) return
    event.preventDefault()
    list[next]?.focus()
  }
</script>

<template>
  <div
    ref="rootRef"
    v-bind="rootAttrs"
    role="toolbar"
    aria-orientation="horizontal"
    :aria-label="ariaLabel || undefined"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    class="inline-flex max-w-full min-w-0 flex-wrap items-center gap-(--spacing-xxs)"
    @focusin="onFocusIn"
    @keydown="onKeydown"
  >
    <template
      v-for="item in visibleItems"
      :key="item.id"
    >
      <DropdownMenu
        v-if="isMenu(item)"
        placement="bottom-end"
        :disabled="item.disabled"
        :data-testid="`${testId}__menu`"
        @select="onMenuSelect"
      >
        <Tooltip :text="item.label">
          <DropdownMenuTrigger>
            <IconButton
              :icon="item.icon"
              :ariaLabel="item.label"
              :kind="kind"
              :size="size"
              :disabled="item.disabled"
              :tabindex="tabStopId === item.id ? 0 : -1"
              :data-button-group-item="item.id"
              :data-testid="`${testId}__item`"
            />
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuGroup>
          <DropdownMenuOption
            v-for="option in item.options"
            :key="option.id"
            :value="option.id"
            :label="option.label"
            :disabled="option.disabled"
          />
        </DropdownMenuGroup>
      </DropdownMenu>
      <Tooltip
        v-else
        :text="item.label"
      >
        <IconButton
          :icon="iconOf(item)"
          :ariaLabel="item.label"
          :aria-pressed="isToggle(item) ? Boolean(item.pressed) : undefined"
          :kind="kind"
          :size="size"
          :disabled="item.disabled"
          :loading="!isToggle(item) && Boolean(item.loading)"
          :tabindex="tabStopId === item.id ? 0 : -1"
          :data-button-group-item="item.id"
          :data-pressed="isToggle(item) && item.pressed ? '' : undefined"
          :data-testid="`${testId}__item`"
          class="data-[pressed]:bg-(--bg-selected) data-[pressed]:text-(--text-default) forced-colors:data-[pressed]:outline-2 forced-colors:data-[pressed]:outline-[Highlight]"
          @click="activate($event, item)"
        />
      </Tooltip>
    </template>

    <DropdownMenu
      v-if="overflowItems.length"
      placement="bottom-end"
      :data-testid="`${testId}__overflow`"
      @select="onOverflowSelect"
    >
      <Tooltip :text="overflowName">
        <DropdownMenuTrigger>
          <IconButton
            icon="pi pi-ellipsis-h"
            :ariaLabel="overflowName"
            :kind="kind"
            :size="size"
            :tabindex="tabStopId === OVERFLOW_ID ? 0 : -1"
            :data-button-group-item="OVERFLOW_ID"
            :data-testid="`${testId}__overflow-trigger`"
          />
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuGroup
        v-for="section in overflowSections"
        :key="section.key"
        :label="section.label"
      >
        <template
          v-for="item in section.items"
          :key="item.id"
        >
          <template v-if="isMenu(item)">
            <DropdownMenuOption
              v-for="option in item.options"
              :key="option.id"
              :value="option.id"
              :label="option.label"
              :disabled="item.disabled || option.disabled"
            />
          </template>
          <DropdownMenuOption
            v-else
            :value="item.id"
            :label="item.label"
            :disabled="item.disabled"
          >
            <template #left>
              <i
                :class="iconOf(item)"
                class="w-4 text-center"
                aria-hidden="true"
              />
            </template>
            <template
              v-if="isToggle(item) && item.pressed"
              #right
            >
              <i
                class="pi pi-check text-(--text-default)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ t('buttonGroup.pressed') }}</span>
            </template>
          </DropdownMenuOption>
        </template>
      </DropdownMenuGroup>
    </DropdownMenu>
  </div>
</template>

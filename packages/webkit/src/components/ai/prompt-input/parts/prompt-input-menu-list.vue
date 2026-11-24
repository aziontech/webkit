<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'

  import type { PromptInputMenuOption } from '../types'

  defineOptions({ name: 'PromptInputMenuList', inheritAttrs: false })

  interface Props {
    /** Id of the listbox; each option appends its index. */
    id: string
    /** Accessible name of the listbox. */
    label: string
    /** Trigger character of the open menu. */
    trigger: string
    /** Options that match the typed text. */
    options: PromptInputMenuOption[]
    /** Test id of the owning PromptInput; the list appends its own part. */
    testId: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    select: [event: Event, option: PromptInputMenuOption]
  }>()

  const activeIndex = defineModel<number>('activeIndex', { required: true })

  const menuEl = ref<HTMLElement | null>(null)
  const side = ref<'top' | 'bottom'>('top')

  function place(): void {
    const menu = menuEl.value
    const box = menu?.parentElement
    if (!box || !menu) return
    const rect = box.getBoundingClientRect()
    const viewport = globalThis.visualViewport
    const top = viewport?.offsetTop ?? 0
    const bottom = top + (viewport?.height ?? globalThis.innerHeight)
    const above = rect.top - top
    const below = bottom - rect.bottom
    side.value = above < menu.offsetHeight && below > above ? 'bottom' : 'top'
  }

  onMounted(() => void nextTick(place))

  const MENU_CLASS =
    'absolute inset-x-0 z-(--z-control-overlay) m-0 flex ' +
    'data-[side=bottom]:top-full data-[side=bottom]:mt-(--spacing-2xs) data-[side=top]:bottom-full data-[side=top]:mb-(--spacing-2xs) ' +
    'max-h-72 list-none flex-col overflow-y-auto rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-2xs) shadow-(--shadow-xs)'

  const OPTION_CLASS =
    'flex cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 px-(--spacing-xs) py-(--spacing-2xs) pointer-coarse:min-h-11 text-label-sm text-(--text-default) ' +
    'hover:bg-(--bg-hover) ' +
    'data-[active]:bg-(--bg-selected)'
</script>

<template>
  <ul
    :id="id"
    role="listbox"
    :aria-label="label"
    :data-testid="`${testId}__menu`"
    ref="menuEl"
    :data-trigger="trigger"
    :data-side="side"
    :class="MENU_CLASS"
  >
    <li
      v-for="(option, index) in options"
      :id="`${id}-${index}`"
      :key="option.value"
      role="option"
      tabindex="-1"
      :aria-selected="index === activeIndex"
      :data-active="index === activeIndex || null"
      :class="OPTION_CLASS"
      @mousedown.prevent
      @click="(event: MouseEvent) => emit('select', event, option)"
      @keydown.enter.prevent="(event: KeyboardEvent) => emit('select', event, option)"
      @mousemove="activeIndex = index"
    >
      <i
        v-if="option.icon"
        :class="option.icon"
        class="shrink-0 text-(--text-muted)"
        aria-hidden="true"
      />
      <span
        dir="auto"
        class="min-w-0 truncate"
        >{{ option.label }}</span
      >
      <span
        v-if="option.description"
        dir="auto"
        class="min-w-0 truncate text-body-xs text-(--text-muted)"
        >{{ option.description }}</span
      >
    </li>
  </ul>
</template>

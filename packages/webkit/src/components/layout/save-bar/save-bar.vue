<script setup lang="ts">
  import { computed, getCurrentInstance, nextTick, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import { useShortcuts } from '../../../composables/use-shortcuts'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'

  /**
   * `floating` overlays the bottom of the scroll region without moving the content, `docked` takes
   * its own row at the bottom, `plain` closes a form column with its actions on the right, `fade`
   * closes a wizard step with no border, the content fading into the canvas above it, `centered`
   * floats the actions as a raised card centred over the bottom of a create page.
   */
  export type SaveBarVariant = 'floating' | 'docked' | 'plain' | 'fade' | 'centered'

  defineOptions({
    name: 'SaveBar',
    inheritAttrs: false
  })

  export interface SaveBarProps {
    /** How the bar sits at the bottom of its scroll region. */
    variant?: SaveBarVariant
  }

  const props = withDefaults(defineProps<SaveBarProps>(), {
    variant: 'floating'
  })

  const emit = defineEmits<{
    /** Command S (Control S off Apple) was pressed while the bar is shown; the browser's own save is prevented. Bound only when listened to. */
    save: [event: KeyboardEvent]
  }>()

  defineSlots<{
    /** The status sentence on the left, such as You have unsaved changes. */
    default(): unknown
    /** Replaces the leading region (icon and sentence) with custom content, such as a status. */
    leading(): unknown
    /** Discard or Cancel, then Save, on the right. */
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const instance = getCurrentInstance()
  const { t } = useTranslate({ saveBar: en.saveBar })

  const rootEl = ref<HTMLElement | null>(null)
  const shellEl = ref<HTMLElement | null>(null)
  const reserved = ref(0)
  let observer: ResizeObserver | null = null
  let measured = -1

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'save-bar')

  useShortcuts({
    keys: 'meta+s',
    label: () => t('saveBar.saveShortcut'),
    when: () => Boolean(instance?.vnode.props?.['onSave']),
    element: rootEl,
    handler: (event) => emit('save', event)
  })

  const rootStyle = computed(() => (reserved.value ? { height: `${reserved.value}px` } : undefined))

  function publish(height: number) {
    const documentRoot = globalThis.document?.documentElement
    if (!documentRoot) return
    if (height) {
      documentRoot.style.setProperty('--save-bar-inset', `${height}px`)
      documentRoot.style.setProperty('--toast-offset-bottom', `${height}px`)
    } else {
      documentRoot.style.removeProperty('--save-bar-inset')
      documentRoot.style.removeProperty('--toast-offset-bottom')
    }
  }

  function scrolls(node: Element) {
    const overflow = getComputedStyle(node).overflowY
    return overflow === 'auto' || overflow === 'scroll'
  }

  function reachableScroll() {
    const element = rootEl.value
    if (!element) return 0
    let total = 0
    let node = element.parentElement
    let container: Element | null = null
    while (node && node !== globalThis.document?.body) {
      if (scrolls(node)) {
        container = node
        break
      }
      node = node.parentElement
    }
    container ??= globalThis.document?.scrollingElement ?? null
    if (container) total += container.scrollHeight - container.clientHeight
    for (const sibling of Array.from(element.parentElement?.children ?? [])) {
      if (sibling !== element && scrolls(sibling))
        total += sibling.scrollHeight - sibling.clientHeight
    }
    return total
  }

  async function measure(element: HTMLElement | null) {
    const height = element ? element.offsetHeight : 0
    if (height === measured) return
    measured = height
    publish(height)
    if (reserved.value) {
      reserved.value = 0
      await nextTick()
    }
    if (!height) return
    const before = reachableScroll()
    reserved.value = height
    await nextTick()
    if (reachableScroll() <= before) reserved.value = 0
  }

  function release() {
    observer?.disconnect()
    observer = null
    measured = -1
    reserved.value = 0
    publish(0)
  }

  watch(
    [shellEl, () => props.variant],
    ([element, variant]) => {
      release()
      if (!element || variant !== 'floating' || typeof ResizeObserver === 'undefined') return
      observer = new ResizeObserver(() => measure(element))
      observer.observe(element)
      measure(element)
    },
    { flush: 'post' }
  )

  onScopeDispose(release)

  const ROOT_CLASS =
    'group/save-bar @container/save-bar sticky bottom-0 z-10 shrink-0 ' +
    'data-[variant=floating]:h-0 data-[variant=plain]:border-t-(length:--border-width-default) data-[variant=plain]:border-(--border-muted) data-[variant=plain]:bg-(--bg-surface) ' +
    'data-[variant=fade]:bg-linear-to-b data-[variant=fade]:from-transparent data-[variant=fade]:to-(--bg-canvas) data-[variant=centered]:pointer-events-none'

  const SHELL_CLASS =
    'group-data-[variant=docked]/save-bar:border-t group-data-[variant=docked]/save-bar:border-(--border-default) group-data-[variant=docked]/save-bar:bg-(--bg-canvas) ' +
    'group-data-[variant=docked]/save-bar:@xl/save-bar:h-14 group-data-[variant=floating]/save-bar:absolute group-data-[variant=floating]/save-bar:inset-x-0 ' +
    'group-data-[variant=floating]/save-bar:bottom-0 group-data-[variant=floating]/save-bar:border-t group-data-[variant=floating]/save-bar:border-(--border-default) ' +
    'group-data-[variant=floating]/save-bar:bg-(--bg-canvas) group-data-[variant=floating]/save-bar:@xl/save-bar:h-14'

  const CARD_CLASS =
    'pointer-events-auto flex max-w-full min-w-0 items-center gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-xs) ' +
    'shadow-(--shadow-lg)'

  const BAR_CLASS =
    'layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) pt-(--spacing-sm) pb-[max(var(--spacing-sm),env(safe-area-inset-bottom))] ' +
    '@xl/save-bar:h-full @xl/save-bar:flex-row @xl/save-bar:flex-wrap @xl/save-bar:items-center @xl/save-bar:justify-between @xl/save-bar:gap-x-(--spacing-xl) @xl/save-bar:py-0'
</script>

<template>
  <footer
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :style="rootStyle"
    :class="ROOT_CLASS"
  >
    <div
      ref="shellEl"
      :class="SHELL_CLASS"
    >
      <div
        v-if="variant === 'plain'"
        class="layout-column-form layout-boundary-inline flex items-center justify-end gap-(--spacing-sm) py-(--spacing-md) @max-md/save-bar:flex-col @max-md/save-bar:items-stretch"
      >
        <div
          v-if="$slots['leading'] || $slots['default']"
          :data-testid="`${testId}__message`"
          role="status"
          class="me-auto flex min-w-0 items-start gap-(--spacing-xs) @max-md/save-bar:me-0"
        >
          <slot name="leading">
            <i
              class="az az-circle-info mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <p class="min-w-0 text-body-sm text-(--text-default)">
              <slot />
            </p>
          </slot>
        </div>
        <div
          :data-testid="`${testId}__actions`"
          class="flex items-center gap-(--spacing-sm) @max-md/save-bar:flex-col-reverse @max-md/save-bar:items-stretch @max-md/save-bar:gap-(--spacing-xs)"
        >
          <slot name="actions" />
        </div>
      </div>
      <div
        v-else-if="variant === 'centered'"
        class="flex justify-center px-(--spacing-md) pt-(--spacing-xl) pb-[max(var(--spacing-lg),env(safe-area-inset-bottom))]"
      >
        <div
          :data-testid="`${testId}__card`"
          :class="CARD_CLASS"
        >
          <div
            v-if="$slots['leading'] || $slots['default']"
            :data-testid="`${testId}__message`"
            role="status"
            class="flex min-w-0 items-center gap-(--spacing-xs) ps-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <slot name="leading"><slot /></slot>
          </div>
          <div
            :data-testid="`${testId}__actions`"
            class="flex shrink-0 items-center gap-(--spacing-sm)"
          >
            <slot name="actions" />
          </div>
        </div>
      </div>
      <div
        v-else-if="variant === 'fade'"
        class="layout-column-form layout-boundary-inline flex items-center justify-end gap-(--spacing-sm) pt-(--spacing-xl) pb-(--spacing-lg)"
      >
        <div
          v-if="$slots['leading'] || $slots['default']"
          :data-testid="`${testId}__message`"
          role="status"
          class="me-auto flex min-w-0 items-center gap-(--spacing-xs)"
        >
          <slot name="leading">
            <i
              class="az az-circle-info shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <p class="min-w-0 text-body-sm text-(--text-default)">
              <slot />
            </p>
          </slot>
        </div>
        <div
          :data-testid="`${testId}__actions`"
          class="flex items-center gap-(--spacing-sm)"
        >
          <slot name="actions" />
        </div>
      </div>
      <div
        v-else
        :class="BAR_CLASS"
      >
        <div
          v-if="$slots['leading'] || $slots['default']"
          :data-testid="`${testId}__message`"
          role="status"
          class="flex min-w-0 items-start gap-(--spacing-xs)"
        >
          <slot name="leading">
            <i
              class="az az-circle-info mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <p class="min-w-0 text-body-sm text-(--text-default)">
              <slot />
            </p>
          </slot>
        </div>
        <div
          :data-testid="`${testId}__actions`"
          class="flex flex-col-reverse gap-(--spacing-xs) @xl/save-bar:ms-auto @xl/save-bar:shrink-0 @xl/save-bar:flex-row @xl/save-bar:items-center @xl/save-bar:gap-(--spacing-sm)"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </footer>
</template>

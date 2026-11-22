<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import SourcesMark from './parts/sources-mark.vue'
  import type { SourcesItem } from './types'
  import { sourceAnchor, sourceSite } from './types'

  export type { SourcesItem }

  defineOptions({
    name: 'Sources',
    inheritAttrs: false
  })

  export interface SourcesProps {
    /** The sources behind the response, in citation order; item `n` is what `[n]` points at. */
    items?: SourcesItem[]
    /** Id prefix of the list items (`<anchor>-source-<n>`); pass the same value to `StreamingResponse` so its citations link here. */
    anchor?: string
    /** Label of the pill that opens the list. Empty shows `Sources` and names the pill with the count (`3 sources`). */
    title?: string
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<SourcesProps>(), {
    items: () => [],
    anchor: '',
    title: '',
    defaultOpen: false
  })

  /** Controlled open state. Use with `v-model:open`; while unbound it follows `defaultOpen` and toggles locally. */
  const open = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const { t } = useTranslate({ sources: en.sources })
  const uid = useId()
  const panelId = `${uid}-panel`

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'sources')
  const prefix = computed<string>(() => props.anchor || uid)
  const heading = computed<string>(() => props.title || t('sources.label'))
  const triggerName = computed<string | undefined>(() =>
    props.title ? undefined : t('sources.count', { count: props.items.length })
  )
  const marks = computed<SourcesItem[]>(() => props.items.slice(0, 3))

  const isOpen = computed<boolean>(() => open.value ?? props.defaultOpen)

  function toggle(): void {
    open.value = !isOpen.value
  }

  let frame: number | null = null

  function external(href?: string): boolean {
    return Boolean(href && /^https?:\/\//i.test(href))
  }

  function onHashChange(): void {
    if (typeof window === 'undefined') return
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (!hash.startsWith(`${prefix.value}-source-`)) return
    open.value = true
    if (frame !== null) cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      frame = null
      document.getElementById(hash)?.scrollIntoView({ block: 'nearest' })
    })
  }

  onMounted(() => window.addEventListener('hashchange', onHashChange))
  onScopeDispose(() => {
    if (typeof window !== 'undefined') window.removeEventListener('hashchange', onHashChange)
    if (frame !== null) cancelAnimationFrame(frame)
  })

  const TRIGGER_CLASS =
    'relative inline-flex h-8 w-fit shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-control) ps-(--spacing-2xs) pe-(--spacing-sm) text-label-md text-(--text-muted) ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) hover:text-(--text-default) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[state=open]:bg-(--bg-hover) data-[state=open]:text-(--text-default)'

  const LIST_CLASS =
    'm-0 mt-(--spacing-xs) flex basis-full list-none flex-col rounded-(--shape-card) border border-(--border-default) p-(--spacing-2xs)'

  const ITEM_CLASS =
    'flex items-center gap-(--spacing-sm) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-xs) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)'
</script>

<template>
  <div
    v-if="items.length"
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    class="contents"
  >
    <button
      type="button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="panelId"
      :aria-label="triggerName"
      :data-testid="`${testId}__trigger`"
      :data-state="isOpen ? 'open' : 'closed'"
      :class="TRIGGER_CLASS"
      @click="toggle"
    >
      <span
        aria-hidden="true"
        class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
      />
      <span
        aria-hidden="true"
        :data-testid="`${testId}__marks`"
        class="flex items-center"
      >
        <SourcesMark
          v-for="(item, i) in marks"
          :key="`${i}-${item.title}`"
          :item="item"
          :data-testid="`${testId}__mark`"
          class="ring-2 ring-(--bg-canvas) not-first:-ms-1.5"
        />
      </span>
      <span>{{ heading }}</span>
    </button>
    <ol
      v-show="isOpen"
      :id="panelId"
      :aria-label="t('sources.label')"
      :data-testid="`${testId}__list`"
      data-slot="sources-list"
      :class="LIST_CLASS"
    >
      <li
        v-for="(item, i) in items"
        :id="sourceAnchor(prefix, i + 1)"
        :key="`${i}-${item.title}`"
        tabindex="-1"
        :data-testid="`${testId}__item`"
        :class="ITEM_CLASS"
      >
        <SourcesMark
          :item="item"
          size="medium"
        />
        <span class="flex min-w-0 flex-col">
          <a
            v-if="safeHref(item.href)"
            :href="safeHref(item.href) ?? undefined"
            :target="external(item.href) ? '_blank' : undefined"
            :rel="external(item.href) ? 'noopener noreferrer' : undefined"
            class="truncate text-body-sm text-(--text-default) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
          >
            {{ item.title }}
          </a>
          <span
            v-else
            class="truncate text-body-sm text-(--text-default)"
          >
            {{ item.title }}
          </span>
          <span
            v-if="item.description || sourceSite(item)"
            class="truncate text-body-xs text-(--text-muted)"
          >
            {{ item.description || sourceSite(item) }}
          </span>
        </span>
      </li>
    </ol>
  </div>
</template>

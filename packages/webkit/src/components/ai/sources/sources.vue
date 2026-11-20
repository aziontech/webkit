<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import type { SourcesItem } from './types'
  import { sourceAnchor } from './types'

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
    /** Heading of the disclosure. Empty uses the locale catalog (`3 sources`). */
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
  const heading = computed<string>(
    () => props.title || t('sources.count', { count: props.items.length })
  )

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
</script>

<template>
  <div
    v-if="items.length"
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <button
      type="button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="panelId"
      :data-testid="`${testId}__trigger`"
      class="inline-flex w-fit items-center gap-(--spacing-xs) rounded-(--shape-control) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      @click="toggle"
    >
      <i
        class="az az-book"
        aria-hidden="true"
      />
      <span>{{ heading }}</span>
      <i
        :data-state="isOpen ? 'open' : 'closed'"
        class="az az-chevron-down text-body-xs transition-transform duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </button>
    <ol
      v-show="isOpen"
      :id="panelId"
      :aria-label="t('sources.label')"
      :data-testid="`${testId}__list`"
      class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
    >
      <li
        v-for="(item, i) in items"
        :id="sourceAnchor(prefix, i + 1)"
        :key="`${i}-${item.title}`"
        tabindex="-1"
        :data-testid="`${testId}__item`"
        class="flex items-start gap-(--spacing-xs) rounded-(--shape-control) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      >
        <span
          aria-hidden="true"
          class="inline-flex min-w-5 shrink-0 items-center justify-center rounded-(--shape-control) bg-(--bg-surface-raised) px-1 text-label-sm text-(--text-muted)"
        >
          {{ i + 1 }}
        </span>
        <span class="flex min-w-0 flex-col">
          <a
            v-if="safeHref(item.href)"
            :href="safeHref(item.href) ?? undefined"
            :target="external(item.href) ? '_blank' : undefined"
            :rel="external(item.href) ? 'noopener noreferrer' : undefined"
            class="truncate text-body-sm text-(--text-link) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
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
            v-if="item.description"
            class="truncate text-body-xs text-(--text-muted)"
          >
            {{ item.description }}
          </span>
        </span>
      </li>
    </ol>
  </div>
</template>

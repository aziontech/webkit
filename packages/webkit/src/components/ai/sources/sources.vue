<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, useAttrs, useId } from 'vue'

  import { useControllable } from '../../../composables/use-controllable'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import type { AiSource } from './types'
  import { sourceAnchor } from './types'

  export type { AiSource }

  defineOptions({
    name: 'Sources',
    inheritAttrs: false
  })

  interface Props {
    /** The sources behind the response, in citation order; item `n` is what `[n]` points at. */
    items?: AiSource[]
    /** Id prefix of the list items (`<anchor>-source-<n>`); pass the same value to `StreamingResponse` so its citations link here. */
    anchor?: string
    /** Heading of the disclosure. Empty uses the locale catalog (`3 sources`). */
    title?: string
    /** Controlled open state. Use with `v-model:open`. */
    open?: boolean
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    anchor: '',
    title: '',
    open: undefined,
    defaultOpen: false
  })

  const emit = defineEmits<{
    /** The list was expanded or collapsed. */
    'update:open': [value: boolean]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ sources: en.sources })
  const uid = useId()
  const panelId = `${uid}-panel`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-sources'
  )
  const prefix = computed<string>(() => props.anchor || uid)
  const heading = computed<string>(
    () => props.title || t('sources.count', { count: props.items.length })
  )

  const openProp = computed(() => props.open)
  const isOpen = useControllable<boolean>({
    prop: openProp,
    defaultProp: props.defaultOpen,
    onChange: (value: boolean) => emit('update:open', value)
  })

  function toggle(): void {
    isOpen.set(!isOpen.value)
  }

  function external(href?: string): boolean {
    return Boolean(href && /^https?:\/\//i.test(href))
  }

  function onHashChange(): void {
    if (typeof window === 'undefined') return
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (!hash.startsWith(`${prefix.value}-source-`)) return
    isOpen.set(true)
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'nearest' }))
  }

  onMounted(() => window.addEventListener('hashchange', onHashChange))
  onBeforeUnmount(() => window.removeEventListener('hashchange', onHashChange))
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
      class="inline-flex w-fit items-center gap-(--spacing-xs) rounded-(--shape-elements) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      @click="toggle"
    >
      <i
        class="pi pi-book"
        aria-hidden="true"
      />
      <span>{{ heading }}</span>
      <i
        :data-state="isOpen ? 'open' : 'closed'"
        class="pi pi-chevron-down text-body-xs transition-transform duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-180"
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
        class="flex items-start gap-(--spacing-xs) rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      >
        <span
          aria-hidden="true"
          class="inline-flex min-w-5 shrink-0 items-center justify-center rounded-(--shape-elements) bg-(--bg-surface-raised) px-1 text-label-sm text-(--text-muted)"
        >
          {{ i + 1 }}
        </span>
        <span class="flex min-w-0 flex-col">
          <a
            v-if="item.href"
            :href="item.href"
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

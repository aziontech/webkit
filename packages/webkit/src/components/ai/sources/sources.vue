<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { LocaleInjectionKey, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import DropdownMenu from '../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import SourcesMark from './parts/sources-mark.vue'
  import type { SourcesItem } from './types'
  import { sourceCited, sourceMeta } from './types'

  export type { SourcesItem }

  defineOptions({
    name: 'Sources',
    inheritAttrs: false
  })

  export interface SourcesProps {
    /** The sources behind the response, in citation order; item `n` is what `[n]` points at. */
    items?: SourcesItem[]
    /** Label of the pill that opens the panel. Empty shows `Sources` and names the pill with the count (`3 sources`). */
    title?: string
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<SourcesProps>(), {
    items: () => [],
    title: '',
    defaultOpen: false
  })

  /** Controlled open state of the panel. Use with `v-model:open`; while unbound it follows `defaultOpen` and toggles locally. */
  const open = defineModel<boolean>('open', { default: undefined as never })

  interface SourcesRow {
    index: number
    item: SourcesItem
    href: string
    external: boolean
    meta: string
  }

  interface SourcesGroup {
    key: 'cited' | 'more'
    label: string
    rows: SourcesRow[]
  }

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ sources: en.sources })
  const context = inject(LocaleInjectionKey, null)

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'sources')
  const heading = computed<string>(() => props.title || t('sources.label'))
  const triggerName = computed<string | undefined>(() =>
    props.title ? undefined : t('sources.count', { count: props.items.length })
  )
  const marks = computed<SourcesItem[]>(() => {
    const cited = props.items.filter(sourceCited)
    return (cited.length ? cited : props.items).slice(0, 3)
  })

  const rows = computed<SourcesRow[]>(() =>
    props.items.map((item, index) => {
      const href = safeHref(item.href) ?? ''
      return {
        index,
        item,
        href,
        external: /^https?:\/\//i.test(href),
        meta: sourceMeta(item, locale.value, context?.timeZone?.value)
      }
    })
  )

  const groups = computed<SourcesGroup[]>(() => {
    const all: SourcesGroup[] = [
      {
        key: 'cited',
        label: t('sources.cited'),
        rows: rows.value.filter((row) => sourceCited(row.item))
      },
      {
        key: 'more',
        label: t('sources.more'),
        rows: rows.value.filter((row) => !sourceCited(row.item))
      }
    ]
    return all.filter((group) => group.rows.length)
  })
  const grouped = computed<boolean>(() => groups.value.length > 1)

  const isOpen = computed<boolean>(() => open.value ?? props.defaultOpen)

  function setOpen(value: boolean): void {
    open.value = value
  }

  const TRIGGER_CLASS =
    'relative inline-flex h-8 w-fit shrink-0 items-center gap-(--spacing-xs) whitespace-nowrap rounded-(--shape-control) ps-(--spacing-2xs) pe-(--spacing-sm) text-label-md text-(--text-muted) ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) hover:text-(--text-default) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[state=open]:bg-(--bg-hover) data-[state=open]:text-(--text-default)'
</script>

<template>
  <div
    v-if="items.length"
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    class="contents"
  >
    <DropdownMenu
      :open="isOpen"
      side="auto"
      align="start"
      :data-testid="`${testId}__menu`"
      class="shrink-0"
      @update:open="setOpen"
    >
      <DropdownMenuTrigger :data-testid="`${testId}__host`">
        <button
          type="button"
          :aria-label="triggerName"
          :data-testid="`${testId}__trigger`"
          :data-state="isOpen ? 'open' : 'closed'"
          :class="TRIGGER_CLASS"
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
      </DropdownMenuTrigger>
      <DropdownMenuGroup
        v-for="group in groups"
        :key="group.key"
        :label="grouped ? group.label : ''"
        :data-testid="`${testId}__group`"
      >
        <DropdownMenuItem
          v-for="row in group.rows"
          :key="`${row.index}-${row.item.title}`"
          :value="row.index"
          :label="row.item.title"
          :href="row.href"
          :target="row.external ? '_blank' : '_self'"
          :description="row.meta"
          :data-testid="`${testId}__item`"
        >
          <template #leading>
            <SourcesMark
              :item="row.item"
              size="medium"
            />
          </template>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenu>
  </div>
</template>

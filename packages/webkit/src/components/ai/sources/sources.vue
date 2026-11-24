<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'
  import SourcesItemPart from './parts/sources-item.vue'
  import SourcesMark from './parts/sources-mark.vue'
  import type { SourcesItem } from './types'
  import { sourceCited } from './types'

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

  interface SourcesGroup {
    key: 'cited' | 'more'
    id: string
    label: string
    items: SourcesItem[]
  }

  const attrs = useAttrs()
  const uid = useId()
  const { t } = useTranslate({ sources: en.sources })

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'sources')
  const heading = computed<string>(() => props.title || t('sources.label'))
  const triggerName = computed<string | undefined>(() =>
    props.title ? undefined : t('sources.count', { count: props.items.length })
  )
  const marks = computed<SourcesItem[]>(() => {
    const cited = props.items.filter(sourceCited)
    return (cited.length ? cited : props.items).slice(0, 3)
  })

  const groups = computed<SourcesGroup[]>(() => {
    const all: SourcesGroup[] = [
      {
        key: 'cited',
        id: `${uid}-cited`,
        label: t('sources.cited'),
        items: props.items.filter(sourceCited)
      },
      {
        key: 'more',
        id: `${uid}-more`,
        label: t('sources.more'),
        items: props.items.filter((item) => !sourceCited(item))
      }
    ]
    return all.filter((group) => group.items.length)
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

  const ITEM_CLASS =
    'rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-sm) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none has-[a:hover]:bg-(--bg-hover)'
</script>

<template>
  <div
    v-if="items.length"
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    class="contents"
  >
    <Popover
      :open="isOpen"
      side="auto"
      align="start"
      size="small"
      :data-testid="`${testId}__popover`"
      class="shrink-0"
      @update:open="setOpen"
    >
      <PopoverTrigger :data-testid="`${testId}__host`">
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
      </PopoverTrigger>
      <PopoverContent :data-testid="`${testId}__content`">
        <section
          v-for="group in groups"
          :key="group.key"
          :aria-label="grouped ? undefined : t('sources.label')"
          :aria-labelledby="grouped ? group.id : undefined"
          :data-testid="`${testId}__group`"
          class="flex flex-col p-(--spacing-xs) not-first:border-t not-first:border-(--border-default)"
        >
          <h3
            v-if="grouped"
            :id="group.id"
            class="m-0 px-(--spacing-xs) pt-(--spacing-xs) text-label-sm text-(--text-muted)"
          >
            {{ group.label }}
          </h3>
          <ol
            :data-testid="`${testId}__list`"
            data-slot="sources-list"
            class="m-0 flex list-none flex-col p-0"
          >
            <li
              v-for="(item, i) in group.items"
              :key="`${i}-${item.title}`"
              :class="ITEM_CLASS"
            >
              <SourcesItemPart
                :item="item"
                show-description
                :data-testid="`${testId}__item`"
              />
            </li>
          </ol>
        </section>
      </PopoverContent>
    </Popover>
  </div>
</template>

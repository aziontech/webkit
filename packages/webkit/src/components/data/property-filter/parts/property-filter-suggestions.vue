<script setup lang="ts">
  import { computed, ref } from 'vue'

  import { usePlacement } from '../../../../composables/use-placement'
  import { usePortalLocale, useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Spinner from '../../../feedback/spinner/spinner.vue'
  import { groupSections, type Suggestion } from '../lib/suggestion'

  defineOptions({ name: 'PropertyFilterSuggestions', inheritAttrs: false })

  interface Props {
    /** Field the list opens under. */
    anchor: HTMLElement | null
    /** Rows of the list, in order. */
    suggestions: Suggestion[]
    /** Index of the highlighted row, -1 for none. */
    active: number
    /** The list is shown. */
    open: boolean
    /** Status row of remotely loaded values. */
    valueRows: 'loading' | 'error' | null
    /** Id of the list element. */
    listId: string
    /** Prefix of the row and section ids. */
    uid: string
    /** Test id of the filter. */
    testId: string
  }

  const props = defineProps<Props>()

  const { t, locale } = useTranslate({ propertyFilter: en.propertyFilter })
  const portalLocale = usePortalLocale()
  const panelEl = ref<HTMLElement | null>(null)

  const sections = computed(() => groupSections(props.suggestions, props.uid, t))
  const numberFormat = computed(() => new Intl.NumberFormat(locale.value))

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: () => props.anchor,
    panelRef: panelEl,
    isOpen: () => props.open,
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    matchTriggerWidth: true
  })

  const groupLabel = (group: Suggestion['group']): string => {
    if (group === 'properties') return t('propertyFilter.properties')
    if (group === 'values') return t('propertyFilter.values')
    if (group === 'fields') return t('propertyFilter.queryFields')
    return ''
  }

  const SUGGESTIONS_CLASS =
    'fixed z-(--z-control-overlay) flex max-h-80 flex-col gap-(--spacing-2xs) overflow-y-auto overscroll-contain rounded-(--shape-control) border border-(--border-default) ' +
    'bg-(--bg-surface-raised) p-(--spacing-2xs) shadow-(--shadow-xs)'

  const OPTION_CLASS =
    'flex min-h-8 cursor-pointer items-center gap-(--spacing-sm) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 px-(--spacing-sm) py-(--spacing-2xs) text-start text-label-sm text-(--text-default) transition-colors duration-150 ease-out ' +
    'hover:bg-(--bg-hover) ' +
    'data-[active]:bg-(--bg-hover) ' +
    'motion-reduce:transition-none pointer-coarse:min-h-11'
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <ul
        v-show="open"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :id="listId"
        ref="panelEl"
        role="listbox"
        :aria-label="t('propertyFilter.suggestions')"
        :aria-busy="valueRows === 'loading' || undefined"
        :data-testid="`${testId}__suggestions`"
        :data-side="resolvedSide"
        :data-align="resolvedAlign"
        :style="panelStyle"
        :class="SUGGESTIONS_CLASS"
      >
        <li
          v-for="section in sections"
          :key="section.id"
          role="presentation"
          class="flex flex-col gap-(--spacing-2xs)"
        >
          <span
            v-if="section.title"
            :id="section.id"
            :data-testid="`${testId}__section`"
            class="flex min-h-7 items-center px-(--spacing-sm) text-label-sm text-(--text-muted)"
            >{{ section.title }}</span
          >
          <ul
            :role="section.title ? 'group' : 'presentation'"
            :aria-labelledby="section.title ? section.id : undefined"
            class="m-0 flex list-none flex-col p-0"
          >
            <li
              v-for="{ item, index } in section.items"
              :id="`${uid}-option-${index}`"
              :key="item.id"
              role="option"
              tabindex="-1"
              :aria-selected="index === active"
              :data-active="index === active || null"
              :data-group="item.group"
              :data-testid="`${testId}__option`"
              :class="OPTION_CLASS"
              @mousedown.prevent
              @click="item.apply()"
              @keydown.enter.prevent="item.apply()"
            >
              <span class="min-w-0 flex-1 truncate"
                ><bdi>{{ item.label }}</bdi></span
              >
              <span
                v-if="item.count !== undefined"
                :data-testid="`${testId}__count-value`"
                class="shrink-0 text-label-sm text-(--text-muted) tabular-nums"
                >{{ numberFormat.format(item.count) }}</span
              >
              <span
                v-if="item.description"
                class="shrink-0 text-(--text-muted)"
                >{{ item.description }}</span
              >
              <span
                v-else-if="groupLabel(item.group)"
                class="shrink-0 text-label-sm text-(--text-muted)"
                >{{ groupLabel(item.group) }}</span
              >
            </li>
          </ul>
        </li>
        <li
          v-if="valueRows === 'loading'"
          role="presentation"
          :data-testid="`${testId}__loading`"
          class="flex min-h-8 items-center gap-(--spacing-sm) px-(--spacing-sm) text-body-sm text-(--text-muted)"
        >
          <Spinner class="size-3.5" />
          {{ t('propertyFilter.loadingValues') }}
        </li>
        <li
          v-else-if="valueRows === 'error'"
          role="presentation"
          :data-testid="`${testId}__values-error`"
          class="flex min-h-8 items-center gap-(--spacing-sm) px-(--spacing-sm) text-body-sm text-(--text-default)"
        >
          <i
            class="az az-circle-alert shrink-0 text-(--danger)"
            aria-hidden="true"
          />
          {{ t('propertyFilter.valuesError') }}
        </li>
      </ul>
    </Transition>
  </Teleport>
</template>

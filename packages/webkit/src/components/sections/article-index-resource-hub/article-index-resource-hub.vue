<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Input from '../../inputs/input/input.vue'
  import Select from '../../inputs/select/select.vue'
  import SelectContent from '../../inputs/select/select-content/select-content.vue'
  import SelectOption from '../../inputs/select/select-option/select-option.vue'
  import SelectTrigger from '../../inputs/select/select-trigger/select-trigger.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'ArticleIndexResourceHub',
    inheritAttrs: false
  })

  /** The client mark drawn in the cover cell of a row that has no cover. */
  export type ArticleIndexResourceHubMark = {
    /** The client's name, the mark's alternative text. */
    name: string
    /** URL of the client's logo, drawn in one ink that follows the theme. */
    logo: string
  }

  /** One resource, rendered as a linked row. */
  export type ArticleIndexResourceHubItem = {
    /** Stable identity of the resource within the list. */
    key: string
    /** Destination of the resource. */
    href: string
    /** URL of the cover drawn at the start of the row. */
    image?: string
    /** Client mark drawn in the cover cell when there is no cover. */
    mark?: ArticleIndexResourceHubMark
    /** Overline, usually the content type and the date. */
    meta: string
    /** Headline of the resource, naming the row link. */
    title: string
    /** Deck under the headline, clamped to two lines. */
    description?: string
    /** The values the resource carries per facet key. */
    facets?: Record<string, string[]>
    /** Opens the destination in a new tab. */
    external?: boolean
  }

  /** One facet, rendered as a searchable dropdown. */
  export type ArticleIndexResourceHubFacet = {
    /** Key matched against each resource's facets. */
    key: string
    /** Accessible name of the dropdown. */
    label: string
    /** The first option, selected on load, which keeps every resource. */
    allLabel: string
    /** The options after the show-all one, in order. */
    options: string[]
  }

  /** The state rendered when nothing matches. */
  export type ArticleIndexResourceHubEmpty = {
    /** Headline of the empty state. */
    title: string
    /** Sentence under the headline. */
    description?: string
    /** Label of the button that resets every facet. */
    action?: string
  }

  /** Row layout: centered centres the copy, byline spreads it to the foot of the row. */
  export type ArticleIndexResourceHubRowKind = 'centered' | 'byline'

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline beside the dropdowns, rendered as the band's `h2`. */
    title?: string
    /** The resources, in order; each is `{ key, href, image?, mark?, meta, title, description?, facets?, external? }`. */
    items?: ArticleIndexResourceHubItem[]
    /** The facet dropdowns, in order; each is `{ key, label, allLabel, options }`. */
    facets?: ArticleIndexResourceHubFacet[]
    /** Read cue revealed at the end of a row under hover or focus. */
    rowLabel?: string
    /** Label of the load-more button under the list; without it every match is listed and no button renders. */
    moreLabel?: string
    /** Rows listed per page when `moreLabel` is set; the load-more button reveals the next page. */
    pageSize?: number
    /** Leading resources left out until a facet applies, because a band above already shows them. */
    leading?: number
    /** Copy of the state when nothing matches: `{ title, description?, action? }`; `action` labels a button that resets every facet. */
    empty?: ArticleIndexResourceHubEmpty
    /** Row layout: `centered` centres the copy, `byline` spreads it to the foot of the row. */
    rowKind?: ArticleIndexResourceHubRowKind
    /** Accessible name of the list of resources. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    items: () => [],
    facets: () => [],
    rowLabel: '',
    moreLabel: '',
    pageSize: 12,
    leading: 0,
    empty: undefined,
    rowKind: 'centered',
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ articleIndex: en.articleIndex })

  const selection = ref<Record<string, string>>({})

  const optionQuery = ref<Record<string, string>>({})

  const pages = ref(1)

  const SEARCH_THRESHOLD = 7

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-index-resource-hub'
  )

  const valueOf = (facet: ArticleIndexResourceHubFacet): string =>
    selection.value[facet.key] ?? facet.allLabel

  const filtering = computed(() => props.facets.some((facet) => valueOf(facet) !== facet.allLabel))

  const matches = computed(() =>
    (filtering.value ? props.items : props.items.slice(props.leading)).filter((item) =>
      props.facets.every((facet) => {
        const value = valueOf(facet)
        return value === facet.allLabel || (item.facets?.[facet.key] ?? []).includes(value)
      })
    )
  )

  const paged = computed(() => props.moreLabel.length > 0 && props.pageSize > 0)

  const visible = computed(() =>
    paged.value ? matches.value.slice(0, pages.value * props.pageSize) : matches.value
  )

  const hasMore = computed(() => paged.value && visible.value.length < matches.value.length)

  watch(selection, () => {
    pages.value = 1
  })

  const searchable = (facet: ArticleIndexResourceHubFacet): boolean =>
    facet.options.length > SEARCH_THRESHOLD

  const clearFilters = (): void => {
    selection.value = {}
  }

  const optionsOf = (facet: ArticleIndexResourceHubFacet): string[] => {
    const term = (optionQuery.value[facet.key] ?? '').trim().toLowerCase()
    return facet.options.filter((option) => option.toLowerCase().includes(term))
  }

  const select = (facet: ArticleIndexResourceHubFacet, value: unknown): void => {
    selection.value = {
      ...selection.value,
      [facet.key]: typeof value === 'string' ? value : facet.allLabel
    }
  }

  const resetOptionQuery = (key: string): void => {
    optionQuery.value = { ...optionQuery.value, [key]: '' }
  }

  const setOptionQuery = (key: string, value: string): void => {
    optionQuery.value = { ...optionQuery.value, [key]: value }
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        key="toolbar"
        v-if="title || facets.length > 0"
        flush
        borders="y"
        marks="none"
      >
        <div
          role="search"
          class="flex flex-col gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:flex-row lg:items-center lg:justify-between"
        >
          <h2
            v-if="title"
            class="m-0 text-heading-md text-(--text-default)"
          >
            {{ title }}
          </h2>

          <div
            v-if="facets.length > 0"
            class="flex flex-col gap-(--spacing-sm) sm:flex-row sm:flex-wrap"
          >
            <Select
              v-for="facet in facets"
              :key="facet.key"
              :model-value="valueOf(facet)"
              size="medium"
              class="w-full sm:w-56"
              @update:model-value="select(facet, $event)"
              @update:open="resetOptionQuery(facet.key)"
            >
              <SelectTrigger :aria-label="facet.label" />
              <SelectContent>
                <template
                  v-if="searchable(facet)"
                  #search
                >
                  <Input
                    :model-value="optionQuery[facet.key] ?? ''"
                    size="small"
                    :placeholder="t('articleIndex.search')"
                    :aria-label="
                      t('articleIndex.searchFacet', { facet: facet.label.toLowerCase() })
                    "
                    @update:model-value="setOptionQuery(facet.key, $event)"
                  >
                    <template #prefix>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </template>
                <SelectOption :value="facet.allLabel">
                  {{ facet.allLabel }}
                </SelectOption>
                <SelectOption
                  v-for="option in optionsOf(facet)"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </SelectOption>
                <p
                  v-if="optionsOf(facet).length === 0"
                  role="status"
                  class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
                >
                  {{ t('articleIndex.empty') }}
                </p>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FrameBox>

      <template v-if="visible.length > 0">
        <FrameBox
          key="rows"
          flush
          borders="y"
          marks="bottom"
        >
          <ul
            :aria-label="ariaLabel || undefined"
            :data-kind="rowKind"
            class="group/rows m-0 flex list-none flex-col p-0"
          >
            <li
              v-for="(item, index) in visible"
              :key="item.key"
            >
              <div
                v-if="index > 0"
                aria-hidden="true"
                class="h-(--spacing-lg) border-y border-(--border-default)"
              />
              <article
                class="group/row relative grid transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)]"
              >
                <div
                  class="flex aspect-40/21 items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface) lg:border-e lg:border-b-0"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    alt=""
                    loading="lazy"
                    class="size-full object-cover"
                  />
                  <img
                    v-else-if="item.mark"
                    :src="item.mark.logo"
                    :alt="item.mark.name"
                    loading="lazy"
                    class="h-8 w-auto max-w-40 object-contain brightness-0 [[data-theme=dark]_&]:invert"
                  />
                </div>
                <div class="flex min-w-0 gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-lg)">
                  <div
                    class="flex min-w-0 flex-1 flex-col justify-between gap-(--spacing-sm) group-data-[kind=centered]/rows:justify-center"
                  >
                    <div class="flex flex-col gap-(--spacing-sm)">
                      <span class="text-overline-sm text-(--text-muted)">{{ item.meta }}</span>
                      <h3 class="m-0">
                        <a
                          :href="item.href"
                          :target="item.external ? '_blank' : undefined"
                          :rel="item.external ? 'noopener' : undefined"
                          class="text-pretty text-heading-sm text-(--text-default) no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                        >
                          {{ item.title }}
                          <span
                            v-if="item.external"
                            class="sr-only"
                            >{{ t('articleIndex.newTab') }}</span
                          >
                        </a>
                      </h3>
                      <p
                        v-if="item.description"
                        class="m-0 text-pretty text-body-lg text-(--text-muted)"
                      >
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                  <span
                    v-if="rowLabel"
                    aria-hidden="true"
                    class="flex shrink-0 translate-y-1 items-center self-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md text-(--text-default) uppercase opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/row:translate-y-0 group-hover/row:opacity-100 group-has-[a:focus-visible]/row:translate-y-0 group-has-[a:focus-visible]/row:opacity-100 motion-reduce:transition-none max-lg:hidden"
                  >
                    {{ rowLabel }}
                    <i class="pi pi-arrow-up-right leading-none" />
                  </span>
                </div>
              </article>
            </li>
          </ul>
        </FrameBox>

        <FrameBox
          v-if="hasMore"
          flush
          borders="y"
          marks="bottom"
        >
          <div class="flex justify-center p-(--spacing-xl)">
            <Button
              :label="moreLabel"
              kind="outlined"
              size="large"
              @click="pages += 1"
            />
          </div>
        </FrameBox>
      </template>

      <FrameBox
        v-else-if="empty"
        key="empty"
        flush
        borders="y"
        marks="bottom"
      >
        <EmptyState
          :title="empty.title"
          :description="empty.description"
          icon="pi pi-search"
          class="p-(--spacing-xxl)"
        >
          <template
            v-if="empty.action"
            #actions
          >
            <Button
              :label="empty.action"
              kind="secondary"
              size="large"
              @click="clearFilters"
            />
          </template>
        </EmptyState>
      </FrameBox>
    </SectionModule>
  </section>
</template>

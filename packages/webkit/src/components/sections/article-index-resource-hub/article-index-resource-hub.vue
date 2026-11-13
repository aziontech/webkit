<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import InputText from '../../inputs/input-text/input-text.vue'
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

  /** One resource, rendered as a linked row. */
  export type ArticleIndexResourceHubItem = {
    /** Stable identity of the resource within the list. */
    key: string
    /** Destination of the resource. */
    href: string
    /** URL of the cover drawn at the start of the row. */
    image: string
    /** Overline, usually the content type and the date. */
    meta: string
    /** Headline of the resource, naming the row link. */
    title: string
    /** Deck under the headline, clamped to two lines. */
    description: string
    /** The values the resource carries per facet key. */
    facets?: Record<string, string[]>
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

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline beside the dropdowns, rendered as the band's `h2`. */
    title?: string
    /** The resources, in order; each is `{ key, href, image, meta, title, description, facets? }`. */
    items?: ArticleIndexResourceHubItem[]
    /** The facet dropdowns, in order; each is `{ key, label, allLabel, options }`. */
    facets?: ArticleIndexResourceHubFacet[]
    /** Read cue revealed at the end of a row under hover or focus. */
    rowLabel?: string
    /** Label of the load-more button under the list; the button is omitted when empty. */
    moreLabel?: string
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
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const selection = ref<Record<string, string>>({})

  const optionQuery = ref<Record<string, string>>({})

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-index-resource-hub'
  )

  const valueOf = (facet: ArticleIndexResourceHubFacet): string =>
    selection.value[facet.key] ?? facet.allLabel

  const matches = computed(() =>
    props.items.filter((item) =>
      props.facets.every((facet) => {
        const value = valueOf(facet)
        return value === facet.allLabel || (item.facets?.[facet.key] ?? []).includes(value)
      })
    )
  )

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
            class="flex flex-col gap-(--spacing-sm) sm:flex-row"
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
                <template #search>
                  <InputText
                    :model-value="optionQuery[facet.key] ?? ''"
                    size="small"
                    placeholder="Search"
                    :aria-label="`Search ${facet.label.toLowerCase()}`"
                    @update:model-value="setOptionQuery(facet.key, $event)"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </InputText>
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
                  No results found
                </p>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FrameBox>

      <template v-if="matches.length > 0">
        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <ul
            :aria-label="ariaLabel || undefined"
            data-kind="centered"
            class="group/rows m-0 flex list-none flex-col p-0"
          >
            <li
              v-for="(item, index) in matches"
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
                  class="flex aspect-40/21 items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface) lg:border-r lg:border-b-0"
                >
                  <img
                    :src="item.image"
                    alt=""
                    loading="lazy"
                    class="size-full object-cover"
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
                          class="text-pretty text-heading-sm text-(--text-default) no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                        >
                          {{ item.title }}
                        </a>
                      </h3>
                      <p class="m-0 line-clamp-2 text-pretty text-body-sm text-(--text-muted)">
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
          v-if="moreLabel"
          flush
          borders="y"
          marks="bottom"
        >
          <div class="flex justify-center p-(--spacing-xl)">
            <Button
              :label="moreLabel"
              kind="outlined"
              size="large"
            />
          </div>
        </FrameBox>
      </template>
    </SectionModule>
  </section>
</template>

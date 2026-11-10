<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import InputText from '../../inputs/input-text/input-text.vue'
  import Select from '../../inputs/select/select.vue'
  import SelectContent from '../../inputs/select/select-content/select-content.vue'
  import SelectOption from '../../inputs/select/select-option/select-option.vue'
  import SelectTrigger from '../../inputs/select/select-trigger/select-trigger.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'StoryLibrary',
    inheritAttrs: false
  })

  /** The client a story is about. */
  export type StoryLibraryClient = {
    /** The client's name, naming the card. */
    name: string
    /** URL of the client's mark, drawn in a single ink that follows the theme. */
    logo: string
  }

  /** One success story, rendered as a linked card. */
  export type StoryLibraryItem = {
    /** Stable identity of the story within the library. */
    key: string
    /** Destination of the story. */
    href: string
    /** The client the story is about. */
    client: StoryLibraryClient
    /** Overline of the card, usually the industry. */
    category: string
    /** One or two sentences on the story. */
    description: string
    /** The values the story carries per facet key. */
    facets?: Record<string, string[]>
  }

  /** One option of a facet select. */
  export type StoryLibraryFacetOption = {
    /** Value matched against the stories' facet values. */
    value: string
    /** Visible label of the option. */
    label: string
  }

  /** One facet, rendered as a searchable select. */
  export type StoryLibraryFacet = {
    /** Key matched against each story's facets. */
    key: string
    /** Accessible name of the select. */
    label: string
    /** Placeholder shown while no value is selected. */
    allLabel: string
    /** The options, in order. */
    options: StoryLibraryFacetOption[]
  }

  /** The search field. */
  export type StoryLibrarySearch = {
    /** Placeholder of the field. */
    placeholder: string
    /** Accessible name of the field. */
    label: string
  }

  /** The no-match state. */
  export type StoryLibraryEmpty = {
    /** Message of the empty state. */
    title: string
    /** Label of the button that clears every filter. */
    action: string
  }

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline of the band, rendered left-aligned as its `h2`; the band renders no header when empty. */
    title?: string
    /** The stories, in order; each is `{ key, href, client, category, description, facets? }`. */
    items?: StoryLibraryItem[]
    /** The facet selects, in order; each is `{ key, label, allLabel, options }`. */
    facets?: StoryLibraryFacet[]
    /** The search field's `placeholder` and accessible `label`; the field is omitted when absent. */
    search?: StoryLibrarySearch
    /** The no-match state's `title` and the `action` label of its clear-filters button. */
    empty?: StoryLibraryEmpty
    /** Read cue at the foot of each card, also the lead of its accessible name. */
    linkLabel?: string
    /** Label of the load-more button under the grid; the button is omitted when empty. */
    moreLabel?: string
    /** Accessible name of the list of stories. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    title: '',
    items: () => [],
    facets: () => [],
    search: undefined,
    empty: undefined,
    linkLabel: '',
    moreLabel: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const query = ref('')

  const selection = ref<Record<string, string | undefined>>({})

  const optionQuery = ref<Record<string, string>>({})

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-story-library'
  )

  const hasTitle = computed(() => props.title.length > 0)

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    return props.items.filter((item) => {
      if (
        term &&
        !item.client.name.toLowerCase().includes(term) &&
        !item.description.toLowerCase().includes(term)
      ) {
        return false
      }
      return props.facets.every((facet) => {
        const value = selection.value[facet.key]
        return value === undefined || (item.facets?.[facet.key] ?? []).includes(value)
      })
    })
  })

  const optionsOf = (facet: StoryLibraryFacet): StoryLibraryFacetOption[] => {
    const term = (optionQuery.value[facet.key] ?? '').trim().toLowerCase()
    return facet.options.filter((option) => option.label.toLowerCase().includes(term))
  }

  const lastRowFrom = (columns: number): number =>
    matches.value.length - (((matches.value.length - 1) % columns) + 1)

  const select = (key: string, value: unknown): void => {
    selection.value = { ...selection.value, [key]: typeof value === 'string' ? value : undefined }
  }

  const resetOptionQuery = (key: string): void => {
    optionQuery.value = { ...optionQuery.value, [key]: '' }
  }

  const setOptionQuery = (key: string, value: string): void => {
    optionQuery.value = { ...optionQuery.value, [key]: value }
  }

  const clear = (): void => {
    query.value = ''
    selection.value = {}
  }

  const cardLabel = (item: StoryLibraryItem): string =>
    props.linkLabel ? `${props.linkLabel}: ${item.client.name}` : item.client.name
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
      <template
        v-if="hasTitle"
        #header
      >
        <SectionTitle
          kind="left"
          :title="title"
        />
      </template>

      <FrameBox
        key="frame-box-1"
        v-if="search || facets.length > 0"
        flush
        borders="y"
      >
        <div
          role="search"
          class="grid items-center gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))]"
        >
          <InputText
            v-if="search"
            v-model="query"
            size="large"
            type="text"
            :placeholder="search.placeholder"
            :aria-label="search.label"
          >
            <template #iconLeft>
              <i class="pi pi-search text-(--text-muted)" />
            </template>
          </InputText>
          <Select
            v-for="facet in facets"
            :key="facet.key"
            :model-value="selection[facet.key]"
            size="large"
            :placeholder="facet.allLabel"
            @update:model-value="select(facet.key, $event)"
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
              <SelectOption
                v-for="option in optionsOf(facet)"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
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
      </FrameBox>

      <template v-if="matches.length > 0">
        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <ul
            class="m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-3"
            :aria-label="ariaLabel || undefined"
          >
            <li
              v-for="(item, index) in matches"
              :key="item.key"
              :data-last-row-sm="index >= lastRowFrom(2) || undefined"
              :data-last-row-lg="index >= lastRowFrom(3) || undefined"
              class="border-b border-(--border-default) last:border-b-0 sm:border-r sm:max-lg:even:border-r-0 sm:max-lg:data-last-row-sm:border-b-0 lg:nth-[3n]:border-r-0 lg:data-last-row-lg:border-b-0"
            >
              <a
                :href="item.href"
                :aria-label="cardLabel(item)"
                class="group/card flex h-full flex-col gap-(--spacing-lg) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              >
                <span class="flex h-8 items-center">
                  <img
                    :src="item.client.logo"
                    alt=""
                    class="brightness-0 [[data-theme=dark]_&]:invert h-full w-auto max-w-36 object-contain object-left"
                  />
                </span>
                <span class="text-overline-sm text-(--text-muted)">{{ item.category }}</span>
                <span class="text-pretty text-body-sm text-(--text-muted)">
                  {{ item.description }}
                </span>
                <span
                  v-if="linkLabel"
                  aria-hidden="true"
                  class="mt-auto flex items-center gap-(--spacing-xxs) pt-(--spacing-sm) text-overline-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance group-hover/card:text-(--text-default) motion-reduce:transition-none"
                >
                  {{ linkLabel }}
                  <i
                    class="pi pi-arrow-up-right text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </a>
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

      <FrameBox
        key="frame-box-3"
        v-else-if="empty"
        flush
        borders="y"
        marks="bottom"
      >
        <EmptyState
          :title="empty.title"
          icon="pi pi-search"
          class="p-(--spacing-xxl)"
        >
          <template #actions>
            <Button
              :label="empty.action"
              kind="secondary"
              size="large"
              @click="clear"
            />
          </template>
        </EmptyState>
      </FrameBox>
    </SectionModule>
  </section>
</template>

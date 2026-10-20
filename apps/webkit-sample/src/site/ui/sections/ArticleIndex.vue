<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import InputText from '@aziontech/webkit/input-text'
  import ItemActions from '@aziontech/webkit/item-actions'
  import ItemContent from '@aziontech/webkit/item-content'
  import ItemList from '@aziontech/webkit/item-list'
  import Item from '@aziontech/webkit/item-root'
  import ItemTitle from '@aziontech/webkit/item-title'
  import SectionModule from '@aziontech/webkit/section-module'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { useSiteLink } from '../../composables/use-site-link'

  defineOptions({ name: 'ArticleIndex' })

  export interface ArticleIndexAuthor {
    /** The writer's name. */
    name: string
    /** Photo URL; without one the avatar shows initials. */
    avatar?: string
  }

  export interface ArticleIndexItem {
    /** Stable key of the article. */
    key: string
    /** Destination of the article. */
    href: string
    /** The article's headline. */
    title: string
    /** The article's deck, matched by the search. */
    description: string
    /** Categories the article is filed under. */
    categories: string[]
    /** Overline above the title: category and date. */
    meta: string
    /** The writers, drawn as overlapping photos. */
    authors?: ArticleIndexAuthor[]
    /** Byline beside the photos: names and read time. */
    byline?: string
  }

  export interface ArticleIndexSearch {
    /** Placeholder of the search field. */
    placeholder: string
    /** Accessible name of the search field. */
    label: string
  }

  export interface ArticleIndexEmpty {
    /** Headline when nothing matches. */
    title: string
    /** Label of the action that clears every filter. */
    action: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Every article, newest first. */
    items: ArticleIndexItem[]
    /** Categories the reader narrows the list by, in order. */
    categories: string[]
    /** Label of the segment that shows every category. */
    allLabel: string
    /** Accessible name of the category control. */
    categoryLabel?: string
    /** Leading items left out until a filter applies, because a band above already shows them. */
    leading?: number
    /** Copy of the search field. */
    search: ArticleIndexSearch
    /** Label revealed on a row under hover or focus. */
    rowLabel?: string
    /** Label of the action that lists the next page. */
    moreLabel: string
    /** Rows listed per page. */
    pageSize?: number
    /** Copy of the state when nothing matches. */
    empty: ArticleIndexEmpty
    /** Accessible name of the list. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    categoryLabel: 'Category',
    leading: 0,
    rowLabel: 'Read article',
    pageSize: 12,
    ariaLabel: 'Articles'
  })

  const route = useRoute()
  const { follow } = useSiteLink()

  const requested = props.categories.includes(String(route.query.category))
    ? String(route.query.category)
    : props.allLabel

  const selection = reactive({ category: requested, query: '' })
  const shown = ref(props.pageSize)

  const options = computed(() =>
    [props.allLabel, ...props.categories].map((category) => ({ label: category, value: category }))
  )

  const filtering = computed(
    () => selection.category !== props.allLabel || selection.query.trim().length > 0
  )

  const filtered = computed(() => {
    const query = selection.query.trim().toLowerCase()
    return (filtering.value ? props.items : props.items.slice(props.leading)).filter(
      (item) =>
        (selection.category === props.allLabel || item.categories.includes(selection.category)) &&
        (!query || `${item.title} ${item.description}`.toLowerCase().includes(query))
    )
  })

  const visible = computed(() => filtered.value.slice(0, shown.value))
  const hasMore = computed(() => shown.value < filtered.value.length)

  watch(selection, () => {
    shown.value = props.pageSize
  })

  onMounted(async () => {
    if (requested === props.allLabel || !props.anchor) return
    await nextTick()
    globalThis.document?.getElementById(props.anchor)?.scrollIntoView()
  })

  function clearFilters() {
    Object.assign(selection, { category: props.allLabel, query: '' })
  }
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <FrameBox
      flush
      borders="y"
      marks="none"
    >
      <div
        role="search"
        class="flex flex-col gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="min-w-0 overflow-x-auto">
          <SegmentedButton
            v-model="selection.category"
            :options="options"
            :aria-label="categoryLabel"
            size="medium"
          />
        </div>

        <div class="w-full shrink-0 lg:w-(--container-3xs)">
          <InputText
            v-model="selection.query"
            size="medium"
            type="text"
            :placeholder="search.placeholder"
            :aria-label="search.label"
          >
            <template #iconLeft>
              <i class="pi pi-search text-(--text-muted)" />
            </template>
          </InputText>
        </div>
      </div>
    </FrameBox>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <ItemList
        v-if="visible.length > 0"
        :aria-label="ariaLabel"
      >
        <Item
          v-for="item in visible"
          :key="item.key"
          class="group/row relative px-(--spacing-xl)! py-(--spacing-lg)! transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
        >
          <ItemContent class="min-w-0 gap-(--spacing-sm)">
            <span class="text-body-sm text-(--text-muted)">{{ item.meta }}</span>
            <ItemTitle>
              <a
                :href="item.href"
                class="text-pretty text-heading-sm text-(--text-default) after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                @click="follow($event, item.href)"
              >
                {{ item.title }}
              </a>
            </ItemTitle>
            <span
              v-if="item.authors?.length || item.byline"
              class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)"
            >
              <span
                v-if="item.authors?.length"
                class="flex shrink-0 -space-x-(--spacing-xs)"
              >
                <Avatar
                  v-for="person in item.authors"
                  :key="person.name"
                  kind="circle"
                  size="small"
                  :src="person.avatar || undefined"
                  :label="person.avatar ? undefined : person.name"
                  :alt="person.name"
                  class="ring-2 ring-(--bg-canvas)"
                />
              </span>
              <span>{{ item.byline }}</span>
            </span>
          </ItemContent>
          <ItemActions class="max-sm:hidden">
            <span
              aria-hidden="true"
              class="flex translate-y-1 items-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md text-(--text-default) uppercase opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/row:translate-y-0 group-hover/row:opacity-100 group-has-[a:focus-visible]/row:translate-y-0 group-has-[a:focus-visible]/row:opacity-100 motion-reduce:transition-none"
            >
              {{ rowLabel }}
              <i class="pi pi-arrow-up-right leading-none" />
            </span>
          </ItemActions>
        </Item>
      </ItemList>

      <EmptyState
        v-else
        :title="empty.title"
        icon="pi pi-search"
        class="p-(--spacing-xxl)"
      >
        <template #actions>
          <Button
            :label="empty.action"
            kind="secondary"
            size="large"
            @click="clearFilters"
          />
        </template>
      </EmptyState>
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
          @click="shown += pageSize"
        />
      </div>
    </FrameBox>
  </SectionModule>
</template>

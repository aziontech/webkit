<script setup lang="ts">
  import { MONOCHROME_FILTER } from '@aziontech/webkit/assets/client-registry'
  import Avatar from '@aziontech/webkit/avatar'

  import { useSiteLink } from '../composables/use-site-link'

  defineOptions({ name: 'ArticleRows' })

  export interface ArticleRowAuthor {
    /** The writer's name. */
    name: string
    /** Photo URL; without one the avatar shows initials. */
    avatar?: string
  }

  export interface ArticleRowMark {
    /** The client's name, the mark's alternative text. */
    name: string
    /** URL of the client's logo. */
    logo?: string
    /** URL of the logo drawn on the light theme. */
    logoLight?: string
  }

  export interface ArticleRow {
    /** Stable key of the row. */
    key: string
    /** Destination of the article. */
    href: string
    /** Opens the destination in a new tab. */
    external?: boolean
    /** Cover image URL; a row without one draws its client mark instead. */
    image?: string
    /** Client mark drawn in the cover slot when there is no image. */
    mark?: ArticleRowMark | null
    /** Overline above the title. */
    meta: string
    /** The article's headline. */
    title: string
    /** The article's deck, under the headline. */
    description?: string
    /** The writers, drawn as overlapping photos. */
    authors?: ArticleRowAuthor[]
    /** Byline beside the photos: names and read time. */
    byline?: string
  }

  /** Row layout: `byline` pins the writers to the foot of the copy; `centered` centres the copy vertically, for rows with no byline. */
  export type ArticleRowsKind = 'byline' | 'centered'

  interface Props {
    /** Row layout. */
    kind?: ArticleRowsKind
    /** The rows, in order. */
    items: ArticleRow[]
    /** Label revealed on a row under hover or focus. */
    rowLabel?: string
    /** Accessible name of the list. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    kind: 'byline',
    rowLabel: 'Read article',
    ariaLabel: 'Articles'
  })

  const { follow } = useSiteLink()
</script>

<template>
  <!-- Ruled rows, the cover on the left and the copy on the right, with a plain gap between
       rows. The whole row is the link and the hover. -->
  <ul
    :aria-label="ariaLabel"
    :data-kind="kind"
    class="group/rows m-0 flex list-none flex-col p-0"
  >
    <li
      v-for="(item, index) in items"
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
            v-if="item.image"
            :src="item.image"
            alt=""
            loading="lazy"
            class="size-full object-cover"
          />
          <img
            v-else-if="item.mark"
            :src="item.mark.logo || item.mark.logoLight"
            :alt="item.mark.name"
            loading="lazy"
            :class="MONOCHROME_FILTER"
            class="h-8 w-auto max-w-40 object-contain"
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
                  @click="follow($event, item.href)"
                >
                  {{ item.title }}
                </a>
              </h3>
              <p
                v-if="item.description"
                class="m-0 line-clamp-2 text-pretty text-body-sm text-(--text-muted)"
              >
                {{ item.description }}
              </p>
            </div>
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
          </div>
          <span
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
</template>

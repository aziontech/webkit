<script setup lang="ts">
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  import { useSiteLink } from '../../composables/use-site-link'

  defineOptions({ name: 'IllustratedCards' })

  /** linked: a centred, eyebrowed headline over the cards; grouped: the module's own start-aligned title row. */
  export type IllustratedCardsKind = 'linked' | 'grouped'

  interface IllustratedCard {
    /** Registered illustration drawn at the top of the card. */
    illustration: string
    /** The card's heading. */
    title: string
    /** One sentence under the heading. */
    description: string
    /** Destination; when set, the whole card is the link. */
    href?: string
  }

  interface Props {
    /** Layout of the headline. */
    kind?: IllustratedCardsKind
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the headline, in the linked layout. */
    eyebrow?: string
    /** The group's headline. */
    title?: string
    /** One sentence under the headline. */
    description?: string
    /** Draws the rule above the band, when it stacks directly under another group. */
    divided?: boolean
    /** The cards, three to a row. */
    items: IllustratedCard[]
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'linked',
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    divided: false
  })

  const { follow, isInternal } = useSiteLink()

  const spansTwoUp = (index: number) =>
    index === props.items.length - 1 && props.items.length % 2 === 1
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="divided"
    :padded="false"
    :title="kind === 'grouped' ? title : ''"
    :description="kind === 'grouped' ? description : ''"
    class="scroll-mt-(--spacing-xxl)"
  >
    <template
      v-if="kind === 'linked'"
      #header
    >
      <SectionTitle
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      />
    </template>

    <CardGrid
      kind="divider"
      :columns="3"
    >
      <template
        v-for="(item, index) in items"
        :key="item.title"
      >
        <a
          v-if="item.href"
          :href="item.href"
          :target="isInternal(item.href) ? undefined : '_blank'"
          :rel="isInternal(item.href) ? undefined : 'noreferrer'"
          class="group flex min-w-0 flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-lg) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
          @click="follow($event, item.href)"
        >
          <Illustration
            :name="item.illustration"
            :aria-label="`${item.title}: ${item.description}`"
          />
          <div class="flex flex-col gap-(--spacing-xxs)">
            <h3 class="m-0 text-heading-xxs text-(--text-default)">{{ item.title }}</h3>
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">{{ item.description }}</p>
          </div>
        </a>
        <FrameBox
          v-else
          borders="none"
          marks="none"
          :data-span="spansTwoUp(index) || undefined"
          class="min-w-0 bg-(--bg-canvas) data-[span]:sm:col-span-2 data-[span]:lg:col-span-1"
        >
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
            <Illustration
              :name="item.illustration"
              :aria-label="`${item.title}: ${item.description}`"
            />
            <div class="flex flex-col gap-(--spacing-xxs)">
              <h3 class="m-0 text-heading-xxs text-(--text-default)">{{ item.title }}</h3>
              <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
                {{ item.description }}
              </p>
            </div>
          </div>
        </FrameBox>
      </template>
    </CardGrid>
  </SectionModule>
</template>

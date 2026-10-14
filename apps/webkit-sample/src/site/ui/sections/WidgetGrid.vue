<script setup lang="ts">
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGrid from '@aziontech/webkit/bento-grid-root'
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { type Component, ref } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'

  defineOptions({ name: 'WidgetGrid' })

  interface SiteScene {
    /** The scene component the cell presents. */
    component: Component
    /** Props forwarded to the scene. */
    props?: Record<string, unknown>
  }

  export interface WidgetGridItem {
    /** Icon class the page data may carry; the caption does not draw it. */
    icon?: string
    /** The cell's heading. */
    title: string
    /** One or two sentences under the heading. */
    description: string
    /** The console fragment floating over the caption. */
    scene: SiteScene
    /** Destination of the cell's link; empty renders none. */
    href?: string
    /** Label of the cell's link. */
    linkLabel?: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** The section's headline. */
    title?: string
    /** One or two sentences under the headline. */
    description?: string
    /** The cells, in reading order. */
    items: WidgetGridItem[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: ''
  })

  const { follow, isInternal } = useSiteLink()

  const openCard = (event: MouseEvent, href?: string) => {
    if (!href || (event.target as globalThis.Element).closest('a')) return
    if (isInternal(href)) follow(event, href)
    else globalThis.open(href, '_blank', 'noopener')
  }

  const hovered = ref('')
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template
      v-if="title"
      #header
    >
      <SectionTitle
        kind="centered"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <BentoGrid
        flush
        :columns="2"
        :aria-label="title || 'Console widgets'"
      >
        <BentoGridCell
          v-for="item in items"
          :key="item.title"
          :padded="false"
        >
          <!-- pointermove too: a pointer left stationary over the card while the page
               scrolls under it never fires pointerenter. -->
          <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -- pointer shortcut; the Learn more link inside is the keyboard path -->
          <div
            class="flex h-full w-full min-w-0 flex-col data-linked:cursor-pointer hover:[&_[data-card-action]>*]:before:opacity-100"
            :data-linked="item.href ? '' : null"
            @click="openCard($event, item.href)"
            @pointerenter="hovered = item.title"
            @pointermove="hovered = item.title"
            @pointerleave="hovered = ''"
          >
            <div class="h-80 w-full min-w-0 overflow-hidden px-(--spacing-xl) pt-(--spacing-xl)">
              <component
                :is="item.scene.component"
                v-bind="item.scene.props ?? {}"
                :hover="hovered === item.title"
              />
            </div>
            <div class="flex flex-col items-start gap-(--spacing-lg) p-(--spacing-xl)">
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                <strong class="font-medium text-(--text-default)">{{ item.title }}</strong>
                {{ ' ' }}{{ item.description }}
              </p>
              <span
                v-if="item.href"
                data-card-action
                class="contents"
              >
                <Button
                  :label="item.linkLabel || 'Learn more'"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-chevron-right"
                  icon-position="trailing"
                  :href="item.href"
                  @click="follow($event, item.href)"
                />
              </span>
            </div>
          </div>
        </BentoGridCell>
      </BentoGrid>
    </FrameBox>
  </SectionModule>
</template>

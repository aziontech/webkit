<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Topic from '@aziontech/webkit/topic'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteLink, SiteTopic } from './types'

  defineOptions({ name: 'ContactHub' })

  export interface ContactLane {
    /** Leading glyph of the lane's label, as an icon class. */
    icon: string
    /** Who the lane reaches, rendered as its heading. */
    label: string
    /** One sentence of what the lane handles. */
    description: string
    /** Buttons on the lane's floor; the first leads. */
    actions: SiteAction[]
    /** The status page, drawn as an outlined button carrying the footer's status indicator. */
    status?: SiteLink | null
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** The two people to reach, side by side. */
    lanes: ContactLane[]
    /** Two linked self-serve channels, under the lanes. */
    channels?: SiteTopic[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    channels: () => []
  })

  const { follow, isInternal } = useSiteLink()

  const external = (href: string) => (href && !isInternal(href) ? '_blank' : undefined)
  const rel = (href: string) => (external(href) ? 'noopener noreferrer' : undefined)
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <CardGrid
        flush
        kind="frame"
        :columns="2"
      >
        <CardGridCell
          v-for="lane in lanes"
          :key="lane.label"
          kind="canvas"
        >
          <div class="flex h-full flex-col gap-(--spacing-xl)">
            <div class="flex flex-col gap-(--spacing-sm)">
              <h2 class="m-0 flex items-center gap-(--spacing-xs) text-body-md text-(--text-muted)">
                <i
                  :class="lane.icon"
                  aria-hidden="true"
                  class="shrink-0 text-(--primary)"
                />
                {{ lane.label }}
              </h2>
              <p
                class="m-0 max-w-(--container-md) text-pretty text-heading-sm text-(--text-default)"
              >
                {{ lane.description }}
              </p>
            </div>
            <div class="mt-auto flex flex-wrap gap-(--spacing-sm)">
              <SectionAction
                v-for="action in lane.actions"
                :key="action.label"
                :action="action"
              />
              <a
                v-if="lane.status"
                :href="lane.status.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) text-button-lg text-(--text-default) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              >
                <StatusIndicator
                  severity="success"
                  :label="lane.status.label"
                />
              </a>
            </div>
          </div>
        </CardGridCell>
        <CardGridCell
          v-for="channel in channels"
          :key="channel.title"
          kind="canvas"
        >
          <Topic
            :heading-level="2"
            :icon="channel.icon ?? ''"
            :title="channel.title"
            :description="channel.description"
            :href="channel.href ?? ''"
            :target="external(channel.href ?? '')"
            :rel="rel(channel.href ?? '')"
            @click="follow($event, channel.href ?? '')"
          />
        </CardGridCell>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>

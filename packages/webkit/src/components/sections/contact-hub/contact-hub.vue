<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Topic from '../../marketing/topic/topic.vue'

  defineOptions({
    name: 'ContactHub',
    inheritAttrs: false
  })

  /** The button on a lane's floor that reaches its team. */
  export type ContactHubAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** The system status link beside a lane's action. */
  export type ContactHubStatusLink = {
    /** Visible label of the link. */
    label: string
    /** URL of the status page. */
    href: string
    /** Browsing context the link opens in, such as `_blank` for a new tab. */
    target?: string
  }

  /** One team the reader can reach, rendered as a lane of the two-column frame. */
  export type ContactHubLane = {
    /** Icon class for the glyph that leads the lane's heading. */
    icon: string
    /** The team, rendered as the lane's h2. */
    title: string
    /** One sentence stating what the team handles. */
    description: string
    /** The button that reaches the team; `{ label, href, trailing? }`. Omitted when absent. */
    action?: ContactHubAction
    /** The system status link beside the action; `{ label, href, target? }`. Omitted when absent. */
    statusLink?: ContactHubStatusLink
  }

  /** One self-serve channel, rendered as a linked topic of the three-column row. */
  export type ContactHubChannel = {
    /** Icon class for the glyph that leads the channel's heading. */
    icon: string
    /** The channel, rendered as its h2. */
    title: string
    /** One sentence explaining the channel. */
    description: string
    /** Destination the channel links to. */
    href: string
    /** Browsing context the link opens in, such as `_blank` for a new tab. */
    target?: string
  }

  interface Props {
    /** The team lanes side by side, in order; each is `{ icon, title, description, action?, statusLink? }` where `action` is the lane's button and `statusLink` the system status link beside it. */
    lanes?: ContactHubLane[]
    /** The self-serve channels under the lanes, in order; each is `{ icon, title, description, href, target? }`, rendered as a linked topic. */
    channels?: ContactHubChannel[]
  }

  const props = withDefaults(defineProps<Props>(), {
    lanes: () => [],
    channels: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-contact-hub'
  )

  const hasContent = computed(() => props.lanes.length > 0 || props.channels.length > 0)

  const relOf = (target?: string) => (target === '_blank' ? 'noopener noreferrer' : undefined)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionModule
      v-if="hasContent"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        v-if="lanes.length > 0"
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
            :key="lane.title"
            kind="canvas"
          >
            <div class="flex h-full flex-col gap-(--spacing-xl)">
              <div class="flex flex-col gap-(--spacing-sm)">
                <h2
                  class="m-0 flex items-center gap-(--spacing-xs) text-body-md text-(--text-muted)"
                >
                  <i
                    :class="lane.icon"
                    class="shrink-0 text-(--primary)"
                    aria-hidden="true"
                  />
                  {{ lane.title }}
                </h2>
                <p
                  class="m-0 max-w-(--container-md) text-pretty text-heading-sm text-(--text-default)"
                >
                  {{ lane.description }}
                </p>
              </div>
              <div
                v-if="lane.action || lane.statusLink"
                class="mt-auto flex flex-wrap gap-(--spacing-sm)"
              >
                <Button
                  v-if="lane.action"
                  :label="lane.action.label"
                  :href="lane.action.href"
                  kind="secondary"
                  size="large"
                  :icon="lane.action.trailing ? 'pi pi-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(lane.action.trailing)"
                />
                <a
                  v-if="lane.statusLink"
                  :href="lane.statusLink.href"
                  :target="lane.statusLink.target"
                  :rel="relOf(lane.statusLink.target)"
                  class="inline-flex h-10 items-center gap-(--spacing-xs) whitespace-nowrap rounded-full border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) text-button-lg text-(--text-default) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                >
                  <span
                    class="size-2 shrink-0 rounded-full bg-(--success-contrast)"
                    aria-hidden="true"
                  />
                  {{ lane.statusLink.label }}
                </a>
              </div>
            </div>
          </CardGridCell>
        </CardGrid>
      </FrameBox>

      <FrameBox
        key="frame-box-2"
        v-if="channels.length > 0"
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="3"
        >
          <CardGridCell
            v-for="channel in channels"
            :key="channel.title"
            kind="canvas"
          >
            <Topic
              :heading-level="2"
              :icon="channel.icon"
              :title="channel.title"
              :description="channel.description"
              :href="channel.href"
              :target="channel.target"
              :rel="relOf(channel.target)"
            />
          </CardGridCell>
        </CardGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>

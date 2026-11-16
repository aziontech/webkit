<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../action/button/button.vue'
  import StatusIndicator from '../../feedback/status-indicator/status-indicator.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import FeatureItem from '../../marketing/feature-item/feature-item.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type { SectionTitleAction } from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'ContactHubSection',
    inheritAttrs: false
  })

  export type { SectionTitleAction }

  /** The system status link beside a lane's action. */
  export type ContactHubSectionStatusLink = {
    /** Visible label of the link. */
    label: string
    /** URL of the status page. */
    href: string
    /** Browsing context the link opens in, such as `_blank` for a new tab. */
    target?: string
  }

  /** One team the reader can reach, rendered as a lane of the two-column frame. */
  export type ContactHubSectionLane = {
    /** Icon class for the glyph that leads the lane's heading. */
    icon: string
    /** The team, rendered as the lane's h2. */
    title: string
    /** One sentence stating what the team handles. */
    description: string
    /** The button that reaches the team; `{ label, href, trailing? }`. Omitted when absent. */
    action?: SectionTitleAction
    /** A second, outlined button after the action; `{ label, href, trailing? }`. Omitted when absent. */
    secondaryAction?: SectionTitleAction
    /** The system status link beside the action; `{ label, href, target? }`. Omitted when absent. */
    statusLink?: ContactHubSectionStatusLink
  }

  /** One self-serve channel, rendered as a linked topic of the channel row. */
  export type ContactHubSectionChannel = {
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

  export interface ContactHubSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** The team lanes side by side, in order; each is `{ icon, title, description, action?, secondaryAction?, statusLink? }` where `action` is the lane's leading button, `secondaryAction` an outlined button after it, and `statusLink` the system status link beside them. */
    lanes?: ContactHubSectionLane[]
    /** The self-serve channels in the rows under the lanes, in order; each is `{ icon, title, description, href, target? }`, rendered as a linked topic. */
    channels?: ContactHubSectionChannel[]
  }

  const props = withDefaults(defineProps<ContactHubSectionProps>(), {
    anchor: '',
    lanes: () => [],
    channels: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'contact-hub-section'
  )

  const hasContent = computed(() => props.lanes.length > 0 || props.channels.length > 0)

  const relOf = (target?: string) => (target === '_blank' ? 'noopener noreferrer' : undefined)
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      v-if="hasContent"
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          v-if="lanes.length > 0"
          key="lanes"
          flush
          variant="frame"
          :columns="2"
        >
          <CardGridCell
            v-for="lane in lanes"
            :key="lane.title"
            variant="canvas"
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
                v-if="lane.action || lane.secondaryAction || lane.statusLink"
                class="mt-auto flex flex-wrap gap-(--spacing-sm)"
              >
                <Button
                  v-if="lane.action"
                  key="action"
                  :label="lane.action.label"
                  :href="lane.action.href"
                  variant="secondary"
                  size="large"
                  :icon="lane.action.trailing ? 'ai ai-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(lane.action.trailing)"
                />
                <Button
                  v-if="lane.secondaryAction"
                  key="secondary-action"
                  :label="lane.secondaryAction.label"
                  :href="lane.secondaryAction.href"
                  variant="outline"
                  size="large"
                  :icon="lane.secondaryAction.trailing ? 'ai ai-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(lane.secondaryAction.trailing)"
                />
                <a
                  v-if="lane.statusLink"
                  :href="lane.statusLink.href"
                  :target="lane.statusLink.target"
                  :rel="relOf(lane.statusLink.target)"
                  class="inline-flex min-h-10 max-w-full items-center rounded-full border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) text-button-lg text-(--text-default) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                >
                  <StatusIndicator
                    severity="success"
                    :label="lane.statusLink.label"
                  />
                </a>
              </div>
            </div>
          </CardGridCell>
        </CardGrid>

        <CardGrid
          v-if="channels.length > 0"
          key="channels"
          flush
          variant="frame"
          :columns="3"
        >
          <CardGridCell
            v-for="channel in channels"
            :key="channel.title"
            variant="canvas"
          >
            <FeatureItem
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
      </RegistrationFrame>
    </SectionModule>
  </section>
</template>

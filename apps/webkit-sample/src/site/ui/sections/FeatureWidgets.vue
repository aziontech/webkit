<script setup lang="ts">
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGrid from '@aziontech/webkit/bento-grid-root'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import type { SectionTitleKind } from '@aziontech/webkit/section-title'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { type Component, onScopeDispose, ref } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'FeatureWidgets' })

  interface SiteScene {
    /** The scene component the cell presents. */
    component: Component
    /** Props forwarded to the scene. */
    props?: Record<string, unknown>
  }

  interface FeatureWidgetsCopy {
    /** Label of the button that copies the text. */
    label: string
    /** Text the button puts on the clipboard. */
    text: string
  }

  export interface FeatureWidgetsItem {
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
    /** A highlighted button that copies a text, such as a prompt. */
    copy?: FeatureWidgetsCopy
  }

  /** Cells per row the grid lays out from the medium breakpoint up. */
  export type FeatureWidgetsColumns = 2 | 3

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** The section's headline. */
    title?: string
    /** One or two sentences under the headline. */
    description?: string
    /** Alignment of the section title over the grid. */
    titleKind?: SectionTitleKind
    /** The cells, in reading order. */
    items: FeatureWidgetsItem[]
    /** How many cells share a row from the medium breakpoint up. */
    columns?: FeatureWidgetsColumns
    /** Buttons under the section title. */
    actions?: SiteAction[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    titleKind: 'centered',
    columns: 2,
    actions: () => []
  })

  const { follow } = useSiteLink()

  const hovered = ref('')

  const copied = ref('')

  let copiedTimer: ReturnType<typeof setTimeout> | undefined

  const copy = async (item: FeatureWidgetsItem) => {
    if (!item.copy) return
    await globalThis.navigator.clipboard?.writeText(item.copy.text)
    copied.value = item.title
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copied.value = ''), 2000)
  }

  onScopeDispose(() => clearTimeout(copiedTimer))
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
        :kind="titleKind"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      >
        <template
          v-if="actions.length"
          #actions
        >
          <SectionAction
            v-for="action in actions"
            :key="action.label"
            :action="action"
          />
        </template>
      </SectionTitle>
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <BentoGrid
        flush
        :columns="columns"
        :aria-label="title || 'Console widgets'"
      >
        <BentoGridCell
          v-for="item in items"
          :key="item.title"
          :padded="false"
        >
          <!-- pointermove too: a pointer left stationary over the card while the page
               scrolls under it never fires pointerenter. -->
          <div
            class="flex h-full w-full min-w-0 flex-col"
            @pointerenter="hovered = item.title"
            @pointermove="hovered = item.title"
            @pointerleave="hovered = ''"
          >
            <div
              class="h-80 w-full min-w-0 overflow-x-visible overflow-y-clip px-(--spacing-xl) pt-(--spacing-xl) [--mockup-fade-color:var(--bg-surface)]"
            >
              <component
                :is="item.scene.component"
                v-bind="item.scene.props ?? {}"
                :hover="hovered === item.title"
              />
            </div>
            <div class="flex flex-1 flex-col items-start gap-(--spacing-lg) p-(--spacing-xl)">
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                <strong class="font-medium text-(--text-default)">{{ item.title }}</strong>
                {{ ' ' }}{{ item.description }}
              </p>
              <span
                v-if="item.href || item.copy"
                class="mt-auto flex flex-wrap gap-(--spacing-sm)"
              >
                <Button
                  v-if="item.href"
                  :label="item.linkLabel || 'Learn more'"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-chevron-right"
                  icon-position="trailing"
                  animated
                  :href="item.href"
                  @click="follow($event, item.href)"
                />
                <ButtonHighlight
                  v-if="item.copy"
                  :label="copied === item.title ? 'Copied' : item.copy.label"
                  size="medium"
                  :icon="copied === item.title ? 'pi pi-check' : 'pi pi-copy'"
                  @click="copy(item)"
                />
              </span>
            </div>
          </div>
        </BentoGridCell>
      </BentoGrid>
    </FrameBox>
  </SectionModule>
</template>

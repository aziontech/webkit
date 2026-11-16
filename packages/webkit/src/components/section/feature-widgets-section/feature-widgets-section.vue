<script setup lang="ts">
  import { type Component, computed, onScopeDispose, ref, useAttrs } from 'vue'

  import { resolveScene, type SceneRef } from '../../../assets/scene-registry'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import HighlightButton from '../../action/highlight-button/highlight-button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import BentoGrid from '../../marketing/bento-grid/bento-grid.vue'
  import BentoGridCell from '../../marketing/bento-grid/bento-grid-cell/bento-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle, {
    type SectionTitleAction,
    type SectionTitleAlign
  } from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'FeatureWidgetsSection',
    inheritAttrs: false
  })

  export type { SectionTitleAction }

  /** The copy affordance of a cell: a button that puts a prompt on the clipboard. */
  export type FeatureWidgetsSectionCopy = {
    /** Visible label of the copy button. */
    label: string
    /** The text written to the clipboard on activation. */
    text: string
  }

  /** Column count of the grid from the medium breakpoint up. */
  export type FeatureWidgetsSectionColumns = 2 | 3 | 4

  /** A live scene drawn above a cell's sentence. */
  export type FeatureWidgetsSectionScene = SceneRef

  /** One cell of the grid: a scene or an illustration above a bold-led sentence and its affordances. */
  export type FeatureWidgetsSectionItem = {
    /** The bold lead of the cell's sentence. */
    title: string
    /** The rest of the cell's sentence, after the lead. */
    description: string
    /** Live scene drawn above the sentence, `{ component, props? }` naming a webkit scene asset; it plays its beat while the pointer is over the cell and wins over the illustration. */
    scene?: FeatureWidgetsSectionScene
    /** Name of the illustration drawn above the sentence when no scene is set. */
    illustration?: string
    /** Outlined link button rendered at the foot of the cell; `{ label, href }`. */
    action?: SectionTitleAction
    /** Copy button rendered at the foot of the cell; `{ label, text }` where `text` goes to the clipboard. */
    copy?: FeatureWidgetsSectionCopy
  }

  export interface FeatureWidgetsSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the section title as its `h2`, and the accessible name of the band. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** First button under the headline; `{ label, href, trailing? }`. Omitted when absent. */
    primaryAction?: SectionTitleAction
    /** Second, outlined button under the headline; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. */
    secondaryAction?: SectionTitleAction
    /** Alignment of the section title over the grid: `center`, `start` or `split`. */
    titleAlign?: SectionTitleAlign
    /** Column count of the grid from the medium breakpoint up: `2`, `3` or `4`. */
    columns?: FeatureWidgetsSectionColumns
    /** Label a cell's copy button shows for two seconds after a copy; empty uses the catalog's `Copied`. */
    copiedLabel?: string
    /** The cells, in order; each is `{ title, description, scene?, illustration?, action?, copy? }` where `scene` is a webkit scene asset handed `hovered` while the pointer is over the cell, `illustration` is drawn when no scene is set, `action` is `{ label, href }` rendered as an outlined link button and `copy` is `{ label, text }` rendered as a copy button that puts `text` on the clipboard; a cell may carry both. */
    items?: FeatureWidgetsSectionItem[]
  }

  const props = withDefaults(defineProps<FeatureWidgetsSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    titleAlign: 'center',
    columns: 2,
    copiedLabel: '',
    items: () => []
  })

  const attrs = useAttrs()

  const { t } = useTranslate({ copyButton: en.copyButton, common: en.common })

  const hovered = ref(-1)

  const copied = ref(-1)

  let copiedTimer: ReturnType<typeof setTimeout> | undefined

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feature-widgets-section'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

  const scenes = computed<(Component | null)[]>(() =>
    props.items.map((item) => (item.scene ? resolveScene(item.scene.component) : null))
  )

  const doneLabel = computed(() => props.copiedLabel || t('common.copied'))

  const copyPrompt = async (index: number, text: string) => {
    try {
      await globalThis.navigator.clipboard.writeText(text)
    } catch {
      return
    }
    copied.value = index
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copied.value = -1), 2000)
  }

  onScopeDispose(() => clearTimeout(copiedTimer))
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :id="anchor || undefined"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeader"
        #header
      >
        <SectionTitle
          :align="titleAlign"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template #actions>
            <Button
              v-if="primaryAction"
              :label="primaryAction.label"
              :href="primaryAction.href"
              variant="secondary"
            />
            <Button
              key="button-2"
              v-if="secondaryAction"
              :label="secondaryAction.label"
              :href="secondaryAction.href"
              variant="outline"
              :icon="secondaryAction.trailing ? 'ai ai-chevron-right' : ''"
              icon-position="trailing"
            />
          </template>
        </SectionTitle>
      </template>
      <RegistrationFrame
        flush
        borders="y"
        marks="bottom"
      >
        <BentoGrid
          flush
          :columns="columns"
        >
          <BentoGridCell
            v-for="(item, index) in items"
            :key="item.title"
            :padded="false"
          >
            <div
              class="flex h-full w-full min-w-0 flex-col"
              @pointerenter="hovered = index"
              @pointermove="hovered = index"
              @pointerleave="hovered = -1"
            >
              <div
                v-if="scenes[index]"
                class="h-80 w-full min-w-0 overflow-x-visible overflow-y-clip px-(--spacing-xl) pt-(--spacing-xl) [--console-mockup-fade-color:var(--bg-surface)]"
              >
                <component
                  :is="scenes[index]"
                  v-bind="{ ...item.scene?.props, hovered: hovered === index }"
                />
              </div>
              <Illustration
                v-else-if="item.illustration"
                :name="item.illustration"
              />
              <div class="flex flex-1 flex-col items-start gap-(--spacing-lg) p-(--spacing-xl)">
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                  <strong class="font-medium text-(--text-default)">{{ item.title }}</strong>
                  {{ item.description }}
                </p>
                <span
                  v-if="item.action || item.copy"
                  aria-live="polite"
                  class="mt-auto flex flex-wrap gap-(--spacing-sm)"
                >
                  <Button
                    v-if="item.action"
                    :label="item.action.label"
                    :href="item.action.href"
                    variant="outline"
                    size="medium"
                    icon="ai ai-chevron-right"
                    icon-position="trailing"
                    animated
                  />
                  <HighlightButton
                    v-if="item.copy"
                    :label="copied === index ? doneLabel : item.copy.label"
                    size="medium"
                    :icon="copied === index ? 'ai ai-check' : 'ai ai-copy'"
                    @click="copyPrompt(index, item.copy.text)"
                  />
                </span>
              </div>
            </div>
          </BentoGridCell>
        </BentoGrid>
      </RegistrationFrame>
    </SectionModule>
  </section>
</template>

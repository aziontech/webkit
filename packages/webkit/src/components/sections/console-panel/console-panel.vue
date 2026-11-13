<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import ToggleGroup from '../../actions/toggle-group/toggle-group.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type {
    SectionTitleKind,
    SectionTitlePadding,
    SectionTitleSize
  } from '../../marketing/section-title/section-title.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import type {
    TextureMaterialFade,
    TextureMaterialKind
  } from '../../marketing/texture-material/texture-material.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({ name: 'ConsolePanel', inheritAttrs: false })

  /** What the panel frames: `console` crops and fades a console mock at a fixed aspect, `diagram` lets a scene keep its own height. */
  export type ConsolePanelKind = 'console' | 'diagram'

  /** One tab over the frame; the scene slot receives its `value`. */
  export type ConsolePanelTab = {
    /** Stable key handed to the scene slot as `tab`. */
    value: string
    /** Visible label of the tab. */
    title: string
  }

  /** Button kind of an action. */
  export type ConsolePanelActionKind = 'secondary' | 'outlined'

  /** A button under the headline. */
  export type ConsolePanelAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
    /** Button kind; by default the first action is `secondary` and the rest `outlined`. */
    kind?: ConsolePanelActionKind
  }

  interface Props {
    /** What the panel frames. */
    kind?: ConsolePanelKind
    /** Layout of the headline block. */
    titleKind?: SectionTitleKind
    /** Vertical padding of the headline block. */
    titlePadding?: SectionTitlePadding
    /** Step of the headline on the heading scale. */
    size?: SectionTitleSize
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** Headline of the band, rendered as its `h2`. */
    title?: string
    /** One or two sentences under the headline. */
    description?: string
    /** Texture the panel is grounded with. */
    texture?: TextureMaterialKind
    /** Axis the texture fades out along. */
    textureFade?: TextureMaterialFade
    /** Tabs over the frame, each `{ value, title }`; each plays its own beat of the scene. */
    tabs?: ConsolePanelTab[]
    /** Accessible name of the tab control; empty uses the built-in "Console views". */
    tabsAriaLabel?: string
    /** Share of the scene height clipped off its bottom, from 0 to 0.5, from the medium breakpoint up. */
    crop?: number
    /** Buttons under the headline; each is `{ label, href, trailing?, target?, kind? }`; without `kind` the first is secondary and the rest outlined. */
    actions?: ConsolePanelAction[]
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'console',
    titleKind: 'centered',
    titlePadding: 'medium',
    size: 'medium',
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    texture: 'pixelate',
    textureFade: 'top',
    tabs: () => [],
    tabsAriaLabel: '',
    crop: 0,
    actions: () => []
  })

  defineSlots<{
    /** The scene the band presents (a `ShellMockup`, a `ProductWidget`, a diagram); `tab` is the selected tab value. */
    scene(props: { tab: string | undefined }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ consolePanel: en.consolePanel })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-console-panel'
  )

  const current = ref<string | undefined>(props.tabs[0]?.value)

  const options = computed(() => props.tabs.map((tab) => ({ value: tab.value, label: tab.title })))

  const SCENE_ASPECT = 1.9

  const cropStyle = computed(() => {
    const crop = Math.min(Math.max(props.crop, 0), 0.5)
    const fadeEnd = Math.round((1 - crop) * 100) + 3
    return {
      '--console-panel-crop': `${((crop / SCENE_ASPECT) * 100).toFixed(2)}%`,
      '--console-panel-fade-end': `${fadeEnd}%`,
      '--console-panel-fade-start': `${fadeEnd - 22}%`
    }
  })
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-kind="kind"
    :aria-label="title || undefined"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <SectionTitle
          class="[--section-title-headline-max:var(--container-xl)] [--section-title-headline-span:2]"
          :kind="titleKind"
          :padding="titlePadding"
          :size="size"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template
            v-if="tabs.length || actions.length"
            #actions
          >
            <Button
              v-for="(action, index) in actions"
              :key="action.label"
              :label="action.label"
              :href="action.href"
              :target="action.target"
              :kind="action.kind ?? (index === 0 ? 'secondary' : 'outlined')"
              size="large"
              :icon="action.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(action.trailing)"
            />
            <ToggleGroup
              v-if="tabs.length"
              v-model="current"
              :options="options"
              size="large"
              :aria-label="tabsAriaLabel || t('consolePanel.views')"
            />
          </template>
        </SectionTitle>
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <div
          class="relative w-full overflow-hidden px-(--spacing-xl) pt-(--spacing-md) pb-(--spacing-xl) md:pb-0"
        >
          <TextureMaterial
            :kind="texture"
            size="small"
            :fade="textureFade"
          />
          <div
            :data-kind="kind"
            class="relative z-10 w-full data-[kind=console]:aspect-square data-[kind=diagram]:flex data-[kind=diagram]:min-h-(--size-96) data-[kind=diagram]:items-center data-[kind=diagram]:justify-center md:data-[kind=console]:-mb-(--console-panel-crop) md:data-[kind=console]:aspect-[1.9/1] md:data-[kind=console]:[--mockup-fade-end:var(--console-panel-fade-end)] md:data-[kind=console]:[--mockup-fade-start:var(--console-panel-fade-start)]"
            :style="cropStyle"
          >
            <slot
              name="scene"
              :tab="tabs.length ? current : undefined"
            />
          </div>
        </div>
      </FrameBox>
    </SectionModule>
  </section>
</template>

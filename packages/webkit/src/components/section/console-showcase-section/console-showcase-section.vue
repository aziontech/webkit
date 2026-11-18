<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useMediaQuery } from '../../../composables/use-media-query'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import type { TextureFade, TextureVariant } from '../../content/texture/texture.vue'
  import Texture from '../../content/texture/texture.vue'
  import Module from '../../layout/module/module.vue'
  import type {
    ModuleHeaderAlign,
    ModuleHeaderPadding,
    ModuleHeaderSize
  } from '../../layout/module-header/module-header.vue'
  import ModuleHeader from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'

  defineOptions({ name: 'ConsoleShowcaseSection', inheritAttrs: false })

  /** What the panel frames: `console` crops and fades a console mock at a fixed aspect, `diagram` lets a scene keep its own height. */
  export type ConsoleShowcaseSectionVariant = 'console' | 'diagram'

  /** One tab over the frame; the scene slot receives its `value`. */
  export type ConsoleShowcaseSectionTab = {
    /** Stable key handed to the scene slot as `tab`. */
    value: string
    /** Visible label of the tab. */
    title: string
  }

  /** Button variant of an action. */
  export type ConsoleShowcaseSectionActionVariant = 'secondary' | 'outline'

  /** A button under the headline. */
  export type ConsoleShowcaseSectionAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
    /** Button variant; the panel draws the primary action `secondary` and the secondary `outline`. */
    variant?: ConsoleShowcaseSectionActionVariant
  }

  export interface ConsoleShowcaseSectionProps {
    /** What the panel frames. */
    variant?: ConsoleShowcaseSectionVariant
    /** Layout of the headline block. */
    titleAlign?: ModuleHeaderAlign
    /** Vertical padding of the headline block. */
    titlePadding?: ModuleHeaderPadding
    /** Step of the headline on the heading scale. */
    size?: ModuleHeaderSize
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Eyebrow above the title. */
    eyebrow?: string
    /** Headline of the band, rendered as its `h2`. */
    title?: string
    /** One or two sentences under the headline. */
    description?: string
    /** Texture the `console` panel is grounded with; a `diagram` scene sits on the plain canvas. */
    texture?: TextureVariant
    /** Axis the texture of the `console` panel fades out along. */
    textureFade?: TextureFade
    /** Tabs over the frame, each `{ value, title }`; each plays its own beat of the scene. */
    tabs?: ConsoleShowcaseSectionTab[]
    /** Accessible name of the tab control; empty uses the built-in "Console views". */
    tabsAriaLabel?: string
    /** Share of the scene height clipped off its bottom, from 0 to 0.5, from the medium breakpoint up. */
    crop?: number
    /** First button under the headline, secondary; shown only with a label and a link. */
    primaryAction?: ConsoleShowcaseSectionAction
    /** Second button under the headline, outlined; shown only with a label and a link. */
    secondaryAction?: ConsoleShowcaseSectionAction
  }

  const props = withDefaults(defineProps<ConsoleShowcaseSectionProps>(), {
    variant: 'console',
    titleAlign: 'center',
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
    primaryAction: undefined,
    secondaryAction: undefined
  })

  defineSlots<{
    /** The scene the band presents (a `ConsoleMockup`, a diagram); `tab` is the selected tab value. */
    scene(props: { tab: string | undefined }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ consoleShowcaseSection: en.consoleShowcaseSection })
  const roomy = useMediaQuery('(min-width: 40rem)', true)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'console-showcase-section'
  )

  const current = ref<string | undefined>(props.tabs[0]?.value)

  const options = computed(() => props.tabs.map((tab) => ({ value: tab.value, label: tab.title })))

  const shown = (
    action: ConsoleShowcaseSectionAction | undefined
  ): action is ConsoleShowcaseSectionAction => Boolean(action?.label && action.href)

  const buttons = computed<ConsoleShowcaseSectionAction[]>(() => {
    const named: ConsoleShowcaseSectionAction[] = []
    if (shown(props.primaryAction)) named.push({ ...props.primaryAction, variant: 'secondary' })
    if (shown(props.secondaryAction)) named.push({ ...props.secondaryAction, variant: 'outline' })
    return named
  })

  const SCENE_ASPECT = 1.9

  const cropStyle = computed(() => {
    const crop = Math.min(Math.max(props.crop, 0), 0.5)
    const fadeEnd = Math.round((1 - crop) * 100) + 3
    return {
      '--console-showcase-section-crop': `${((crop / SCENE_ASPECT) * 100).toFixed(2)}%`,
      '--console-showcase-section-fade-end': `${fadeEnd}%`,
      '--console-showcase-section-fade-start': `${fadeEnd - 22}%`
    }
  })
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
    :data-testid="testId"
    :data-variant="variant"
    :aria-label="title || undefined"
  >
    <Module
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <ModuleHeader
          class="[--module-header-headline-max:var(--container-xl)] [--module-header-headline-span:2]"
          :align="titleAlign"
          :padding="titlePadding"
          :size="size"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template
            v-if="tabs.length || buttons.length"
            #actions
          >
            <Button
              v-for="action in buttons"
              :key="action.label"
              :label="action.label"
              :href="action.href"
              :target="action.target"
              :variant="action.variant"
              size="large"
              :icon="action.trailing ? 'az az-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(action.trailing)"
            />
            <ToggleGroup
              v-if="tabs.length"
              v-model="current"
              :options="options"
              :size="roomy ? 'large' : 'small'"
              :aria-label="tabsAriaLabel || t('consoleShowcaseSection.views')"
            />
          </template>
        </ModuleHeader>
      </template>

      <RegistrationFrame
        flush
        borders="y"
        marks="all"
      >
        <div
          class="relative w-full overflow-hidden px-(--spacing-xl) pt-(--spacing-md) pb-(--spacing-xl) md:pb-0"
        >
          <Texture
            v-if="variant === 'console'"
            :variant="texture"
            size="small"
            :fade="textureFade"
          />
          <div
            :data-variant="variant"
            class="relative z-10 w-full data-[variant=console]:aspect-square data-[variant=diagram]:flex data-[variant=diagram]:min-h-(--size-96) data-[variant=diagram]:items-center data-[variant=diagram]:justify-center data-[variant=diagram]:*:min-w-[min(100%,var(--container-3xl))] md:data-[variant=console]:-mb-(--console-showcase-section-crop) md:data-[variant=console]:aspect-[1.9/1] md:data-[variant=console]:[--console-mockup-fade-end:var(--console-showcase-section-fade-end)] md:data-[variant=console]:[--console-mockup-fade-start:var(--console-showcase-section-fade-start)]"
            :style="cropStyle"
          >
            <slot
              name="scene"
              :tab="tabs.length ? current : undefined"
            />
          </div>
        </div>
      </RegistrationFrame>
    </Module>
  </section>
</template>

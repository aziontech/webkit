<script setup lang="ts">
  import type { CodeBlockTab } from '@aziontech/webkit/code-block'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import StickyStack from '@aziontech/webkit/sticky-stack'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'StickyScrollCode' })

  export interface StickyScrollCodeItem extends SiteTopic {
    /** The capability's own action, shown under its description while it is open. */
    action?: SiteAction | null
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
    /** Capabilities, opened one at a time as the page scrolls. */
    items: StickyScrollCodeItem[]
    /** One code file per capability, in the same order. */
    samples: CodeBlockTab[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: ''
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
        size="large"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
      class="[--sticky-stack-top:3.5rem] [--sticky-stack-height:min(40rem,calc(100dvh-3.5rem))] [--sticky-stack-align:stretch] [--sticky-stack-frame-border:1px]"
    >
      <StickyStack :items="items">
        <template #backdrop>
          <TextureMaterial
            kind="pixelate"
            size="small"
            fade="top"
          />
        </template>
        <template #media="{ index }">
          <div
            class="relative z-10 flex w-full min-w-0 flex-col items-start gap-(--spacing-md) lg:h-90"
          >
            <div
              v-if="samples[index]"
              class="w-full min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)"
            >
              <CodeBlock
                :tabs="[samples[index]]"
                show-line-numbers
                animate-lines
                :copy-aria-label="`Copy the ${samples[index].fileName ?? samples[index].label} sample`"
              />
            </div>
          </div>
        </template>
        <template #actions="{ index }">
          <SectionAction
            v-if="items[index].action"
            :action="{ size: 'small', trailing: true, ...items[index].action }"
          />
        </template>
      </StickyStack>
    </FrameBox>
  </SectionModule>
</template>

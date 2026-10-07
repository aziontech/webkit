<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import type { CodeBlockTab } from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import StickyStack from '@aziontech/webkit/sticky-stack'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'StickyScrollCode' })

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
    items: SiteTopic[]
    /** One code file per capability, in the same order. */
    samples: CodeBlockTab[]
    /** Action under the sample from lg up, and under the title below it. */
    action?: SiteAction | null
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    action: null
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
      >
        <template
          v-if="action"
          #actions
        >
          <SectionAction
            class="lg:hidden"
            :action="{ size: 'small', trailing: true, ...action }"
          />
        </template>
      </SectionTitle>
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
      class="[--sticky-stack-top:3.5rem] [--sticky-stack-height:min(40rem,calc(100dvh-3.5rem))] [--sticky-stack-align:stretch] [--sticky-stack-frame-border:1px]"
    >
      <StickyStack :items="items">
        <template #media="{ index }">
          <div class="contents max-lg:hidden">
            <TextureMaterial
              kind="pixelate"
              size="small"
              fade="top"
            />
          </div>
          <div class="relative z-10 flex w-full min-w-0 flex-col items-start gap-(--spacing-md)">
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
            <div
              v-if="action"
              class="max-lg:hidden"
            >
              <SectionAction :action="{ size: 'small', trailing: true, ...action }" />
            </div>
          </div>
        </template>
      </StickyStack>
    </FrameBox>
  </SectionModule>
</template>

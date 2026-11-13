<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import CodeBlock from '../../code/code-block/code-block.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import StickyStack from '../../marketing/sticky-stack/sticky-stack.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'

  defineOptions({
    name: 'StickyScrollCode',
    inheritAttrs: false
  })

  /** The small action under an open item's copy. */
  export type StickyScrollCodeAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
  }

  /** The one-file code sample an item shows while it is open. */
  export type StickyScrollCodeSample = {
    /** File name shown in the sample's filename bar. */
    fileName: string
    /** The code shown verbatim. */
    code: string
    /** Language the code is highlighted as. */
    language?: string
    /** Icon class shown beside the file name. */
    fileIcon?: string
    /** Accessible name of the sample's copy button; empty keeps the code block's own. */
    copyAriaLabel?: string
  }

  /** One capability of the walkthrough: a claim of the stack and its sample. */
  export type StickyScrollCodeItem = {
    /** The capability's heading, naming its claim. */
    title: string
    /** One sentence explaining the capability. */
    description: string
    /** The one-file sample pinned while the item is open. */
    code: StickyScrollCodeSample
    /** Small secondary button under the open item; `{ label, href, trailing? }`. Omitted when absent. */
    action?: StickyScrollCodeAction
  }

  interface Props {
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** The capabilities, in reading order; each is `{ title, description, code, action? }` where `code` is the one-file sample `{ fileName, code, language?, fileIcon?, copyAriaLabel? }` and `action` is `{ label, href, trailing? }` rendered as a small secondary button under the open item. */
    items?: StickyScrollCodeItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    items: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-sticky-scroll-code'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeader = computed(() => props.title.length > 0)

  const sampleTabs = (sample: StickyScrollCodeSample) => [
    {
      label: sample.fileName,
      value: sample.fileName,
      code: sample.code,
      language: sample.language,
      fileName: sample.fileName,
      fileIcon: sample.fileIcon
    }
  ]
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title || undefined"
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
              <div class="w-full min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
                <CodeBlock
                  :tabs="sampleTabs(items[index].code)"
                  show-line-numbers
                  v-bind="{ animateLines: true }"
                  :copy-aria-label="items[index].code.copyAriaLabel || undefined"
                />
              </div>
            </div>
          </template>
          <template #actions="{ index }">
            <Button
              v-if="items[index].action"
              :label="items[index].action.label"
              :href="items[index].action.href"
              kind="secondary"
              size="small"
              :icon="items[index].action.trailing ? 'pi pi-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(items[index].action.trailing)"
            />
          </template>
        </StickyStack>
      </FrameBox>
    </SectionModule>
  </section>
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import CodeBlock from '../../code/code-block/code-block.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'CodeSplit',
    inheritAttrs: false
  })

  /** A call to action under the band's copy. */
  export type CodeSplitAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** PrimeIcons class drawn before the label when the action has no trailing chevron. */
    icon?: string
    /** Link target of the action. */
    target?: '_blank' | '_self'
  }

  /** One file of the code sample. */
  export type CodeSplitTab = {
    /** Label of the tab in the strip. */
    label: string
    /** Stable id of the tab. */
    value: string
    /** The code shown verbatim; a tab without it is skipped. */
    code: string
    /** Language the code is highlighted as. */
    language?: string
    /** File name shown in the filename bar. */
    fileName?: string
    /** Icon class shown beside the file name. */
    fileIcon?: string
    /** Icon class of the mark drawn beside the tab label. */
    icon?: string
  }

  interface Props {
    /** Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** The files of the code sample, in order; each is `{ label, value, code, language?, fileName?, fileIcon?, icon? }` where `icon` is a mark drawn beside the tab label. A tab without `code` is skipped. */
    codeTabs?: CodeSplitTab[]
    /** Accessible name of the sample's copy button; empty keeps the code block's own. */
    copyAriaLabel?: string
    /** First button under the copy; `{ label, href, trailing?, icon?, target? }`. Omitted when absent. */
    primaryAction?: CodeSplitAction
    /** Second, outlined button beside the first; `{ label, href, trailing?, icon?, target? }`. Omitted when absent. */
    secondaryAction?: CodeSplitAction
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    codeTabs: () => [],
    copyAriaLabel: '',
    primaryAction: undefined,
    secondaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-code-split'
  )

  const tabs = computed(() => props.codeTabs.filter((tab) => tab.code.length > 0))

  const tabIcons = computed<Record<string, string>>(() =>
    Object.fromEntries(tabs.value.map((tab) => [tab.value, tab.icon ?? '']))
  )

  const hasTabIcons = computed(() => tabs.value.some((tab) => Boolean(tab.icon)))

  const actionIcon = (action: CodeSplitAction) =>
    action.trailing ? 'pi pi-chevron-right' : (action.icon ?? '')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionModule
      v-if="title.length > 0"
      :divided="false"
      :padded="false"
    >
      <MediaSplit
        framed
        media-padded
        texture="pixelate"
        texture-size="small"
        texture-fade="top"
        :title="title"
        :description="description"
      >
        <template
          v-if="tabs.length > 0"
          #media
        >
          <div
            class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) border-x border-t border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm)"
          >
            <CodeBlock
              :tabs="tabs"
              show-line-numbers
              :border="false"
              v-bind="{ animateLines: true }"
              :copy-aria-label="copyAriaLabel || undefined"
            >
              <template
                v-if="hasTabIcons"
                #tab-icon="{ tab }"
              >
                <i
                  v-if="tabIcons[tab.value]"
                  :class="tabIcons[tab.value]"
                  class="size-3.5!"
                  aria-hidden="true"
                />
              </template>
            </CodeBlock>
          </div>
        </template>
        <template
          v-if="primaryAction || secondaryAction"
          #actions
        >
          <Button
            v-if="primaryAction"
            :label="primaryAction.label"
            :href="primaryAction.href"
            kind="secondary"
            size="large"
            :target="primaryAction.target"
            :icon="actionIcon(primaryAction)"
            :icon-position="primaryAction.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(primaryAction.trailing)"
          />
          <Button
            key="button-2"
            v-if="secondaryAction"
            :label="secondaryAction.label"
            :href="secondaryAction.href"
            kind="outlined"
            size="large"
            :target="secondaryAction.target"
            :icon="actionIcon(secondaryAction)"
            :icon-position="secondaryAction.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(secondaryAction.trailing)"
          />
        </template>
      </MediaSplit>
    </SectionModule>
  </div>
</template>

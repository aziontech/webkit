<script setup lang="ts">
  import type { CodeBlockTab } from '@aziontech/webkit/code-block'
  import CodeBlock from '@aziontech/webkit/code-block'
  import MediaSplit from '@aziontech/webkit/media-split'
  import SectionModule from '@aziontech/webkit/section-module'

  import AgentCodeScene from '../AgentCodeScene.vue'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'CodeSplit' })

  /** default: a framed media split with the code run off its floor; agents: the same split with one tab per coding agent. */
  export type CodeSplitKind = 'default' | 'agents'

  export interface CodeSplitAgent extends CodeBlockTab {
    /** Colored icon class drawn beside the tab's name, an `ai-cor` icon. */
    icon: string
  }

  interface Props {
    /** Layout of the band. */
    kind?: CodeSplitKind
    /** Id of the band, for in-page links. */
    anchor?: string
    /** The band's headline. */
    title?: string
    /** One or two sentences under the headline. */
    description?: string
    /** Code files, one tab each; a single file draws a filename bar instead of tabs. */
    files?: CodeBlockTab[]
    /** Agent tabs, each opening its own code, in the agents layout. */
    agents?: CodeSplitAgent[]
    /** Value of the file open first; empty opens the first file. */
    defaultFile?: string
    /** Accessible name of the copy control. */
    copyAriaLabel?: string
    /** Actions under the copy, in the default layout. */
    actions?: SiteAction[]
  }

  withDefaults(defineProps<Props>(), {
    kind: 'default',
    anchor: '',
    title: '',
    description: '',
    files: () => [],
    agents: () => [],
    defaultFile: '',
    copyAriaLabel: 'Copy the code sample',
    actions: () => []
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
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
      <template #media>
        <AgentCodeScene
          v-if="kind === 'agents'"
          :agents="agents"
          :copy-aria-label="copyAriaLabel"
        />
        <div
          v-else
          class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) border-x border-t border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm)"
        >
          <CodeBlock
            :tabs="files"
            :default-value="defaultFile || undefined"
            show-line-numbers
            :border="false"
            animate-lines
            :copy-aria-label="copyAriaLabel"
          />
        </div>
      </template>
      <template
        v-if="actions.length"
        #actions
      >
        <SectionAction
          v-for="action in actions"
          :key="action.label"
          :action="{ size: 'large', ...action }"
        />
      </template>
    </MediaSplit>
  </SectionModule>
</template>

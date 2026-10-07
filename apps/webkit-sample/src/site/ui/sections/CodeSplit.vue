<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import type { CodeBlockTab } from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MediaSplit from '@aziontech/webkit/media-split'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'CodeSplit' })

  /** default: a framed media split with the code run off its floor; recipes: a section title over the code beside a recipe list. */
  export type CodeSplitKind = 'default' | 'recipes'

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
    files: CodeBlockTab[]
    /** Value of the file open first; empty opens the first file. */
    defaultFile?: string
    /** Accessible name of the copy control. */
    copyAriaLabel?: string
    /** Actions under the copy, in the default layout. */
    actions?: SiteAction[]
    /** Recipes listed beside the code, in the recipes layout. */
    recipes?: SiteTopic[]
  }

  withDefaults(defineProps<Props>(), {
    kind: 'default',
    anchor: '',
    title: '',
    description: '',
    defaultFile: '',
    copyAriaLabel: 'Copy the code sample',
    actions: () => [],
    recipes: () => []
  })
</script>

<template>
  <SectionModule
    v-if="kind === 'default'"
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
        <div
          class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) shadow-(--shadow-sm)"
        >
          <CodeBlock
            :tabs="files"
            :default-value="defaultFile || undefined"
            show-line-numbers
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
          :action="{ size: 'medium', ...action }"
        />
      </template>
    </MediaSplit>
  </SectionModule>

  <SectionModule
    v-else
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        kind="horizontal"
        :title="title"
        :description="description"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="grid lg:grid-cols-2">
        <div class="relative min-w-0 overflow-hidden p-(--spacing-xl)">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 opacity-65 [--texture-pool-a:20%_106%] [--texture-pool-b:80%_102%] mask-[linear-gradient(to_top,black_0,black_16%,transparent_80%)]"
          >
            <TextureMaterial kind="pixelate" />
          </div>

          <div class="relative z-10 min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
            <CodeBlock
              :tabs="files"
              :default-value="defaultFile || undefined"
              show-line-numbers
              animate-lines
              :copy-aria-label="copyAriaLabel"
            />
          </div>
        </div>

        <ul
          class="m-0 flex list-none flex-col gap-(--spacing-xl) border-t border-(--border-default) p-(--spacing-xl) lg:border-t-0 lg:border-l"
        >
          <li
            v-for="recipe in recipes"
            :key="recipe.title"
            class="flex flex-col gap-(--spacing-sm)"
          >
            <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
              {{ recipe.title }}
            </h3>
            <p class="m-0 text-pretty text-body-md text-(--text-muted)">
              {{ recipe.description }}
            </p>
          </li>
        </ul>
      </div>
    </FrameBox>
  </SectionModule>
</template>

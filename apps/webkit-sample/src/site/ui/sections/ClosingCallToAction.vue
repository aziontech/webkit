<script setup lang="ts">
  import CallToAction from '@aziontech/webkit/call-to-action'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'ClosingCallToAction' })

  /** split: the lead and aside actions side by side; panel: one centred ask; frame: the closing frame alone. */
  export type ClosingCallToActionKind = 'split' | 'panel' | 'frame'

  interface Props {
    /** Layout of the closing band. */
    kind?: ClosingCallToActionKind
    /** Overline above the title. */
    eyebrow?: string
    /** The closing ask. */
    title?: string
    /** Second line of the title, in the muted ink. */
    titleMuted?: string
    /** One sentence under the title. */
    description?: string
    /** Actions in the lead cell. */
    actions?: SiteAction[]
    /** Action in the aside cell of the split layout. */
    aside?: SiteAction | null
  }

  withDefaults(defineProps<Props>(), {
    kind: 'split',
    eyebrow: '',
    title: '',
    titleMuted: '',
    description: '',
    actions: () => [],
    aside: null
  })
</script>

<template>
  <SectionModule
    v-if="kind !== 'frame'"
    id="contact"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <CallToAction
      framed
      :kind="kind === 'split' ? 'split' : 'panel'"
      :eyebrow="eyebrow"
      :title="title"
      :title-muted="titleMuted"
      :description="description"
    >
      <template #actions>
        <SectionAction
          v-for="action in actions"
          :key="action.label"
          :action="action"
        />
      </template>
      <template
        v-if="kind === 'split' && aside"
        #aside
      >
        <SectionAction :action="{ kind: 'outlined', trailing: true, ...aside }" />
      </template>
    </CallToAction>
  </SectionModule>
  <FrameBox
    borders="none"
    marks="all"
    data-hatch="true"
    :data-size="kind === 'panel' ? 'small' : 'large'"
    class="h-[calc(var(--spacing-xxl)*2)] data-[size=small]:h-(--spacing-xxl)"
  >
    <TextureMaterial kind="lines" />
  </FrameBox>
</template>

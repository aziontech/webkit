<script setup lang="ts">
  import SectionModule from '@aziontech/webkit/section-module'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'IntroBand' })

  export type IntroBandKind = 'intro' | 'tools'

  interface Props {
    /** Where the actions sit: the header's actions row, or a wrapping row of tools in the body. */
    kind?: IntroBandKind
    /** Overline above the headline. */
    eyebrow?: string
    /** The band headline. */
    title: string
    /** Supporting copy under the headline. */
    description?: string
    /** Actions closing the band. */
    actions?: SiteAction[]
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    kind: 'intro',
    eyebrow: '',
    description: '',
    actions: () => [],
    anchor: ''
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="kind === 'tools'"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
  >
    <template
      v-if="kind === 'intro' && actions.length"
      #actions
    >
      <SectionAction
        v-for="action in actions"
        :key="action.label"
        :action="action"
      />
    </template>

    <div
      v-if="kind === 'tools' && actions.length"
      class="flex flex-wrap gap-(--spacing-sm)"
    >
      <SectionAction
        v-for="action in actions"
        :key="action.label"
        :action="action"
      />
    </div>
  </SectionModule>
</template>

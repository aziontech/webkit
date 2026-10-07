<script setup lang="ts">
  import ContentColumns from '@aziontech/webkit/content-columns'
  import type { ContentColumnItem } from '@aziontech/webkit/content-columns'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  defineOptions({ name: 'GuaranteeColumns' })

  /** default: the eyebrowed headline sits start-aligned inside the frame; centered: a centred headline heads the band above the frame. */
  export type GuaranteeColumnsKind = 'default' | 'centered'

  interface Props {
    /** Layout of the headline. */
    kind?: GuaranteeColumnsKind
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the headline. */
    eyebrow?: string
    /** The band's headline. */
    title: string
    /** One or more sentences under the headline. */
    description?: string
    /** Three points, each a short title and the sentence that develops it. */
    items: ContentColumnItem[]
  }

  withDefaults(defineProps<Props>(), {
    kind: 'default',
    anchor: '',
    eyebrow: '',
    description: ''
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template
      v-if="kind === 'centered'"
      #header
    >
      <SectionTitle
        kind="centered"
        :eyebrow="eyebrow"
        :title="title"
        :description="description"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <ContentColumns
        v-if="kind === 'centered'"
        :items="items"
        :columns="3"
      />
      <div
        v-else
        class="p-(--spacing-xl)"
      >
        <ContentColumns
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
          :items="items"
          :columns="3"
        />
      </div>
    </FrameBox>
  </SectionModule>
</template>

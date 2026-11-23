<script setup lang="ts">
  import Module from '../../layout/module/module.vue'
  import ModuleHeader, {
    type ModuleHeaderAlign
  } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame, {
    type RegistrationFrameMarks
  } from '../../layout/registration-frame/registration-frame.vue'

  defineOptions({
    name: 'SectionBand',
    inheritAttrs: false
  })

  interface SectionBandProps {
    /** Id set on the band so an in-page hash link can target it. */
    anchor?: string
    /** Eyebrow above the heading. */
    eyebrow?: string
    /** Headline of the band and its accessible name; no header renders when empty. */
    title?: string
    /** Placement of the heading. */
    align?: ModuleHeaderAlign
    /** Corner marks of the frame around the content. */
    marks?: RegistrationFrameMarks
    /** Renders the module; false leaves an empty band. */
    filled?: boolean
  }

  withDefaults(defineProps<SectionBandProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    align: 'start',
    marks: 'all',
    filled: true
  })

  defineSlots<{
    /** The framed content of the band, usually a grid of cells. */
    default(): unknown
  }>()
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      v-if="filled"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <ModuleHeader
          :align="align"
          :eyebrow="eyebrow"
          :title="title"
        />
      </template>

      <RegistrationFrame
        flush
        borders="y"
        :marks="marks"
      >
        <slot />
      </RegistrationFrame>
    </Module>
  </section>
</template>

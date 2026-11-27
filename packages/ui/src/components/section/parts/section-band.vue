<script setup lang="ts">
  import Module from '../../layout/module/module.vue'
  import ModuleHeader, {
    type ModuleHeaderAlign,
    type ModuleHeaderDescriptionWidth,
    type ModuleHeaderPadding,
    type ModuleHeaderSize
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
    /** Accessible name of the band; the band is a named region only when it is set. */
    label?: string
    /** Renders the module; false leaves an empty band. */
    filled?: boolean
    /** Eyebrow above the heading. */
    eyebrow?: string
    /** Headline of the band; no header renders when empty, unless the header slot is given. */
    title?: string
    /** Supporting sentence of the headline. */
    description?: string
    /** Placement of the heading. */
    align?: ModuleHeaderAlign
    /** Step of the headline on the heading scale. */
    headerSize?: ModuleHeaderSize
    /** Vertical padding step of the header. */
    headerPadding?: ModuleHeaderPadding
    /** Measure of the supporting sentence. */
    descriptionWidth?: ModuleHeaderDescriptionWidth
    /** Wraps the content in the band's registration frame; false hands the content the bare module. */
    framed?: boolean
    /** Corner marks of the frame around the content. */
    marks?: RegistrationFrameMarks
  }

  withDefaults(defineProps<SectionBandProps>(), {
    anchor: '',
    label: '',
    filled: true,
    eyebrow: '',
    title: '',
    description: '',
    align: undefined,
    headerSize: undefined,
    headerPadding: undefined,
    descriptionWidth: undefined,
    framed: true,
    marks: 'all'
  })

  const slots = defineSlots<{
    /** The content of the band, usually a grid of cells. */
    default(): unknown
    /** Replaces the band's header row. */
    header?(): unknown
    /** Buttons at the end of the header row. */
    'header-actions'?(): unknown
    /** Rendered after the module, inside the band. */
    after?(): unknown
  }>()
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :aria-label="label || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      v-if="filled"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="slots.header || title"
        #header
      >
        <slot name="header">
          <ModuleHeader
            :align="align"
            :size="headerSize"
            :padding="headerPadding"
            :description-width="descriptionWidth"
            :eyebrow="eyebrow"
            :title="title"
            :description="description"
          >
            <template
              v-if="slots['header-actions']"
              #actions
            >
              <slot name="header-actions" />
            </template>
          </ModuleHeader>
        </slot>
      </template>

      <RegistrationFrame
        v-if="framed"
        flush
        borders="y"
        :marks="marks"
      >
        <slot />
      </RegistrationFrame>
      <slot v-else />
    </Module>
    <slot name="after" />
  </section>
</template>

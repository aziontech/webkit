<script setup lang="ts">
  import { computed } from 'vue'

  import Button from '../../action/button/button.vue'
  import Module from '../../layout/module/module.vue'
  import ModuleHeader, {
    type ModuleHeaderAction,
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
    /** First large button in the header; shown only with a label and a link. */
    primaryAction?: ModuleHeaderAction
    /** Second large button in the header, outlined; shown only with a label and a link. */
    secondaryAction?: ModuleHeaderAction
    /** Button variant of the first action. */
    primaryVariant?: 'secondary' | 'outline'
    /** Wraps the content in the band's registration frame; false hands the content the bare module. */
    framed?: boolean
    /** Corner marks of the frame around the content. */
    marks?: RegistrationFrameMarks
  }

  const props = withDefaults(defineProps<SectionBandProps>(), {
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
    primaryAction: undefined,
    secondaryAction: undefined,
    primaryVariant: 'secondary',
    framed: true,
    marks: 'all'
  })

  const slots = defineSlots<{
    /** The content of the band, usually a grid of cells. */
    default(): unknown
    /** Replaces the band's header row. */
    header?(): unknown
    /** Replaces the header's buttons. */
    'header-actions'?(): unknown
    /** Rendered after the module, inside the band. */
    after?(): unknown
  }>()

  const shown = (action: ModuleHeaderAction | undefined): action is ModuleHeaderAction =>
    Boolean(action?.label && action.href)

  const actions = computed(() => {
    const named: (ModuleHeaderAction & { variant: 'secondary' | 'outline' })[] = []
    if (shown(props.primaryAction))
      named.push({ ...props.primaryAction, variant: props.primaryVariant })
    if (shown(props.secondaryAction)) named.push({ ...props.secondaryAction, variant: 'outline' })
    return named
  })
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
              v-if="slots['header-actions'] || actions.length"
              #actions
            >
              <slot name="header-actions">
                <Button
                  v-for="action in actions"
                  :key="action.label"
                  :label="action.label"
                  :href="action.href"
                  :target="action.target"
                  :variant="action.variant"
                  :icon="action.trailing ? 'az az-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(action.trailing)"
                />
              </slot>
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

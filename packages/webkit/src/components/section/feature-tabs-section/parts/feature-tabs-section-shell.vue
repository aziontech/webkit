<script setup lang="ts">
  import { computed } from 'vue'

  import Button from '../../../action/button/button.vue'
  import Module from '../../../layout/module/module.vue'
  import type {
    ModuleHeaderAction,
    ModuleHeaderAlign,
    ModuleHeaderPadding,
    ModuleHeaderSize
  } from '../../../layout/module-header/module-header.vue'
  import ModuleHeader from '../../../layout/module-header/module-header.vue'

  defineOptions({ name: 'FeatureTabsSectionShell' })

  interface Props {
    /** In-page id set on the band. */
    anchor: string
    /** Eyebrow above the section title. */
    eyebrow: string
    /** Headline of the band; the band renders no header when empty. */
    title: string
    /** Supporting sentence of the headline. */
    description: string
    /** Number of items in the band's body; the band renders nothing inside when zero. */
    itemCount: number
    /** Layout of the section title. */
    align?: ModuleHeaderAlign
    /** Step of the headline on the heading scale. */
    headerSize?: ModuleHeaderSize
    /** Vertical padding step of the header. */
    headerPadding?: ModuleHeaderPadding
    /** First large button in the section title; shown only with a label and a link. */
    primaryAction?: ModuleHeaderAction
    /** Second large button in the section title, outlined; shown only with a label and a link. */
    secondaryAction?: ModuleHeaderAction
    /** Button variant of the first action. */
    primaryVariant?: 'secondary' | 'outline'
  }

  const props = withDefaults(defineProps<Props>(), {
    align: undefined,
    headerSize: undefined,
    headerPadding: undefined,
    primaryAction: undefined,
    secondaryAction: undefined,
    primaryVariant: 'secondary'
  })

  defineSlots<{
    /** The framed body under the header. */
    default(): unknown
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
    :id="anchor || undefined"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      v-if="itemCount > 0"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <ModuleHeader
          :align="align"
          :size="headerSize"
          :padding="headerPadding"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template
            v-if="actions.length"
            #actions
          >
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
          </template>
        </ModuleHeader>
      </template>

      <slot />
    </Module>
  </section>
</template>

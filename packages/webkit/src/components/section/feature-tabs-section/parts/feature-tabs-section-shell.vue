<script setup lang="ts">
  import { computed } from 'vue'

  import Button from '../../../action/button/button.vue'
  import Module from '../../../layout/module/module.vue'
  import type {
    ModuleHeaderAction,
    ModuleHeaderPadding
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
    /** Supporting sentence beside the headline. */
    description: string
    /** Number of tabs; the band renders nothing inside when zero. */
    tabCount: number
    /** Vertical padding step of the header. */
    headerPadding?: ModuleHeaderPadding
    /** Button in the section title. */
    primaryAction?: ModuleHeaderAction
  }

  const props = withDefaults(defineProps<Props>(), {
    headerPadding: 'medium',
    primaryAction: undefined
  })

  defineSlots<{
    /** The framed tabs under the header. */
    default(): unknown
  }>()

  const hasHeader = computed(() => props.title.length > 0)
</script>

<template>
  <section
    :id="anchor || undefined"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      v-if="tabCount > 0"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeader"
        #header
      >
        <ModuleHeader
          align="split"
          :padding="headerPadding"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template
            v-if="primaryAction"
            #actions
          >
            <Button
              :label="primaryAction.label"
              :href="primaryAction.href"
              :target="primaryAction.target"
              variant="secondary"
              :icon="primaryAction.trailing ? 'az az-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(primaryAction.trailing)"
            />
          </template>
        </ModuleHeader>
      </template>

      <slot />
    </Module>
  </section>
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import ModuleHeader from '../module-header/module-header.vue'

  defineOptions({
    name: 'Module',
    inheritAttrs: false
  })

  /** Layout of the default header row. */
  export type ModuleAlign = 'start' | 'center' | 'split'

  export interface ModuleProps {
    /** Headline of the module's header row, rendered as its `h2`. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** Layout of the default header row. */
    align?: ModuleAlign
    /** Draw the top rule that divides this module from the one above it. */
    divided?: boolean
    /** Pad the module's body. Leave off for an edge-to-edge grid that owns its cell padding. */
    padded?: boolean
  }

  const props = withDefaults(defineProps<ModuleProps>(), {
    title: '',
    description: '',
    eyebrow: '',
    align: 'start',
    divided: true,
    padded: true
  })

  const slots = defineSlots<{
    /** The module's body. */
    default?(): unknown
    /** Replaces the default header row entirely. */
    header?(): unknown
    /** Trailing controls inside the default header row. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'module')
  const hasHeader = () => Boolean(slots.header || props.title)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-align="align"
    :data-divided="props.divided || null"
    :data-padded="props.padded || null"
    class="w-full data-[divided]:border-t data-[divided]:border-(--border-default)"
  >
    <slot
      v-if="hasHeader()"
      name="header"
    >
      <ModuleHeader
        :align="align"
        :title="title"
        :description="description"
        :eyebrow="eyebrow"
      >
        <template
          v-if="slots.actions"
          #actions
        >
          <slot name="actions" />
        </template>
      </ModuleHeader>
    </slot>

    <div
      :data-padded="props.padded || null"
      :data-frame-edges="!props.padded || null"
      class="data-[padded]:p-(--spacing-xl)"
    >
      <slot />
    </div>
  </section>
</template>

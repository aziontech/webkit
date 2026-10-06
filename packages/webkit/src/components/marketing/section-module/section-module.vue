<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import SectionTitle from '../section-title/section-title.vue'

  defineOptions({
    name: 'SectionModule',
    inheritAttrs: false
  })

  /** Layout of the default header row. */
  export type SectionModuleKind = 'centered' | 'left' | 'horizontal'

  interface Props {
    /** Headline of the module's header row, rendered as its `h2`. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** Layout of the default header row. */
    kind?: SectionModuleKind
    /** Draw the top rule that divides this module from the one above it. */
    divided?: boolean
    /** Pad the module's body. Leave off for an edge-to-edge grid that owns its cell padding. */
    padded?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    eyebrow: '',
    kind: 'left',
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
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'marketing-section-module')
  const hasHeader = computed(() => Boolean(slots.header || props.title))
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-divided="props.divided || null"
    :data-padded="props.padded || null"
    class="w-full data-[divided]:border-t data-[divided]:border-(--border-default)"
  >
    <slot
      v-if="hasHeader"
      name="header"
    >
      <SectionTitle
        :kind="kind"
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
      </SectionTitle>
    </slot>

    <div
      :data-padded="props.padded || null"
      class="data-[padded]:p-(--spacing-xl)"
    >
      <slot />
    </div>
  </section>
</template>

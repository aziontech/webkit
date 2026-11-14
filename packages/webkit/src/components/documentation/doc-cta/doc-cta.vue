<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import DocCallToAction from '../doc-call-to-action/doc-call-to-action.vue'

  /** @deprecated since 6.0 — use `DocCallToAction` (`@aziontech/webkit/doc-call-to-action`) instead. Removed in 7.0. */
  defineOptions({ name: 'DocCta', inheritAttrs: false })

  interface Props {
    /** The offer's headline; names the complementary landmark. */
    title?: string
    /** Fallback copy when the default slot is empty. */
    label?: string
    /** The primary action's label; empty renders no primary action. */
    primaryLabel?: string
    /** Where the primary action goes. */
    primaryHref?: string
    /** The secondary action's label; empty renders no secondary action. */
    secondaryLabel?: string
    /** Where the secondary action goes. */
    secondaryHref?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    label: '',
    primaryLabel: '',
    primaryHref: '',
    secondaryLabel: '',
    secondaryHref: ''
  })

  const slots = defineSlots<{
    /** The offer's copy, set as the headline's subtitle. */
    default?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-cta'
  )
</script>

<template>
  <DocCallToAction
    v-bind="$attrs"
    :data-testid="testId"
    :title="title"
    :label="label"
    :primary-action="{ label: props.primaryLabel, href: props.primaryHref }"
    :secondary-action="{ label: props.secondaryLabel, href: props.secondaryHref }"
  >
    <template
      v-if="slots.default"
      #default
    >
      <slot />
    </template>
  </DocCallToAction>
</template>

<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Brand from '../../content/brand/brand.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'

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

  withDefaults(defineProps<Props>(), {
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
  const titleId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-cta'
  )
</script>

<template>
  <FrameBox
    v-bind="$attrs"
    :data-testid="testId"
    role="complementary"
    :aria-labelledby="title ? titleId : undefined"
    class="w-full"
  >
    <div class="flex flex-col bg-(--bg-surface) px-6 py-5">
      <Brand
        kind="default"
        size="small"
        class="mb-(--spacing-md) [&>svg]:h-3.5!"
      />

      <p
        v-if="title"
        :id="titleId"
        class="m-0 text-heading-xxs text-(--text-default)"
      >
        {{ title }}
      </p>

      <p
        v-if="slots.default || label"
        class="m-0 mt-(--spacing-xxs) text-body-xs text-(--text-muted)"
      >
        <slot>{{ label }}</slot>
      </p>

      <div
        v-if="primaryLabel || secondaryLabel"
        class="mt-(--spacing-md) flex flex-col gap-(--spacing-xs)"
      >
        <Button
          v-if="primaryLabel"
          :label="primaryLabel"
          :href="primaryHref"
          size="medium"
          class="w-full"
        />
        <Button
          v-if="secondaryLabel"
          key="secondary"
          :label="secondaryLabel"
          :href="secondaryHref"
          kind="outlined"
          size="medium"
          class="w-full"
        />
      </div>
    </div>
  </FrameBox>
</template>

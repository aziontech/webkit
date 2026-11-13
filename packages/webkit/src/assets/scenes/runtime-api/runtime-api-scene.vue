<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import RuntimeApiCloud from './runtime-api-cloud.vue'

  defineOptions({ name: 'RuntimeApiScene', inheritAttrs: false })

  interface Props {
    /** Accessible name of the list of globals; empty uses the built-in "Globals available in the Azion Runtime". */
    ariaLabel?: string
    /** Hands the highlight from pill to pill and drifts the rows with the page scroll; off draws the field at rest. */
    animated?: boolean
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    animated: true
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'assets-runtime-api-scene'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="relative flex h-[min(52vh,26rem)] w-full min-w-0 items-center justify-center overflow-hidden lg:h-full"
  >
    <div
      class="relative w-full [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_78%,transparent_100%),linear-gradient(to_right,transparent_0%,black_14%,black_90%,transparent_100%)]"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--primary)_9%,transparent)_0%,color-mix(in_srgb,var(--primary)_3%,transparent)_48%,transparent_80%)]"
      />
      <RuntimeApiCloud
        :aria-label="ariaLabel"
        :animated="animated"
        :data-testid="`${testId}__cloud`"
        class="relative z-10"
      />
    </div>
  </div>
</template>

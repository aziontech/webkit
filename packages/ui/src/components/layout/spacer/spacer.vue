<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Texture from '../../content/texture/texture.vue'
  import RegistrationFrame from '../registration-frame/registration-frame.vue'

  defineOptions({
    name: 'Spacer',
    inheritAttrs: false
  })

  /** How much vertical air the gap holds. */
  export type SpacerSize = 'small' | 'medium' | 'large'

  export interface SpacerProps {
    /**
     * How much vertical air the gap holds, as a multiple of the theme's largest spacing step:
     * `small` is one `--spacing-2xl`, `medium` two, `large` three. The token is responsive, so
     * every step scales with the viewport.
     */
    size?: SpacerSize
    /** Draw the gap's ruled line texture — fine vertical rules at a fixed pitch. */
    hatch?: boolean
  }

  withDefaults(defineProps<SpacerProps>(), {
    size: 'medium',
    hatch: false
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'spacer')
</script>

<template>
  <RegistrationFrame
    v-bind="$attrs"
    flush
    borders="y"
    marks="all"
    :data-testid="testId"
    :data-size="size"
    :data-hatch="hatch || null"
    class="h-[calc(var(--spacing-2xl)*2)] data-[size=small]:h-(--spacing-2xl) data-[size=large]:h-[calc(var(--spacing-2xl)*3)]"
  >
    <Texture
      v-if="hatch"
      variant="lines"
      :data-testid="`${testId}__hatch`"
    />
  </RegistrationFrame>
</template>

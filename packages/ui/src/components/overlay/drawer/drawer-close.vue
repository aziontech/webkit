<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerClose',
    inheritAttrs: false
  })

  export interface DrawerCloseProps {
    /** Accessible label for the close control. Empty uses the locale catalog (`Close`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<DrawerCloseProps>(), {
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ drawer: en.drawer })
  const ctx = inject(DrawerInjectionKey)
  const testId = computed(() => String(attrs['data-testid'] ?? 'drawer-close'))

  const onClick = () => {
    ctx?.close()
  }
</script>

<template>
  <IconButton
    v-if="ctx"
    icon="az az-x"
    variant="outline"
    size="small"
    :ariaLabel="props.ariaLabel || t('drawer.close')"
    :data-testid="testId"
    :class="attrs.class"
    @click="onClick"
  />
</template>

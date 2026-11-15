<script setup lang="ts">
  import { inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerClose',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Accessible label for the close control. Empty uses the locale catalog (`Close`). */
      ariaLabel?: string
    }>(),
    {
      ariaLabel: ''
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ drawer: en.drawer })
  const ctx = inject(DrawerInjectionKey)

  const onClick = () => {
    ctx?.close()
  }
</script>

<template>
  <IconButton
    v-if="ctx"
    icon="ai ai-x"
    variant="outline"
    size="small"
    :ariaLabel="props.ariaLabel || t('drawer.close')"
    :data-testid="`${ctx.testId}__close`"
    :class="attrs.class"
    @click="onClick"
  />
</template>

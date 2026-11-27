<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import { DialogInjectionKey } from './injection-key'

  defineOptions({
    name: 'DialogClose',
    inheritAttrs: false
  })

  export interface DialogCloseProps {
    /** Accessible label for the close control. Empty uses the locale catalog (`Close`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<DialogCloseProps>(), {
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ dialog: en.dialog })
  const ctx = inject(DialogInjectionKey)
  const testId = computed(() => String(attrs['data-testid'] ?? 'dialog-close'))

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
    :ariaLabel="props.ariaLabel || t('dialog.close')"
    :data-testid="testId"
    :class="attrs.class"
    @click="onClick"
  />
</template>

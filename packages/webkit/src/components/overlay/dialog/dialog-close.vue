<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import { DialogInjectionKey } from './injection-key'

  defineOptions({
    name: 'DialogClose',
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
  const { t } = useTranslate({ dialog: en.dialog })
  const ctx = inject(DialogInjectionKey)

  const handleClick = () => {
    ctx?.close()
  }

  const isDisabled = computed(() => !ctx?.dismissible)
</script>

<template>
  <IconButton
    v-if="ctx"
    icon="pi pi-times"
    kind="outlined"
    size="small"
    :ariaLabel="props.ariaLabel || t('dialog.close')"
    :disabled="isDisabled"
    :data-testid="`${ctx.testId}__close`"
    :class="attrs.class"
    @click="handleClick"
  />
</template>

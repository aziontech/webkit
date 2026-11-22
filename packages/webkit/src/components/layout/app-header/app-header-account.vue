<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Avatar from '../../content/avatar/avatar.vue'

  defineOptions({
    name: 'AppHeaderAccount',
    inheritAttrs: false
  })

  export interface AppHeaderAccountProps {
    /** Name of the signed-in account; the avatar draws its first two characters as initials. */
    name?: string
    /** Photo URL of the account; replaces the initials. */
    src?: string
    /** Accessible name of the account control. Empty uses the locale catalog (`Account menu`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<AppHeaderAccountProps>(), {
    name: '',
    src: '',
    ariaLabel: ''
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ appHeader: en.appHeader })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'app-header-account'
  )

  const ROOT_CLASS =
    'rounded-(--shape-button) transition-opacity duration-fast-02 ease-productive-entrance ' +
    'hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :aria-label="props.ariaLabel || t('appHeader.account')"
    :data-testid="testId"
    :class="ROOT_CLASS"
    @click="(event: MouseEvent) => emit('click', event)"
  >
    <Avatar
      :src="src"
      :label="name"
      size="medium"
      variant="square"
    />
  </button>
</template>

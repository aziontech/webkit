<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'HelpPanelHeader',
    inheritAttrs: false
  })

  interface Props {
    /** The topic's name, rendered as the panel's heading. */
    title?: string
    /** One line under the title saying what the topic covers; not rendered when empty. */
    description?: string
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    description: ''
  })

  defineSlots<{
    /** Optional extra content under the description. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-help-panel-header'
  )
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <h2
      v-if="title"
      class="text-heading-xs text-(--text-default)"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="text-body-sm text-(--text-muted)"
    >
      {{ description }}
    </p>
    <slot />
  </header>
</template>

<script setup lang="ts">
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  interface Props {
    label?: string
    to?: string | Record<string, unknown>
    href?: string
    module?: string
    tooltip?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    to: null,
    href: '',
    module: '',
    tooltip: ''
  })

  const isLink = computed(() => Boolean(props.to || props.href))

  const tag = computed(() => {
    if (props.href) return 'a'
    return props.to ? 'router-link' : 'span'
  })

  const tooltipText = computed(() => {
    if (props.tooltip) return props.tooltip
    if (!isLink.value) return ''
    if (props.href) return `Open ${props.label} in a new tab`
    return props.module ? `Open ${props.label} in ${props.module}` : `Open ${props.label}`
  })
</script>

<template>
  <Tooltip
    :text="tooltipText"
    :disabled="!isLink"
    class="min-w-0 shrink!"
  >
    <component
      :is="tag"
      :to="tag === 'router-link' ? to : undefined"
      :href="href || undefined"
      :target="href ? '_blank' : undefined"
      :rel="href ? 'noopener noreferrer' : undefined"
      class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
      @click.stop
    >
      <span
        class="truncate underline-offset-2"
        :class="isLink ? 'group-hover/link:underline' : ''"
      >
        {{ label }}
      </span>
      <span
        v-if="href"
        class="sr-only"
        >{{ ' (opens in a new tab)' }}</span
      >
      <i
        v-if="isLink"
        class="pi pi-external-link shrink-0 text-body-xs leading-none"
        aria-hidden="true"
      />
    </component>
  </Tooltip>
</template>

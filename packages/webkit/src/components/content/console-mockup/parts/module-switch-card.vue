<script setup lang="ts">
  import LegacySwitch from './legacy-switch.vue'

  defineOptions({ name: 'ModuleSwitchCard' })

  interface Props {
    /** Name of the module. */
    title: string
    /** What the module does. */
    description: string
    /** Whether the module is switched on. */
    checked?: boolean
    /** Whether the switch is locked. */
    disabled?: boolean
    /** Key the collaborator cursor finds the switch by. */
    cursorKey?: string
  }

  withDefaults(defineProps<Props>(), { checked: false, disabled: false, cursorKey: undefined })

  defineSlots<{
    /** Content under the description. */
    default(): unknown
  }>()

  const ROOT_CLASS =
    'flex items-start gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md) transition-colors duration-moderate-01 ease-productive-entrance ' +
    'data-on:border-(--primary) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <div
    :data-on="checked || null"
    :class="ROOT_CLASS"
  >
    <LegacySwitch
      :checked="checked"
      :disabled="disabled"
      :data-cursor="cursorKey"
    />
    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
      <span class="text-label-md text-(--text-default)">{{ title }}</span>
      <span class="text-body-xs text-(--text-muted)">{{ description }}</span>
      <slot />
    </span>
  </div>
</template>

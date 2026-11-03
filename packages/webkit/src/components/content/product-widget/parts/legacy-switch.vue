<script setup lang="ts">
  defineOptions({ name: 'LegacySwitch' })

  interface Props {
    /** Whether the switch shows as checked. */
    checked?: boolean
    /** Whether the switch shows the read-only state of a published version. */
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), { checked: false, disabled: false })
</script>

<template>
  <span
    :data-checked="checked || null"
    :data-disabled="disabled || null"
    class="group flex h-5 w-9 shrink-0 items-center rounded-full bg-(--border-default) px-0.5 transition-colors duration-moderate-01 ease-productive-entrance data-checked:bg-(--primary) data-checked:data-disabled:bg-[color-mix(in_srgb,var(--primary)_40%,transparent)] motion-reduce:transition-none"
  >
    <span
      class="size-4 rounded-full bg-(--text-muted) transition-[translate,background-color] duration-moderate-01 ease-productive-entrance group-data-checked:translate-x-4 group-data-checked:bg-(--color-base-white) group-data-disabled:bg-(--text-muted) motion-reduce:transition-none"
    />
  </span>
</template>

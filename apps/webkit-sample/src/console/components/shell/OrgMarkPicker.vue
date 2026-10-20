<script setup lang="ts">
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'

  import { orgAccents } from '../../lib/state/organizations.js'

  interface Props {
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    disabled: false
  })

  const accent = defineModel({ type: String, default: orgAccents[0].value })

  const items = orgAccents.map((entry) => ({
    value: entry.value,
    label: entry.label,
    ariaLabel: `${entry.label} mark`
  }))

  const swatchOf = (value) => {
    const { colors } = orgAccents.find((entry) => entry.value === value) ?? orgAccents[0]
    return { backgroundImage: `linear-gradient(135deg, ${colors.join(', ')})` }
  }
</script>

<template>
  <BoxGridSelection
    v-model="accent"
    :items="items"
    :disabled="disabled"
    aria-label="Organization mark"
    class="grid w-full grid-cols-4 sm:grid-cols-7"
  >
    <template #default="{ item }">
      <span class="flex flex-col items-center gap-(--spacing-xs)">
        <span
          class="size-(--size-8) rounded-full"
          :style="swatchOf(item.value)"
        />
        <span class="text-body-xs text-(--text-muted)">{{ item.label }}</span>
      </span>
    </template>
  </BoxGridSelection>
</template>

<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import { computed } from 'vue'

  defineOptions({ name: 'SettingsCollapsible' })

  interface Props {
    /** Header text of the section. */
    title: string
  }

  defineProps<Props>()

  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    /** The section's fields. */
    default(): unknown
  }>()

  const SECTION = 'section'

  const accordionValue = computed({
    get: () => (open.value ? SECTION : null),
    set: (next) => {
      open.value = next === SECTION
    }
  })
</script>

<template>
  <div class="overflow-hidden rounded-(--shape-card) border border-(--border-default)">
    <div class="-mb-px">
      <Accordion
        v-model:value="accordionValue"
        type="single"
        collapsible
        size="large"
        arrow-position="left"
      >
        <Accordion.Item :value="SECTION">
          <Accordion.Trigger>
            <span class="text-label-sm text-(--text-default)">{{ title }}</span>
          </Accordion.Trigger>
          <Accordion.Content>
            <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-md)">
              <slot />
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  </div>
</template>

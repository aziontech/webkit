<script setup lang="ts">
  import HeadingAction from './HeadingAction.vue'

  interface Props {
    title?: string
    description?: string
    size?: 'small' | 'medium' | 'large'
    documentation?: string
    documentationLabel?: string
    titleId?: string
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    size: 'small',
    documentation: '',
    documentationLabel: 'Documentation'
  })

  defineSlots<{
    'title-suffix'(): unknown
    description(): unknown
    actions(): unknown
  }>()
</script>

<template>
  <header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
    <div
      v-if="title || description || $slots.description"
      class="flex min-w-0 flex-col gap-(--spacing-xxs)"
    >
      <div
        v-if="title"
        class="flex min-w-0 items-center gap-(--spacing-xs)"
      >
        <h1
          :id="titleId"
          :data-size="size"
          class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
        >
          {{ title }}
        </h1>
        <slot name="title-suffix" />
      </div>
      <p
        v-if="description || $slots.description"
        class="text-pretty text-body-sm text-(--text-muted)"
      >
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    <div
      v-if="documentation || $slots.actions"
      class="flex w-full flex-wrap items-center gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-nowrap"
    >
      <HeadingAction
        v-if="documentation"
        :label="documentationLabel"
        :href="documentation"
        icon="pi pi-book"
        kind="outlined"
        target="_blank"
      />
      <slot name="actions" />
    </div>
  </header>
</template>

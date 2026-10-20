<script setup lang="ts">
  interface Props {
    active?: boolean
    title?: string
    description?: string
  }

  withDefaults(defineProps<Props>(), {
    active: false,
    title: 'Drop your project to deploy it',
    description: 'A project folder, or the files inside one. Azion reads what it is built with.'
  })
</script>

<template>
  <Transition
    enter-active-class="animate-fade-in motion-reduce:animate-none"
    leave-active-class="animate-fade-out motion-reduce:animate-none"
  >
    <div
      v-if="active"
      aria-hidden="true"
      class="pointer-events-none absolute inset-[var(--drop-zone-inset,0)] z-40 overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-selected) bg-(--bg-canvas)"
    >
      <div
        class="sticky top-0 flex h-dvh max-h-full flex-col items-center justify-center gap-(--spacing-md) p-(--spacing-lg) text-center"
      >
        <span
          class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
        >
          <i
            class="pi pi-cloud-upload text-body-lg leading-none text-(--text-default)"
            aria-hidden="true"
          />
        </span>
        <div class="flex max-w-(--container-md) flex-col gap-(--spacing-xxs)">
          <p class="text-heading-xs text-(--text-default)">{{ title }}</p>
          <p class="text-pretty text-body-sm text-(--text-muted)">{{ description }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

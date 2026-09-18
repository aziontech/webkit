<script setup>
  defineProps({
    /** Whether a file drag is currently over the window. */
    active: { type: Boolean, default: false },
    /** Heading shown on the drop surface. */
    title: { type: String, default: 'Drop your project to deploy it' },
    /** One line under it. */
    description: {
      type: String,
      default: 'A project folder, or the files inside one. Azion reads what it is built with.'
    }
  })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="animate-fade-in motion-reduce:animate-none"
      leave-active-class="animate-fade-out motion-reduce:animate-none"
    >
      <div
        v-if="active"
        aria-hidden="true"
        class="pointer-events-none fixed inset-0 z-(--z-input-overlay) flex items-center justify-center bg-(--bg-backdrop) p-(--spacing-xl)"
      >
        <div
          class="animate-popup-scale-in motion-reduce:animate-none flex w-full max-w-(--container-md) flex-col items-center gap-(--spacing-md) rounded-(--shape-card) border-2 border-dashed border-(--border-selected) bg-(--bg-surface) p-(--spacing-xl) text-center"
        >
          <span
            class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
          >
            <i
              class="pi pi-cloud-upload text-[1.25rem] leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>
          <div class="flex flex-col gap-(--spacing-xxs)">
            <p class="text-heading-xs text-(--text-default)">{{ title }}</p>
            <p class="text-pretty text-body-sm text-(--text-muted)">{{ description }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

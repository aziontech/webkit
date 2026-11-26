<script setup lang="ts">
  export interface ProjectDropTargetProps {
    /** The application a dropped project builds. */
    name: string
    /** Files hover the page. */
    dragging: boolean
  }

  defineProps<ProjectDropTargetProps>()

  const DROP_ZONE_CLASS =
    'pointer-events-none absolute inset-[var(--drop-zone-inset,0)] z-40 overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-selected) bg-(--bg-canvas) ' +
    '[--drop-zone-inset:var(--layout-boundary-inline)]'
</script>

<template>
  <Transition
    enter-active-class="animate-fade-in motion-reduce:animate-none"
    leave-active-class="animate-fade-out motion-reduce:animate-none"
  >
    <div
      v-if="dragging"
      aria-hidden="true"
      :class="DROP_ZONE_CLASS"
    >
      <div
        class="sticky top-0 flex h-dvh max-h-full flex-col items-center justify-center gap-(--spacing-md) p-(--spacing-lg) text-center"
      >
        <span
          class="flex size-12 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised)"
        >
          <i
            class="az az-cloud-upload text-body-lg leading-none text-(--text-default)"
            aria-hidden="true"
          />
        </span>
        <div class="flex max-w-(--container-md) flex-col gap-(--spacing-2xs)">
          <p class="text-title-sm text-(--text-default)">Drop your project to deploy it</p>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            We build a new version of {{ name }}, then you choose where it goes live.
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

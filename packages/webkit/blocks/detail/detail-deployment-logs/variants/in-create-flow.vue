<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <Card
    :padded="false"
    class="w-full"
  >
    <template #header>
      <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
      <StatusIndicator
        loading
        severity="info"
        label="Cloning"
      />
    </template>

    <template #default>
      <div
        class="flex h-60 animate-fade-in items-center justify-center p-(--spacing-lg) motion-reduce:animate-none"
      >
        <p
          class="sr-only"
          aria-live="polite"
        >
          Cloning acme/web-app to acme
        </p>
        <div
          class="flex items-center"
          aria-hidden="true"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
          >
            <i class="az az-github text-body-lg leading-none" />
          </span>
          <svg
            class="h-0.5 w-20 shrink-0 text-(--primary)"
            viewBox="0 0 80 2"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="1"
              x2="80"
              y2="1"
              stroke="currentColor"
              stroke-width="2"
              stroke-dasharray="2 4"
              class="animate-flow-dash motion-reduce:animate-none"
            />
          </svg>
          <span
            class="flex size-20 shrink-0 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) text-(--primary)"
          >
            <i class="az az-azion text-heading-lg leading-none" />
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>

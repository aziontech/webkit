<script setup lang="ts">
  import type { DiagramNode } from './types'

  defineOptions({ name: 'DiagramNode', inheritAttrs: false })

  interface Props {
    /** The leaf to draw. */
    node: DiagramNode
  }

  defineProps<Props>()

  const markStyle = (url: string) => ({ maskImage: `url("${url}")` })
</script>

<template>
  <div
    v-if="node.kind === 'pill'"
    class="flex items-center @6xl:h-(--size-20)"
  >
    <span
      :data-diagram-node="node.key"
      :data-active="node.active || null"
      class="inline-flex h-(--size-7) items-center gap-(--spacing-xxs) rounded-full border-(length:--border-width-default) border-(--text-muted)/70 bg-(--bg-canvas) px-(--spacing-sm) text-label-code-sm whitespace-nowrap text-(--text-default) data-[active]:border-(--primary)"
    >
      <i
        v-if="node.icon"
        :class="node.icon"
        class="text-label-sm leading-none text-(--text-muted)"
      />
      {{ node.title }}
    </span>
  </div>

  <div
    v-else-if="node.kind === 'tile'"
    :data-diagram-node="node.key"
    :data-active="node.active || null"
    class="flex w-full min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) p-(--spacing-sm) pe-(--spacing-md) data-[active]:border-(--primary)"
  >
    <span
      class="inline-flex size-(--size-7) shrink-0 items-center justify-center rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
    >
      <i
        :class="node.icon"
        class="text-label-sm leading-none"
      />
    </span>
    <span class="min-w-0 text-label-sm text-(--text-default)">{{ node.title }}</span>
  </div>

  <div
    v-else-if="node.kind === 'app'"
    :data-diagram-node="node.key"
    :data-active="node.active || null"
    class="flex w-full max-w-(--size-72) flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) @6xl:w-(--size-44)"
  >
    <span
      class="border-b-(length:--border-width-default) border-(--border-default) py-(--spacing-sm) text-center text-label-code-md text-(--primary)"
    >
      {{ node.title }}
    </span>
    <span class="flex h-(--size-40) flex-col gap-(--spacing-sm) p-(--spacing-sm)">
      <span class="h-(--size-5) w-1/2 self-end rounded-(--shape-elements) bg-(--primary)/20" />
      <span class="h-(--size-6) w-3/5 rounded-(--shape-elements) bg-(--primary)/20" />
      <span class="w-3/4 flex-1 rounded-(--shape-elements) bg-(--primary)/20" />
    </span>
    <span
      class="flex items-center justify-between border-t-(length:--border-width-default) border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
    >
      <i class="pi pi-user text-label-sm leading-none text-(--primary)" />
      <span
        class="inline-flex size-(--size-5) items-center justify-center rounded-full bg-(--primary) text-(--primary-contrast)"
      >
        <i class="pi pi-arrow-up text-body-xxs leading-none" />
      </span>
    </span>
  </div>

  <div
    v-else
    :data-diagram-node="node.key"
    :data-active="node.active || null"
    class="flex min-h-(--size-16) @6xl:h-(--size-20) w-full max-w-(--size-72) items-center gap-(--spacing-md) rounded-(--shape-card) border-(length:--border-width-default) border-(--text-muted)/70 bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) @6xl:w-auto @6xl:min-w-(--size-60) data-[active]:border-(--primary) data-[active]:shadow-lg data-[active]:shadow-(--primary)/20"
  >
    <span
      class="inline-flex size-(--size-9) shrink-0 items-center justify-center rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
    >
      <span
        v-if="node.mark"
        class="size-(--size-5) bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
        :style="markStyle(node.mark)"
      />
      <img
        v-else-if="node.logo"
        :src="node.logo"
        alt=""
        class="block size-(--size-5)"
      />
      <i
        v-else
        :class="node.icon"
        class="text-label-md leading-none"
      />
    </span>
    <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
      <span class="line-clamp-2 text-label-md text-(--text-default)">{{ node.title }}</span>
      <span
        v-if="node.subtitle"
        class="truncate text-label-code-sm text-(--text-muted)"
        >{{ node.subtitle }}</span
      >
    </span>
  </div>
</template>

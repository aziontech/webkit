<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { DiagramNode } from './types'

  defineOptions({ name: 'DiagramNode', inheritAttrs: false })

  interface Props {
    /** The leaf to draw. */
    node: DiagramNode
  }

  defineProps<Props>()

  const LIT_GLOW =
    "data-[lit]:border-(--primary) data-[lit]:before:pointer-events-none data-[lit]:before:absolute data-[lit]:before:inset-0 data-[lit]:before:rounded-[inherit] data-[lit]:before:content-[''] data-[lit]:before:shadow-[calc(var(--spacing-5)*-1)_0_var(--spacing-11)_calc(var(--spacing-4)*-1)_var(--accent),var(--spacing-5)_0_var(--spacing-11)_calc(var(--spacing-4)*-1)_var(--primary),0_0_var(--spacing-5)_calc(var(--spacing-2)*-1)_var(--primary)]"

  const markStyle = (url: string) => ({ maskImage: `url("${url}")` })
</script>

<template>
  <div
    v-if="node.kind === 'pill'"
    class="flex items-center @6xl:h-(--size-20)"
  >
    <span
      :data-diagram-node="node.key"
      :data-lit="node.lit || null"
      :class="LIT_GLOW"
      class="relative inline-flex h-(--size-7) items-center gap-(--spacing-xxs) rounded-full border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm whitespace-nowrap text-(--text-default) shadow-(--shadow-xs)"
    >
      <i
        v-if="node.icon"
        :class="node.icon"
        class="text-label-sm leading-none text-(--text-muted)"
      />
      {{ node.title }}
    </span>
  </div>

  <Tooltip
    v-else-if="node.kind === 'tile'"
    :text="node.title"
  >
    <FrameBox
      borders="none"
      marks="all"
    >
      <span
        :data-diagram-node="node.key"
        :data-lit="node.lit || null"
        class="flex size-(--size-14) items-center justify-center rounded-(--shape-flat) [border:var(--illustration-rim-width)_solid_transparent] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)] text-(--text-muted) data-[lit]:[background-image:var(--illustration-rim-layers-active)]"
      >
        <i
          :class="node.icon"
          class="text-body-lg leading-none"
        />
      </span>
    </FrameBox>
  </Tooltip>

  <div
    v-else-if="node.kind === 'app'"
    :data-diagram-node="node.key"
    class="flex w-full max-w-(--size-72) flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) p-(--spacing-sm) [mask-image:linear-gradient(to_bottom,black_60%,transparent)] @6xl:w-(--size-44)"
  >
    <span class="flex gap-(--spacing-xxs)">
      <span class="size-(--size-2) rounded-full bg-(--bg-placeholder)" />
      <span class="size-(--size-2) rounded-full bg-(--bg-placeholder)" />
      <span class="size-(--size-2) rounded-full bg-(--bg-placeholder)" />
    </span>
    <span class="text-heading-sm text-(--text-muted)">{{ node.title }}</span>
    <span class="flex flex-col gap-(--spacing-xs)">
      <span class="h-(--size-2) w-4/5 rounded-full bg-(--bg-placeholder)" />
      <span class="h-(--size-2) w-3/5 rounded-full bg-(--bg-placeholder)" />
    </span>
    <span class="h-(--size-14) rounded-(--shape-elements) bg-(--bg-placeholder)" />
    <span class="flex flex-col gap-(--spacing-xs) pb-(--spacing-xs)">
      <span class="h-(--size-2) w-3/5 rounded-full bg-(--bg-placeholder)" />
      <span class="h-(--size-2) w-2/5 rounded-full bg-(--bg-placeholder)" />
    </span>
  </div>

  <div
    v-else-if="node.kind === 'item'"
    :data-diagram-node="node.key"
    :data-lit="node.lit || null"
    :class="LIT_GLOW"
    class="relative flex w-full max-w-(--size-72) items-center gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) shadow-(--shadow-xs) @6xl:w-(--size-72)"
  >
    <span
      v-if="node.mark"
      class="size-(--size-6) shrink-0 bg-(--text-default) mask-center mask-no-repeat mask-contain"
      :style="markStyle(node.mark)"
    />
    <img
      v-else-if="node.logo"
      :src="node.logo"
      alt=""
      class="block size-(--size-6) shrink-0"
    />
    <i
      v-else-if="node.icon"
      :class="node.icon"
      class="shrink-0 text-heading-sm leading-none text-(--text-default)"
    />
    <span class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-label-sm text-(--text-default)">{{ node.title }}</span>
      <span
        v-if="node.eyebrow"
        class="truncate pb-(--spacing-1) text-label-code-sm text-(--text-muted)"
        >{{ node.eyebrow }}</span
      >
    </span>
    <span
      v-if="node.status"
      class="shrink-0"
    >
      <Tag
        :label="node.status.label"
        :severity="node.status.severity"
        size="small"
      />
    </span>
  </div>

  <div
    v-else
    :data-diagram-node="node.key"
    :data-lit="node.lit || null"
    :class="LIT_GLOW"
    class="relative flex w-full max-w-(--size-72) flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) @6xl:w-(--size-60)"
  >
    <span
      class="flex w-full min-w-0 items-center gap-(--spacing-xxs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs)"
    >
      <span
        v-if="node.mark"
        class="size-(--size-3) shrink-0 bg-(--text-muted) mask-center mask-no-repeat mask-contain"
        :style="markStyle(node.mark)"
      />
      <img
        v-else-if="node.logo"
        :src="node.logo"
        alt=""
        class="block size-(--size-3) shrink-0"
      />
      <i
        v-else-if="node.icon"
        :class="node.icon"
        class="shrink-0 text-label-sm leading-none text-(--text-muted)"
      />
      <span
        v-if="node.eyebrow"
        class="truncate text-label-sm text-(--text-muted)"
        >{{ node.eyebrow }}</span
      >
      <Tag
        v-if="node.status"
        :label="node.status.label"
        :severity="node.status.severity"
        size="small"
        class="ml-auto shrink-0"
      />
    </span>
    <span
      class="line-clamp-2 px-(--spacing-md) pb-(--spacing-sm) text-label-sm text-(--text-default)"
    >
      {{ node.title }}
    </span>
  </div>
</template>

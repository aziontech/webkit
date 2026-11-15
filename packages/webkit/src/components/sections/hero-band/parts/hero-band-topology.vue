<script setup lang="ts">
  import Tag from '../../../content/tag/tag.vue'
  import Flow from '../../../data/flow/flow.vue'
  import FlowAnchor from '../../../data/flow/flow-anchor/flow-anchor.vue'
  import FlowNode from '../../../data/flow/flow-node/flow-node.vue'
  import FlowParallel from '../../../data/flow/flow-parallel/flow-parallel.vue'
  import type { HeroBandNode } from '../hero-band.vue'

  defineOptions({ name: 'HeroBandTopology' })

  defineProps<{
    columns: HeroBandNode[][]
  }>()
</script>

<template>
  <Flow
    align="center"
    class="w-[40rem] shrink-0 @4xl:w-(--container-3xl) [&>div]:w-full"
  >
    <FlowParallel
      v-for="(nodes, index) in columns"
      :key="index"
      align="start"
      class="min-w-0 flex-1 @4xl:min-w-[15rem]"
    >
      <FlowNode
        v-for="node in nodes"
        :key="node.title"
        unstyled
        class="flex w-full flex-col rounded-(--shape-card) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none has-[[data-lit]]:border-(--primary) has-[[data-lit]]:before:pointer-events-none has-[[data-lit]]:before:absolute has-[[data-lit]]:before:inset-0 has-[[data-lit]]:before:rounded-[inherit] has-[[data-lit]]:before:shadow-[-22px_0_44px_-16px_var(--accent),22px_0_44px_-16px_var(--primary),0_0_20px_-8px_var(--primary)] has-[[data-lit]]:before:content-['']"
      >
        <FlowAnchor>
          <div
            class="flex w-full items-center gap-(--spacing-2xs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-2xs)"
          >
            <i
              :class="node.icon"
              class="shrink-0 text-label-sm leading-none text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="truncate text-label-sm text-(--text-muted)">{{ node.eyebrow }}</span>
            <Tag
              class="ms-auto shrink-0"
              :severity="node.severity"
              :label="node.label"
              size="small"
            />
          </div>
        </FlowAnchor>
        <div
          :data-lit="node.lit || null"
          class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
        >
          <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{ node.title }}</span>
        </div>
      </FlowNode>
    </FlowParallel>
  </Flow>
</template>

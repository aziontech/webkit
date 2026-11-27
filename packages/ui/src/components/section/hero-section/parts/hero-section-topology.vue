<script setup lang="ts">
  import Tag from '../../../content/tag/tag.vue'
  import FlowDiagram from '../../../data/flow-diagram/flow-diagram.vue'
  import FlowDiagramAnchor from '../../../data/flow-diagram/flow-diagram-anchor/flow-diagram-anchor.vue'
  import FlowDiagramGroup from '../../../data/flow-diagram/flow-diagram-group/flow-diagram-group.vue'
  import FlowDiagramNode from '../../../data/flow-diagram/flow-diagram-node/flow-diagram-node.vue'
  import type { HeroSectionNode } from '../hero-section.vue'

  defineOptions({ name: 'HeroSectionTopology' })

  defineProps<{
    nodes: HeroSectionNode[][]
  }>()

  const ORIENTATIONS = ['horizontal', 'vertical'] as const

  const DIAGRAM_CLASS =
    'shrink-0 data-[layout=horizontal]:w-[40rem] data-[layout=horizontal]:@max-2xl:hidden data-[layout=horizontal]:@4xl:w-(--container-3xl) ' +
    'data-[layout=vertical]:w-full data-[layout=vertical]:max-w-(--container-xs) data-[layout=vertical]:@2xl:hidden [&>div]:w-full'

  const NODE_CLASS =
    'flex w-full flex-col rounded-(--shape-card) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) ' +
    'transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none ' +
    'has-[[data-lit]]:border-(--primary) has-[[data-lit]]:before:pointer-events-none has-[[data-lit]]:before:absolute has-[[data-lit]]:before:inset-0 ' +
    'has-[[data-lit]]:before:rounded-[inherit] has-[[data-lit]]:before:shadow-[-22px_0_44px_-16px_var(--accent),22px_0_44px_-16px_var(--primary),0_0_20px_-8px_var(--primary)] ' +
    "has-[[data-lit]]:before:content-['']"
</script>

<template>
  <FlowDiagram
    v-for="orientation in ORIENTATIONS"
    :key="orientation"
    :orientation="orientation"
    align="center"
    :data-layout="orientation"
    :class="DIAGRAM_CLASS"
  >
    <FlowDiagramGroup
      v-for="(column, index) in nodes"
      :key="index"
      class="min-w-0 flex-1 @4xl:min-w-[15rem]"
    >
      <FlowDiagramNode
        v-for="node in column"
        :key="node.title"
        unstyled
        :class="NODE_CLASS"
      >
        <FlowDiagramAnchor>
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
        </FlowDiagramAnchor>
        <div
          :data-lit="node.lit || null"
          class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
        >
          <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{ node.title }}</span>
        </div>
      </FlowDiagramNode>
    </FlowDiagramGroup>
  </FlowDiagram>
</template>

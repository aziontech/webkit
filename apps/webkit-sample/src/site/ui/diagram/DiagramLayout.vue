<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'

  import DiagramNode from './DiagramNode.vue'
  import type { DiagramLayoutItem, DiagramNode as DiagramNodeData } from './types'

  defineOptions({ name: 'DiagramLayout', inheritAttrs: false })

  interface Props {
    /** The layout item to draw. */
    item: DiagramLayoutItem
    /** Every leaf of the diagram, by key. */
    nodes: Record<string, DiagramNodeData>
  }

  defineProps<Props>()
</script>

<template>
  <DiagramNode
    v-if="'node' in item && nodes[item.node]"
    :node="nodes[item.node]"
  />

  <div
    v-else-if="'row' in item"
    :data-align="item.align ?? 'center'"
    :data-gap="item.gap ?? 'default'"
    class="flex flex-col items-start gap-(--spacing-xl) self-stretch @6xl:flex-row @6xl:gap-(--spacing-xl) @6xl:self-auto @6xl:data-[align=center]:items-center @6xl:data-[align=start]:items-start @6xl:data-[gap=wide]:gap-(--spacing-xxl)"
  >
    <DiagramLayout
      v-for="(child, index) in item.row"
      :key="index"
      :item="child"
      :nodes="nodes"
    />
  </div>

  <div
    v-else-if="'branches' in item"
    class="ms-(--spacing-12) flex flex-col items-start gap-(--spacing-xl) self-stretch @6xl:ms-0 @6xl:self-auto"
  >
    <DiagramLayout
      v-for="(child, index) in item.branches"
      :key="index"
      :item="child"
      :nodes="nodes"
    />
  </div>

  <div
    v-else-if="'grid' in item"
    :data-columns="item.columns ?? 2"
    class="grid w-fit grid-cols-2 gap-(--spacing-xs) data-[columns=3]:grid-cols-3"
  >
    <DiagramLayout
      v-for="(child, index) in item.grid"
      :key="index"
      :item="child"
      :nodes="nodes"
    />
  </div>

  <div
    v-else-if="'group' in item"
    :data-diagram-node="item.group"
    class="flex flex-col self-stretch @6xl:self-auto"
  >
    <FrameBox
      borders="none"
      marks="all"
    >
      <div
        :data-kind="item.kind ?? 'solid'"
        :data-fill="item.fill ?? 'none'"
        class="flex flex-col gap-(--spacing-md) rounded-(--shape-flat) border-(length:--border-width-default) border-(--border-default) p-(--spacing-lg) data-[fill=primary]:bg-(--primary-mask) data-[fill=secondary]:bg-(--secondary-mask) data-[kind=dashed]:border-dashed"
      >
        <span class="text-label-sm text-(--text-muted)">{{ item.label }}</span>
        <DiagramLayout
          :item="item.content"
          :nodes="nodes"
        />
      </div>
    </FrameBox>
  </div>
</template>

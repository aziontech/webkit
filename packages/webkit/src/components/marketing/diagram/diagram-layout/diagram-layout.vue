<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../../layout/frame-box/frame-box.vue'
  import DiagramNode from '../diagram-node/diagram-node.vue'
  import type { DiagramLayoutItem, DiagramNode as DiagramNodeData } from '../types'

  defineOptions({ name: 'DiagramLayout', inheritAttrs: false })

  interface Props {
    /** The layout item to draw. */
    item: DiagramLayoutItem
    /** Every node of the diagram, by key. */
    nodes: Record<string, DiagramNodeData>
    /** Lays a stacked row out as an indented tree, because the item sits inside one. */
    tree?: boolean
  }

  withDefaults(defineProps<Props>(), { tree: false })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-diagram__layout'
  )
</script>

<template>
  <DiagramNode
    v-if="'node' in item && nodes[item.node]"
    :node="nodes[item.node]"
  />

  <div
    v-else-if="'row' in item"
    v-bind="$attrs"
    :data-testid="testId"
    :data-align="item.align ?? 'center'"
    :data-gap="item.gap ?? 'default'"
    :data-stack="tree || item.row.some((child) => 'branches' in child) ? 'tree' : 'centre'"
    class="flex flex-col items-center gap-(--spacing-xl) self-stretch data-[stack=tree]:items-start @5xl:flex-row @5xl:gap-(--spacing-xl) @5xl:self-auto @5xl:data-[align=center]:items-center @5xl:data-[align=start]:items-start @5xl:data-[gap=wide]:gap-(--spacing-xxl)"
  >
    <DiagramLayout
      v-for="(child, index) in item.row"
      :key="index"
      :item="child"
      :nodes="nodes"
      :tree="tree || item.row.some((entry) => 'branches' in entry)"
    />
  </div>

  <div
    v-else-if="'branches' in item"
    v-bind="$attrs"
    :data-testid="testId"
    data-stack="tree"
    class="ms-(--spacing-12) flex flex-col items-start gap-(--spacing-xl) self-stretch @5xl:ms-0 @5xl:self-auto"
  >
    <DiagramLayout
      v-for="(child, index) in item.branches"
      :key="index"
      :item="child"
      :nodes="nodes"
      :tree="true"
    />
  </div>

  <div
    v-else-if="'grid' in item"
    v-bind="$attrs"
    :data-testid="testId"
    :data-columns="item.columns ?? 2"
    class="grid w-fit grid-cols-2 gap-(--spacing-xs) data-[columns=3]:grid-cols-3"
  >
    <DiagramLayout
      v-for="(child, index) in item.grid"
      :key="index"
      :item="child"
      :nodes="nodes"
      :tree="tree"
    />
  </div>

  <div
    v-else-if="'group' in item"
    v-bind="$attrs"
    :data-testid="testId"
    :data-diagram-node="item.group"
    class="flex flex-col self-stretch @5xl:self-auto"
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
          :tree="tree"
        />
      </div>
    </FrameBox>
  </div>
</template>

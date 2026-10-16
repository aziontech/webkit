<script setup lang="ts">
  import Flow from '@aziontech/webkit/flow'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Overline from '@aziontech/webkit/overline'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import Tag from '@aziontech/webkit/tag'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'Architectures' })

  export interface ArchitectureNode {
    /** Leading glyph, as an icon class. */
    icon: string
    /** The node's role, set as an overline. */
    role: string
    /** The node's name. */
    title: string
    /** One line of detail under the name. */
    detail: string
    /** Lights the node that carries the platform. */
    lit?: boolean
    /** A status tag beside the role. */
    tag?: { label: string; severity: TagSeverity }
  }

  interface Props {
    /** Overline above the headline. */
    eyebrow?: string
    /** Headline of the band. */
    title: string
    /** One or two sentences under the headline. */
    description?: string
    /** Link beside the title block. */
    action?: SiteAction | null
    /** The diagram's columns, left to right, each a list of nodes. */
    levels: ArchitectureNode[][]
  }

  withDefaults(defineProps<Props>(), {
    eyebrow: '',
    description: '',
    action: null
  })
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <div class="flex flex-col bg-(--bg-canvas)">
        <div class="p-(--spacing-xl) pb-0">
          <SectionTitle
            kind="left"
            :framed="false"
            :eyebrow="eyebrow"
            :title="title"
            :description="description"
          >
            <template
              v-if="action"
              #actions
            >
              <SectionAction :action="action" />
            </template>
          </SectionTitle>
        </div>
        <div class="relative overflow-hidden">
          <TextureMaterial
            kind="dots"
            size="medium"
            fade="bottom"
          />
          <div class="relative z-10 overflow-x-auto p-(--spacing-xl)">
            <Flow
              align="center"
              class="[&>div]:mx-auto [&>div]:gap-(--spacing-xxl)"
            >
              <Flow.Parallel
                v-for="(level, index) in levels"
                :key="index"
                align="start"
              >
                <Flow.Node
                  v-for="node in level"
                  :key="node.title"
                  unstyled
                  :data-lit="node.lit || null"
                  class="flex w-56 flex-col gap-(--spacing-xxs) rounded-(--shape-card) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) shadow-(--shadow-xs) data-lit:border-(--primary) data-lit:bg-(--primary-mask) data-lit:shadow-[0_0_24px_-8px_var(--primary)]"
                >
                  <span class="flex items-center gap-(--spacing-xs)">
                    <i
                      :class="[node.icon, 'text-(--text-muted)']"
                      aria-hidden="true"
                    />
                    <Overline class="[&>span]:text-(--text-muted)!">{{ node.role }}</Overline>
                    <span
                      v-if="node.tag"
                      class="ml-auto"
                    >
                      <Tag
                        :label="node.tag.label"
                        :severity="node.tag.severity"
                        size="small"
                      />
                    </span>
                  </span>
                  <span class="text-label-md text-(--text-default)">{{ node.title }}</span>
                  <span class="text-body-xs text-(--text-muted)">{{ node.detail }}</span>
                </Flow.Node>
              </Flow.Parallel>
            </Flow>
          </div>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>

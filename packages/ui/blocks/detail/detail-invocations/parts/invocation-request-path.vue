<script setup lang="ts">
  import FlowDiagram from '@aziontech/ui/flow-diagram'
  import IconButton from '@aziontech/ui/icon-button'
  import Subheader from '@aziontech/ui/subheader'
  import Tag, { type TagSeverity } from '@aziontech/ui/tag'
  import Tooltip from '@aziontech/ui/tooltip'

  /** One resource on the request path. */
  export interface InvocationPathNode {
    /** Identifies the node. */
    key: string
    /** The kind of resource, above its title. */
    eyebrow: string
    /** Icon of the resource kind. */
    icon: string
    /** The resource name. */
    title: string
    /** Its state on this run. */
    label: string
    /** Color of the state. */
    severity: TagSeverity
    /** The trace span the node opens; empty when it has none. */
    spanId: string
    /** The facts listed under the node. */
    fields: { label: string; value: string }[]
  }

  export interface InvocationRequestPathProps {
    /** The resources the request travelled, in order. */
    path: InvocationPathNode[]
  }

  defineProps<InvocationRequestPathProps>()

  const emit = defineEmits<{
    'show-span': [spanId: string]
  }>()

  const FLOW_NODE_CARD_CLASS =
    'flex w-full min-w-0 flex-col ' +
    'in-data-[direction=row]:w-(--size-56) ' +
    'rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) transition-colors duration-moderate-01 ease-productive-entrance ' +
    'hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none'
</script>

<template>
  <section
    aria-label="Request path"
    class="flex min-w-0 flex-col gap-(--layout-group-gap)"
  >
    <Subheader
      title="Request path"
      description="The resources this invocation travelled, and the time it spent in each one."
      size="small"
    />
    <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)">
      <FlowDiagram
        align="start"
        aria-label="Request path"
      >
        <FlowDiagram.Node
          v-for="node in path"
          :key="node.key"
          unstyled
          :terminal="node.key === 'origin'"
        >
          <div :class="FLOW_NODE_CARD_CLASS">
            <FlowDiagram.Anchor>
              <div
                class="flex w-full items-center gap-(--spacing-2xs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-2xs)"
              >
                <i
                  :class="node.icon"
                  aria-hidden="true"
                  class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                />
                <span class="truncate text-label-sm text-(--text-muted)">{{ node.eyebrow }}</span>
                <span class="ms-auto flex shrink-0">
                  <Tag
                    :severity="node.severity"
                    :label="node.label"
                    size="small"
                  />
                </span>
              </div>
            </FlowDiagram.Anchor>
            <div
              class="flex min-h-8 min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
            >
              <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{
                node.title
              }}</span>
              <span
                v-if="node.spanId"
                class="ms-auto flex shrink-0 items-center"
              >
                <Tooltip :content="`Show ${node.title} in the trace`">
                  <IconButton
                    icon="az az-align-left"
                    variant="outline"
                    size="small"
                    :aria-label="`Show ${node.title} in the trace`"
                    @click="emit('show-span', node.spanId)"
                  />
                </Tooltip>
              </span>
            </div>
            <dl
              class="m-0 flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md)"
            >
              <div
                v-for="field in node.fields"
                :key="field.label"
                class="flex min-w-0 flex-col gap-(--spacing-2xs)"
              >
                <dt class="text-label-sm text-(--text-muted)">{{ field.label }}</dt>
                <dd class="m-0 truncate text-body-xs text-(--text-default)">
                  {{ field.value }}
                </dd>
              </div>
            </dl>
          </div>
        </FlowDiagram.Node>
      </FlowDiagram>
    </div>
  </section>
</template>

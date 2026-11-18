<script setup lang="ts">
  import { computed, useId } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import CopyButton from '../../../action/copy-button/copy-button.vue'
  import FlowDiagramAnchor from '../flow-diagram-anchor/flow-diagram-anchor.vue'
  import FlowDiagramDescription from '../flow-diagram-description/flow-diagram-description.vue'
  import FlowDiagramFooter from '../flow-diagram-footer/flow-diagram-footer.vue'
  import FlowDiagramHeader from '../flow-diagram-header/flow-diagram-header.vue'
  import FlowDiagramItem from '../flow-diagram-item/flow-diagram-item.vue'
  import FlowDiagramNode from '../flow-diagram-node/flow-diagram-node.vue'
  import FlowDiagramTitle from '../flow-diagram-title/flow-diagram-title.vue'
  import type { FlowDiagramNodeData } from '../types'

  defineOptions({
    name: 'FlowDiagramCard'
  })

  const props = defineProps<{
    /** The node to draw. */
    node: FlowDiagramNodeData
    /** Whether the details are shown. */
    open: boolean
    /** Base data-testid of the diagram. */
    testId: string
    /** Draws the steps as cards of the same width. */
    card: boolean
  }>()

  const emit = defineEmits<{
    toggle: [event: globalThis.MouseEvent]
  }>()

  defineSlots<{
    actions(): unknown
  }>()

  const { t } = useTranslate({ flowDiagram: en.flowDiagram })
  const uid = useId()
  const bodyId = `${uid}-details`

  const unbound = computed<boolean>(() => Boolean(props.node.bindable) && !props.node.title)
  const status = computed<string>(
    () => props.node.status || (unbound.value ? t('flowDiagram.notBound') : '')
  )
  const collapsible = computed<boolean>(
    () => Boolean(props.node.message) || Boolean(props.node.fields?.length)
  )
  const kind = computed<string>(() => props.node.eyebrow ?? '')
</script>

<template>
  <FlowDiagramNode
    :value="node.id"
    :disabled="node.disabled"
    :terminal="node.terminal"
    :dashed="node.dashed || unbound"
    :data-testid="`${testId}__node`"
    :data-state="collapsible ? (open ? 'open' : 'closed') : undefined"
    :class="card ? 'w-full' : 'w-full min-w-(--size-48)'"
  >
    <FlowDiagramAnchor>
      <FlowDiagramHeader
        :icon="node.icon"
        :eyebrow="node.eyebrow"
        :status="status"
        :severity="node.severity ?? 'neutral'"
      />
      <FlowDiagramTitle :href="unbound ? '' : node.href">
        <span
          v-if="unbound"
          aria-hidden="true"
          class="text-(--text-muted)"
          >—</span
        >
        <template v-else>{{ node.title }}</template>
        <template
          v-if="$slots['actions']"
          #actions
        >
          <slot name="actions" />
        </template>
      </FlowDiagramTitle>
    </FlowDiagramAnchor>
    <FlowDiagramDescription v-if="node.description">{{ node.description }}</FlowDiagramDescription>
    <FlowDiagramFooter v-if="node.metrics?.length">
      <FlowDiagramItem
        v-for="metric in node.metrics"
        :key="metric.label"
        :label="metric.label"
        >{{ metric.value }}</FlowDiagramItem
      >
    </FlowDiagramFooter>
    <template v-if="collapsible">
      <button
        type="button"
        :aria-expanded="open"
        :aria-controls="bodyId"
        :data-state="open ? 'open' : 'closed'"
        :data-testid="`${testId}__node-toggle`"
        class="group/toggle flex w-full items-center gap-(--spacing-2xs) rounded-b-(--shape-card) border-t border-solid border-(--border-muted) px-(--spacing-md) py-(--spacing-xs) text-start text-label-sm text-(--text-muted) outline-none transition-colors duration-moderate-01 ease-productive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset data-[state=open]:rounded-b-none motion-reduce:transition-none"
        @click="(event: globalThis.MouseEvent) => emit('toggle', event)"
      >
        <span class="sr-only">{{ node.title || kind }}</span>
        {{ t('flowDiagram.details') }}
        <i
          class="az az-chevron-down ms-auto shrink-0 text-body-xs transition-transform duration-moderate-01 ease-productive-entrance group-data-[state=open]/toggle:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
      <div
        :id="bodyId"
        :inert="!open || undefined"
        :data-state="open ? 'open' : 'closed'"
        :data-testid="`${testId}__node-details`"
        class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div class="overflow-hidden">
          <div
            class="flex flex-col gap-(--spacing-sm) border-t border-solid border-(--border-muted) p-(--spacing-md)"
          >
            <p
              v-if="node.message"
              class="m-0 text-body-xs text-(--text-muted)"
            >
              {{ node.message }}
            </p>
            <div
              v-for="field in node.fields ?? []"
              :key="field.label"
              class="flex flex-col gap-(--spacing-2xs)"
            >
              <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <a
                  v-if="field.href"
                  :href="field.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="auto"
                  class="min-w-0 truncate rounded-(--shape-control) text-body-xs text-(--text-default) underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                  >{{ field.value }}</a
                >
                <span
                  v-else
                  dir="auto"
                  class="min-w-0 truncate text-body-xs text-(--text-default)"
                  >{{ field.value }}</span
                >
                <CopyButton
                  v-if="field.copyable"
                  variant="outline"
                  :value="field.value"
                  :aria-label="t('flowDiagram.copy', { field: `${kind} ${field.label}` })"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </FlowDiagramNode>
</template>

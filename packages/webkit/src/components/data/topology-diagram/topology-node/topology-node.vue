<script setup lang="ts">
  import { computed, useId } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import CopyButton from '../../../actions/copy-button/copy-button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Tag from '../../../content/tag/tag.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuOption from '../../../navigation/dropdown-menu/dropdown-menu-option/dropdown-menu-option.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import FlowAnchor from '../../flow/flow-anchor/flow-anchor.vue'
  import type { TopologyNode } from '../types'

  defineOptions({
    name: 'TopologyDiagramNode'
  })

  const props = defineProps<{
    /** The node to draw. */
    node: TopologyNode
    /** Whether the body is shown. */
    open: boolean
    /** Base data-testid of the diagram. */
    testId: string
  }>()

  const emit = defineEmits<{
    toggle: []
    bind: [value: string]
    remove: []
    create: []
  }>()

  defineSlots<{
    actions(): unknown
  }>()

  const { t } = useTranslate({ topologyDiagram: en.topologyDiagram })
  const uid = useId()
  const triggerId = `${uid}-trigger`
  const bodyId = `${uid}-body`
  const CREATE = '__create__'

  const unbound = computed<boolean>(() => !props.node.name)
  const status = computed<string>(
    () => props.node.status || (unbound.value ? t('topologyDiagram.notBound') : '')
  )
  const tagSeverity = computed(() => {
    const severity = props.node.severity ?? 'neutral'
    return severity === 'neutral' ? 'secondary' : severity
  })
  const bound = computed<boolean>(() => !unbound.value && Boolean(props.node.boundValue))
  const options = computed(() => props.node.bindOptions ?? [])
  const bindLabel = computed<string>(() =>
    t(bound.value ? 'topologyDiagram.change' : 'topologyDiagram.bind', { kind: props.node.kind })
  )
  const removeLabel = computed<string>(() => t('topologyDiagram.remove', { kind: props.node.kind }))

  const onSelect = (_event: unknown, value: string | number): void => {
    if (value === CREATE) emit('create')
    else emit('bind', String(value))
  }
</script>

<template>
  <div
    :data-testid="`${testId}__node`"
    :data-state="open ? 'open' : 'closed'"
    :data-dashed="node.dashed || unbound || null"
    class="w-full rounded-(--shape-card) border border-solid border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) data-[dashed]:border-dashed motion-reduce:transition-none"
  >
    <FlowAnchor>
      <button
        :id="triggerId"
        type="button"
        :aria-expanded="open"
        :aria-controls="bodyId"
        :data-state="open ? 'open' : 'closed'"
        :data-testid="`${testId}__node-trigger`"
        class="group flex w-full items-center gap-(--spacing-xxs) rounded-t-(--shape-card) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs) text-start outline-none transition-colors duration-moderate-01 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:transition-none"
        @click="emit('toggle')"
      >
        <i
          v-if="node.icon"
          :class="node.icon"
          class="shrink-0 text-body-xs leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate text-label-sm text-(--text-muted)">{{ node.kind }}</span>
        <Tag
          v-if="status"
          class="ms-auto shrink-0"
          :severity="tagSeverity"
          :label="status"
          size="small"
        />
        <i
          :data-pushed="!status || null"
          class="pi pi-chevron-down shrink-0 text-body-xs text-(--text-muted) transition-transform duration-moderate-01 ease-productive-entrance group-data-[state=open]:rotate-180 data-[pushed]:ms-auto motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
    </FlowAnchor>

    <div
      class="flex min-h-9 min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
    >
      <span
        v-if="unbound"
        aria-hidden="true"
        class="min-w-0 truncate text-label-sm text-(--text-muted)"
        >—</span
      >
      <a
        v-else-if="node.href"
        :href="node.href"
        class="min-w-0 truncate rounded-(--shape-elements) text-label-sm text-(--text-default) underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        >{{ node.name }}</a
      >
      <span
        v-else
        class="min-w-0 truncate text-label-sm text-(--text-default)"
        >{{ node.name }}</span
      >
      <div
        v-if="node.bindable || $slots['actions']"
        class="ms-auto flex shrink-0 items-center gap-(--spacing-xxs)"
      >
        <slot name="actions" />
        <template v-if="node.bindable">
          <DropdownMenu
            placement="bottom-end"
            :data-testid="`${testId}__bind`"
            @select="onSelect"
          >
            <DropdownMenuTrigger>
              <Tooltip :text="bindLabel">
                <IconButton
                  :icon="bound ? 'pi pi-pencil' : 'pi pi-plus'"
                  kind="outlined"
                  size="small"
                  :ariaLabel="bindLabel"
                />
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuGroup :label="options.length ? t('topologyDiagram.existing') : ''">
              <template
                v-if="!options.length"
                #top
              >
                <span class="px-(--spacing-xs) text-body-xs text-(--text-muted)">{{
                  t('topologyDiagram.noOptions')
                }}</span>
              </template>
              <DropdownMenuOption
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                :selected="option.value === node.boundValue"
              />
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuOption
                :value="CREATE"
                :label="t('topologyDiagram.create', { kind: node.kind })"
              />
            </DropdownMenuGroup>
          </DropdownMenu>
          <Tooltip
            v-if="bound && node.removable"
            :text="removeLabel"
          >
            <IconButton
              icon="pi pi-times"
              kind="outlined"
              size="small"
              :ariaLabel="removeLabel"
              @click="emit('remove')"
            />
          </Tooltip>
        </template>
      </div>
    </div>

    <div
      :id="bodyId"
      :inert="!open || undefined"
      :data-state="open ? 'open' : 'closed'"
      :data-testid="`${testId}__node-body`"
      class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div class="overflow-hidden">
        <div
          class="flex flex-col gap-(--spacing-sm) border-t border-solid border-(--border-muted) p-(--spacing-md)"
        >
          <p
            v-if="node.message"
            class="text-body-xs text-(--text-muted)"
          >
            {{ node.message }}
          </p>
          <div
            v-for="field in node.fields ?? []"
            :key="field.label"
            class="flex flex-col gap-(--spacing-xxs)"
          >
            <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <a
                v-if="field.href"
                :href="field.href"
                target="_blank"
                rel="noopener noreferrer"
                dir="auto"
                class="min-w-0 truncate rounded-(--shape-elements) text-body-xs text-(--text-default) underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
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
                kind="outlined"
                :value="field.value"
                :ariaLabel="t('topologyDiagram.copy', { field: `${node.kind} ${field.label}` })"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

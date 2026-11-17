<script setup lang="ts">
  import { computed, nextTick, ref, useId } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import CopyButton from '../../../action/copy-button/copy-button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Tag from '../../../content/tag/tag.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import FlowDiagramAnchor from '../../flow-diagram/flow-diagram-anchor/flow-diagram-anchor.vue'
  import type { TopologyDiagramNodeData } from '../types'

  defineOptions({
    name: 'TopologyDiagramNode'
  })

  const props = defineProps<{
    /** The node to draw. */
    node: TopologyDiagramNodeData
    /** Whether the body is shown. */
    open: boolean
    /** Base data-testid of the diagram. */
    testId: string
  }>()

  const emit = defineEmits<{
    toggle: [event: globalThis.MouseEvent]
    bind: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: string]
    remove: [event: globalThis.MouseEvent]
    create: [event: globalThis.MouseEvent | globalThis.KeyboardEvent]
  }>()

  defineSlots<{
    actions(): unknown
  }>()

  const { t } = useTranslate({ topologyDiagram: en.topologyDiagram })
  const uid = useId()
  const triggerId = `${uid}-trigger`
  const bodyId = `${uid}-body`
  const pendingId = `${uid}-pending`
  const CREATE = '__create__'

  const actionsEl = ref<globalThis.HTMLElement | null>(null)
  const pendingValue = ref<string>('')

  const options = computed(() => props.node.bindOptions ?? [])
  const pending = computed<boolean>(() => pendingValue.value !== '')
  const pendingLabel = computed<string>(
    () =>
      options.value.find((option) => option.value === pendingValue.value)?.label ??
      pendingValue.value
  )
  const unbound = computed<boolean>(() => !props.node.name && !pending.value)
  const status = computed<string>(() => {
    if (pending.value) return t('topologyDiagram.pending')
    return props.node.status || (unbound.value ? t('topologyDiagram.notBound') : '')
  })
  const tagSeverity = computed(() =>
    pending.value ? 'warning' : (props.node.severity ?? 'neutral')
  )
  const resourceType = computed<string>(() => props.node.type ?? '')
  const bound = computed<boolean>(() => !unbound.value && Boolean(props.node.boundValue))
  const bindLabel = computed<string>(() =>
    t(bound.value ? 'topologyDiagram.change' : 'topologyDiagram.bind', { kind: resourceType.value })
  )
  const removeLabel = computed<string>(() =>
    t('topologyDiagram.remove', { kind: resourceType.value })
  )
  const applyLabel = computed<string>(() =>
    t('topologyDiagram.apply', { kind: resourceType.value })
  )

  const focusAction = async (part: string): Promise<void> => {
    await nextTick()
    actionsEl.value
      ?.querySelector<globalThis.HTMLElement>(`[data-testid="${props.testId}__${part}"]`)
      ?.focus()
  }

  const onSelect = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    value: string | number
  ): void => {
    if (value === CREATE) {
      pendingValue.value = ''
      emit('create', event)
      return
    }
    const next = String(value)
    if (next === (props.node.boundValue ?? '')) {
      pendingValue.value = ''
      return
    }
    pendingValue.value = next
    void focusAction('bind-apply')
  }

  const apply = (event: globalThis.MouseEvent | globalThis.KeyboardEvent): void => {
    const value = pendingValue.value
    pendingValue.value = ''
    emit('bind', event, value)
    void focusAction('bind-trigger')
  }

  const cancel = (): void => {
    if (!pending.value) return
    pendingValue.value = ''
    void focusAction('bind-trigger')
  }
</script>

<template>
  <div
    :data-testid="`${testId}__node`"
    :data-state="open ? 'open' : 'closed'"
    :data-dashed="node.dashed || unbound || pending || null"
    :data-pending="pending || null"
    class="w-full rounded-(--shape-card) border border-solid border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) data-[dashed]:border-dashed motion-reduce:transition-none"
  >
    <FlowDiagramAnchor>
      <button
        :id="triggerId"
        type="button"
        :aria-expanded="open"
        :aria-controls="bodyId"
        :data-state="open ? 'open' : 'closed'"
        :data-testid="`${testId}__node-trigger`"
        class="group flex w-full items-center gap-(--spacing-2xs) rounded-t-(--shape-card) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-2xs) text-start outline-none transition-colors duration-moderate-01 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:transition-none"
        @click="(event: globalThis.MouseEvent) => emit('toggle', event)"
      >
        <i
          v-if="node.icon"
          :class="node.icon"
          class="shrink-0 text-body-xs leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate text-label-sm text-(--text-muted)">{{ resourceType }}</span>
        <Tag
          v-if="status"
          class="ms-auto shrink-0"
          :severity="tagSeverity"
          :label="status"
          size="small"
        />
        <i
          :data-pushed="!status || null"
          class="az az-chevron-down shrink-0 text-body-xs text-(--text-muted) transition-transform duration-moderate-01 ease-productive-entrance group-data-[state=open]:rotate-180 data-[pushed]:ms-auto motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
    </FlowDiagramAnchor>

    <div
      class="flex min-h-9 min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
    >
      <span
        v-if="pending"
        :id="pendingId"
        :data-testid="`${testId}__node-pending`"
        dir="auto"
        class="min-w-0 truncate text-label-sm text-(--text-default)"
        >{{ pendingLabel }}</span
      >
      <span
        v-else-if="unbound"
        aria-hidden="true"
        class="min-w-0 truncate text-label-sm text-(--text-muted)"
        >—</span
      >
      <a
        v-else-if="node.href"
        :href="node.href"
        :data-testid="`${testId}__node-link`"
        class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-control) text-label-sm text-(--text-default) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      >
        <span
          dir="auto"
          class="min-w-0 truncate underline-offset-2 group-hover/link:underline"
          >{{ node.name }}</span
        >
        <i
          class="az az-external-link shrink-0 text-body-xs leading-none"
          aria-hidden="true"
          :data-testid="`${testId}__node-link-icon`"
        />
      </a>
      <span
        v-else
        class="min-w-0 truncate text-label-sm text-(--text-default)"
        >{{ node.name }}</span
      >
      <div
        v-if="node.bindable || $slots['actions']"
        ref="actionsEl"
        class="ms-auto flex shrink-0 items-center gap-(--spacing-2xs)"
        @keydown.esc="cancel"
      >
        <slot name="actions" />
        <template v-if="node.bindable">
          <DropdownMenu
            side="bottom"
            align="end"
            :data-testid="`${testId}__bind`"
            @select="onSelect"
          >
            <DropdownMenuTrigger>
              <Tooltip :content="bindLabel">
                <IconButton
                  :icon="bound ? 'az az-pencil' : 'az az-plus'"
                  variant="outline"
                  size="small"
                  :ariaLabel="bindLabel"
                  :data-testid="`${testId}__bind-trigger`"
                />
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuGroup :label="options.length ? t('topologyDiagram.existing') : ''">
              <template
                v-if="!options.length"
                #header
              >
                <span class="px-(--spacing-xs) text-body-xs text-(--text-muted)">{{
                  t('topologyDiagram.noOptions')
                }}</span>
              </template>
              <DropdownMenuItem
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :label="option.label"
                :selected="option.value === (pending ? pendingValue : node.boundValue)"
              />
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem
                :value="CREATE"
                :label="t('topologyDiagram.create', { kind: resourceType })"
              />
            </DropdownMenuGroup>
          </DropdownMenu>
          <template v-if="pending">
            <Tooltip :content="applyLabel">
              <IconButton
                icon="ai ai-check"
                variant="primary"
                size="small"
                :ariaLabel="applyLabel"
                :aria-describedby="pendingId"
                :data-testid="`${testId}__bind-apply`"
                @click="apply"
              />
            </Tooltip>
            <Tooltip :content="t('topologyDiagram.cancel')">
              <IconButton
                icon="ai ai-x"
                variant="outline"
                size="small"
                :ariaLabel="t('topologyDiagram.cancel')"
                :data-testid="`${testId}__bind-cancel`"
                @click="cancel"
              />
            </Tooltip>
          </template>
          <Tooltip
            v-else-if="bound && node.removable"
            :content="removeLabel"
          >
            <IconButton
              icon="az az-x"
              variant="outline"
              size="small"
              :ariaLabel="removeLabel"
              @click="(event: globalThis.MouseEvent) => emit('remove', event)"
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
                :ariaLabel="t('topologyDiagram.copy', { field: `${resourceType} ${field.label}` })"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

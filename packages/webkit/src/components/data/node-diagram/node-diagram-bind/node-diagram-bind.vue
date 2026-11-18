<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import type { NodeDiagramBindOption } from '../types'

  defineOptions({
    name: 'NodeDiagramBind',
    inheritAttrs: false
  })

  export interface NodeDiagramBindProps {
    /** Resource type named in the control labels, e.g. `Policy`. */
    label?: string
    /** Existing resources the menu offers. */
    options?: NodeDiagramBindOption[]
    /** The option the node is bound to; empty when the slot is unbound. */
    value?: string
    /** Offers Remove while the node is bound. */
    removable?: boolean
  }

  const props = withDefaults(defineProps<NodeDiagramBindProps>(), {
    label: '',
    options: () => [],
    value: '',
    removable: false
  })

  const emit = defineEmits<{
    /** A pending pick was confirmed with Apply. */
    bind: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: string]
    /** Remove was activated on a bound node. */
    remove: [event: globalThis.MouseEvent]
    /** Create was picked in the menu. */
    create: [event: globalThis.MouseEvent | globalThis.KeyboardEvent]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ nodeDiagram: en.nodeDiagram })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'node-diagram-bind'
  )

  const CREATE = '__create__'
  const pendingId = `${useId()}-pending`
  const rootEl = ref<globalThis.HTMLElement | null>(null)
  const pendingValue = ref<string>('')

  const pending = computed<boolean>(() => pendingValue.value !== '')
  const pendingLabel = computed<string>(
    () =>
      props.options.find((option) => option.value === pendingValue.value)?.label ??
      pendingValue.value
  )
  const bound = computed<boolean>(() => props.value !== '')
  const bindLabel = computed<string>(() =>
    t(bound.value ? 'nodeDiagram.change' : 'nodeDiagram.bind', { kind: props.label })
  )
  const removeLabel = computed<string>(() => t('nodeDiagram.remove', { kind: props.label }))
  const applyLabel = computed<string>(() => t('nodeDiagram.apply', { kind: props.label }))

  const focusPart = async (part: string): Promise<void> => {
    await nextTick()
    rootEl.value
      ?.querySelector<globalThis.HTMLElement>(`[data-testid="${testId.value}__${part}"]`)
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
    pendingValue.value = next === props.value ? '' : next
    if (pendingValue.value) void focusPart('apply')
  }

  const onApply = (event: globalThis.MouseEvent | globalThis.KeyboardEvent): void => {
    const value = pendingValue.value
    pendingValue.value = ''
    emit('bind', event, value)
    void focusPart('trigger')
  }

  const onCancel = (): void => {
    if (!pending.value) return
    pendingValue.value = ''
    void focusPart('trigger')
  }
</script>

<template>
  <span
    ref="rootEl"
    v-bind="$attrs"
    data-slot="node-diagram-bind"
    :data-pending="pending || null"
    :data-testid="testId"
    class="flex shrink-0 items-center gap-(--spacing-2xs)"
    @keydown.esc="onCancel"
  >
    <span
      v-if="pending"
      :id="pendingId"
      :data-testid="`${testId}__pending`"
      dir="auto"
      class="max-w-(--size-24) truncate text-label-sm text-(--text-default)"
      >{{ pendingLabel }}</span
    >
    <DropdownMenu
      side="bottom"
      align="end"
      :data-testid="`${testId}__menu`"
      @select="onSelect"
    >
      <DropdownMenuTrigger>
        <Tooltip :content="bindLabel">
          <IconButton
            :icon="bound ? 'az az-pencil' : 'az az-plus'"
            variant="outline"
            size="small"
            :aria-label="bindLabel"
            :data-testid="`${testId}__trigger`"
          />
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuGroup :label="options.length ? t('nodeDiagram.existing') : ''">
        <template
          v-if="!options.length"
          #header
        >
          <span class="px-(--spacing-xs) text-body-xs text-(--text-muted)">{{
            t('nodeDiagram.noOptions')
          }}</span>
        </template>
        <DropdownMenuItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
          :selected="option.value === (pending ? pendingValue : value)"
        />
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuItem
          :value="CREATE"
          :label="t('nodeDiagram.create', { kind: label })"
        />
      </DropdownMenuGroup>
    </DropdownMenu>
    <template v-if="pending">
      <Tooltip :content="applyLabel">
        <IconButton
          icon="az az-check"
          variant="primary"
          size="small"
          :aria-label="applyLabel"
          :aria-describedby="pendingId"
          :data-testid="`${testId}__apply`"
          @click="onApply"
        />
      </Tooltip>
      <Tooltip :content="t('nodeDiagram.cancel')">
        <IconButton
          icon="az az-x"
          variant="outline"
          size="small"
          :aria-label="t('nodeDiagram.cancel')"
          :data-testid="`${testId}__cancel`"
          @click="onCancel"
        />
      </Tooltip>
    </template>
    <Tooltip
      v-else-if="bound && removable"
      :content="removeLabel"
    >
      <IconButton
        icon="az az-x"
        variant="outline"
        size="small"
        :aria-label="removeLabel"
        :data-testid="`${testId}__remove`"
        @click="(event: globalThis.MouseEvent) => emit('remove', event)"
      />
    </Tooltip>
  </span>
</template>

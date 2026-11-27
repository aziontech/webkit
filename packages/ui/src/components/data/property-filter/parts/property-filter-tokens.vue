<script setup lang="ts">
  import { computed } from 'vue'

  import type { PropertyFilterToken } from '../../../../composables/use-collection/lib/property-filter'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import ToggleGroup from '../../../action/toggle-group/toggle-group.vue'
  import Chip from '../../../input/chip/chip.vue'
  import type { UsePropertyFilterTokensReturn } from '../composables/use-property-filter-tokens'

  defineOptions({ name: 'PropertyFilterTokens', inheritAttrs: false })

  interface Props {
    /** Token state of the filter. */
    filter: UsePropertyFilterTokensReturn
    /** Text of a token chip. */
    labelOf: (token: PropertyFilterToken) => string
    /** Items that match the query. Hidden when unset. */
    totalCount?: number
    /** Disables the tokens and the controls. */
    disabled: boolean
    /** Shows the Add group button. */
    grouped: boolean
    /** Shows the Match all / Match any toggle. */
    showOperations: boolean
    /** Test id of the filter. */
    testId: string
  }

  const props = withDefaults(defineProps<Props>(), { totalCount: undefined })

  const emit = defineEmits<{
    'add-group': [event: MouseEvent]
    clear: [event: MouseEvent]
  }>()

  const { t } = useTranslate({ propertyFilter: en.propertyFilter })

  const { tokens, groups, operation, pendingGroup, conditionCount } = props.filter

  const operationOptions = computed(() => [
    { label: t('propertyFilter.matchAll'), value: 'and' },
    { label: t('propertyFilter.matchAny'), value: 'or' }
  ])
</script>

<template>
  <div
    role="group"
    :aria-label="t('propertyFilter.tokens')"
    :data-testid="`${testId}__tokens`"
    class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
  >
    <template
      v-for="(token, index) in tokens"
      :key="`${index}-${token.propertyKey ?? ''}-${token.operator}-${token.value}`"
    >
      <span
        v-if="index > 0"
        class="text-label-sm text-(--text-muted)"
        >{{ operation === 'or' ? t('propertyFilter.or') : t('propertyFilter.and') }}</span
      >
      <Chip
        :label="labelOf(token)"
        :disabled="disabled"
        :data-testid="`${testId}__token`"
        variant="filled"
        size="medium"
        removable
        class="max-w-full"
        @remove="filter.removeToken(index)"
      />
    </template>
    <template
      v-for="(group, groupIndex) in groups"
      :key="`group-${groupIndex}`"
    >
      <span
        v-if="tokens.length || groupIndex > 0"
        class="text-label-sm text-(--text-muted)"
        >{{ operation === 'or' ? t('propertyFilter.or') : t('propertyFilter.and') }}</span
      >
      <div
        role="group"
        :aria-label="t('propertyFilter.group', { index: groupIndex + 1 })"
        :data-testid="`${testId}__group`"
        class="flex min-w-0 max-w-full flex-wrap items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) px-(--spacing-xs) py-(--spacing-2xs)"
      >
        <template
          v-for="(token, index) in group.tokens"
          :key="`${groupIndex}-${index}-${token.propertyKey ?? ''}-${token.operator}-${token.value}`"
        >
          <span
            v-if="index > 0"
            class="text-label-sm text-(--text-muted)"
            >{{ group.operation === 'or' ? t('propertyFilter.or') : t('propertyFilter.and') }}</span
          >
          <Chip
            :label="labelOf(token)"
            :disabled="disabled"
            :data-testid="`${testId}__token`"
            variant="filled"
            size="medium"
            removable
            class="max-w-full"
            @remove="filter.removeGroupToken(groupIndex, index)"
          />
        </template>
        <ToggleGroup
          v-if="group.tokens.length > 1"
          :model-value="group.operation"
          :options="operationOptions"
          :aria-label="t('propertyFilter.groupOperation', { index: groupIndex + 1 })"
          :disabled="disabled"
          :data-testid="`${testId}__group-operation`"
          size="small"
          @update:model-value="filter.setGroupOperation(groupIndex, $event)"
        />
      </div>
    </template>
    <template v-if="pendingGroup">
      <span
        v-if="conditionCount > 0"
        class="text-label-sm text-(--text-muted)"
        >{{ operation === 'or' ? t('propertyFilter.or') : t('propertyFilter.and') }}</span
      >
      <Chip
        :label="t('propertyFilter.newGroup')"
        :data-testid="`${testId}__pending-group`"
        variant="dashed"
        size="medium"
      />
    </template>
    <Button
      v-if="grouped && groups.length && !pendingGroup"
      :label="t('propertyFilter.addGroup')"
      :disabled="disabled"
      :data-testid="`${testId}__add-group`"
      icon="az az-plus"
      variant="ghost"
      size="small"
      @click="emit('add-group', $event)"
    />
    <ToggleGroup
      v-if="conditionCount > 1 && showOperations"
      :model-value="operation"
      :options="operationOptions"
      :aria-label="t('propertyFilter.operation')"
      :disabled="disabled"
      :data-testid="`${testId}__operation`"
      size="small"
      @update:model-value="filter.setOperation"
    />
    <Button
      :label="t('propertyFilter.clear')"
      :disabled="disabled"
      :data-testid="`${testId}__clear`"
      variant="ghost"
      size="small"
      @click="emit('clear', $event)"
    />
    <span
      v-if="totalCount !== undefined"
      role="status"
      :data-testid="`${testId}__count`"
      class="ms-auto text-label-sm text-(--text-muted) tabular-nums"
      >{{ t('propertyFilter.matches', { count: totalCount }) }}</span
    >
  </div>
</template>

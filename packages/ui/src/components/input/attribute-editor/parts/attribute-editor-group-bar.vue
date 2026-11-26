<script setup lang="ts">
  import { inject } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import { AttributeEditorInjectionKey } from '../injection-key'

  defineOptions({ name: 'AttributeEditorGroupBar', inheritAttrs: false })

  defineProps<{ groupIndex: number; groupKey: string }>()

  const ctx = inject(AttributeEditorInjectionKey)
  if (!ctx) throw new Error('AttributeEditorGroupBar must be used inside AttributeEditor.')
  const { testId, props, hintId, groupCount, move, drag } = ctx
  const { t } = useTranslate({ attributeEditor: en.attributeEditor })
</script>

<template>
  <div
    class="flex items-center gap-(--spacing-2xs)"
    :data-testid="`${testId}__group-reorder`"
  >
    <IconButton
      icon="az az-menu"
      variant="ghost"
      size="small"
      data-reorder="group-grip"
      :aria-label="t('attributeEditor.reorderGroup', { index: groupIndex + 1 })"
      :aria-describedby="hintId"
      :disabled="props.disabled"
      :data-testid="`${testId}__group-grip`"
      class="cursor-grab active:cursor-grabbing"
      @pointerdown="drag.arm(groupKey)"
      @pointerup="drag.disarm"
      @pointercancel="drag.disarm"
      @keydown="move.onGroupGripKeydown($event, groupIndex)"
    />
    <span class="flex-1" />
    <Tooltip :content="t('attributeEditor.moveGroupUp', { index: groupIndex + 1 })">
      <IconButton
        icon="az az-chevron-up"
        variant="outline"
        size="small"
        data-reorder="group-up"
        :ariaLabel="t('attributeEditor.moveGroupUp', { index: groupIndex + 1 })"
        :disabled="props.disabled || groupIndex === 0"
        :data-testid="`${testId}__group-move-up`"
        @click="move.moveGroup(groupIndex, groupIndex - 1)"
      />
    </Tooltip>
    <Tooltip :content="t('attributeEditor.moveGroupDown', { index: groupIndex + 1 })">
      <IconButton
        icon="az az-chevron-down"
        variant="outline"
        size="small"
        data-reorder="group-down"
        :ariaLabel="t('attributeEditor.moveGroupDown', { index: groupIndex + 1 })"
        :disabled="props.disabled || groupIndex === groupCount - 1"
        :data-testid="`${testId}__group-move-down`"
        @click="move.moveGroup(groupIndex, groupIndex + 1)"
      />
    </Tooltip>
  </div>
</template>

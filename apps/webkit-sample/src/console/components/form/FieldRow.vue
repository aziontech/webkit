<script setup lang="ts">
  import HelperText from '@aziontech/webkit/helper-text'
  import Item from '@aziontech/webkit/item'
  import { computed, useId } from 'vue'

  interface Props {
    title?: string
    description?: string
    kind?: 'compact' | 'field' | 'wide'
    message?: string
    messageKind?: 'helper' | 'required' | 'invalid'
    level?: 0 | 1 | 2
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    kind: 'field',
    message: '',
    messageKind: 'helper',
    level: 0
  })

  defineSlots<{
    description(): unknown
    default(props: { 'message-id': unknown }): unknown
  }>()

  const messageId = useId()

  const stacked = computed(() => props.kind === 'wide')

  const NESTED_CLASS =
    'data-[level]:before:absolute data-[level]:before:inset-y-0 data-[level]:before:w-px data-[level]:before:bg-(--border-default) data-[level=1]:pl-[calc(var(--spacing-md)*2)]! data-[level=1]:before:left-[calc(var(--spacing-md)+var(--spacing-xxs))] data-[level=2]:pl-[calc(var(--spacing-md)*3)]! data-[level=2]:before:left-[calc(var(--spacing-md)*2+var(--spacing-xxs))]'

  const rootClass = computed(
    () =>
      `${stacked.value ? 'flex-col items-stretch gap-(--spacing-sm)' : 'items-start'} ${NESTED_CLASS}`
  )

  const actionsClass = computed(() => {
    if (props.kind === 'compact') return 'justify-end'
    if (stacked.value) return 'w-full justify-start'
    return 'flex-1 justify-end max-w-(--container-3xs)'
  })
</script>

<template>
  <Item
    size="small"
    :data-level="level || null"
    :class="rootClass"
  >
    <Item.Content>
      <Item.Title>{{ title }}</Item.Title>
      <Item.Description v-if="description || $slots.description">
        <slot name="description">{{ description }}</slot>
      </Item.Description>
    </Item.Content>

    <Item.Actions :class="actionsClass">
      <slot
        v-if="kind === 'compact'"
        :message-id="message ? messageId : undefined"
      />
      <div
        v-else
        class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
      >
        <slot :message-id="message ? messageId : undefined" />
        <HelperText
          v-if="message"
          :id="messageId"
          :kind="messageKind"
          :label="message"
        />
      </div>
    </Item.Actions>
  </Item>
</template>

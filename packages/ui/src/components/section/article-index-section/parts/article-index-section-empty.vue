<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import EmptyState from '../../../feedback/empty-state/empty-state.vue'
  import RegistrationFrame from '../../../layout/registration-frame/registration-frame.vue'

  defineOptions({ name: 'ArticleIndexSectionEmpty' })

  interface Props {
    /** Heading shown when no item matches the filters. */
    title: string
    /** Supporting text under the heading. */
    description?: string
    /** Text of the button that clears the filters; empty hides it. */
    actionLabel?: string
  }

  withDefaults(defineProps<Props>(), { description: '', actionLabel: '' })

  const emit = defineEmits<{
    /** The clear button was pressed. */
    clear: [event: MouseEvent]
  }>()
</script>

<template>
  <RegistrationFrame
    flush
    borders="y"
    marks="bottom"
  >
    <EmptyState
      :title="title"
      :description="description"
      icon="az az-search"
      class="p-(--spacing-2xl)"
    >
      <template
        v-if="actionLabel"
        #actions
      >
        <Button
          :label="actionLabel"
          variant="secondary"
          size="large"
          @click="emit('clear', $event)"
        />
      </template>
    </EmptyState>
  </RegistrationFrame>
</template>

<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import RegistrationFrame from '../../../layout/registration-frame/registration-frame.vue'

  defineOptions({ name: 'ArticleIndexSectionMore' })

  interface Props {
    /** Text of the button that shows the next page of items. */
    label: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    /** The button was pressed. */
    more: [event: MouseEvent]
  }>()
</script>

<template>
  <RegistrationFrame
    flush
    borders="y"
    marks="bottom"
  >
    <div class="flex justify-center p-(--spacing-xl)">
      <Button
        :label="label"
        variant="outline"
        size="large"
        @click="emit('more', $event)"
      />
    </div>
  </RegistrationFrame>
</template>

<script setup>
  import Field from '@aziontech/ui/field'
  import Rating from '@aziontech/ui/rating'
  import { nextTick, ref } from 'vue'

  const score = ref(0)
  const sending = ref(false)
  const sent = ref(false)
  const thanksEl = ref(null)

  const sendRating = (value) => Promise.resolve(value)

  const onSelect = async (_event, value) => {
    if (sending.value || sent.value) return
    sending.value = true
    await sendRating(value)
    sending.value = false
    sent.value = true
    await nextTick()
    thanksEl.value?.focus()
  }
</script>

<template>
  <div class="max-w-(--container-sm)">
    <Field
      v-if="!sent"
      :disabled="sending"
    >
      <Field.Title>How satisfied are you with the support you received?</Field.Title>
      <Field.Description>1 star is very unsatisfied, 5 stars is very satisfied.</Field.Description>
      <Rating
        v-model="score"
        name="csat"
        @select="onSelect"
      />
    </Field>
    <p
      ref="thanksEl"
      role="status"
      tabindex="-1"
      class="flex items-center gap-(--spacing-xs) text-body-md text-(--text-default) focus-visible:outline-none"
    >
      <template v-if="sent">
        <i
          class="az az-circle-check text-(--success-mark)"
          aria-hidden="true"
        />
        Thanks, your rating was sent.
      </template>
    </p>
  </div>
</template>

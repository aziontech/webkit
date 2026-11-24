<script setup>
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Rating from '@aziontech/webkit/rating'
  import { computed, ref } from 'vue'

  const score = ref(0)
  const submitted = ref(false)
  const missing = computed(() => submitted.value && score.value === 0)

  const onSubmit = () => {
    submitted.value = true
  }
</script>

<template>
  <form
    class="flex max-w-(--container-sm) flex-col items-start gap-(--spacing-md)"
    novalidate
    @submit.prevent="onSubmit"
  >
    <Field
      required
      :invalid="missing"
    >
      <Field.Title>How satisfied are you with the support you received?</Field.Title>
      <Field.Description>1 star is very unsatisfied, 5 stars is very satisfied.</Field.Description>
      <Rating
        v-model="score"
        name="csat"
        clearable
      />
      <Field.Error v-if="missing">Pick a score from 1 to 5 stars.</Field.Error>
    </Field>
    <Button
      type="submit"
      label="Send feedback"
    />
  </form>
</template>

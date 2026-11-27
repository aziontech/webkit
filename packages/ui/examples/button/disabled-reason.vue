<script setup>
  import Button from '@aziontech/ui/button'
  import { useId } from 'vue'

  const reason = 'Only an account owner can delete an application.'
  const reasonId = useId()
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <Button
      label="Delete application"
      variant="danger"
      disabled
      :disabled-reason="reason"
      :aria-describedby="reasonId"
    />
    <p
      :id="reasonId"
      class="text-body-sm text-(--text-muted)"
    >
      {{ reason }}
    </p>
  </div>
</template>

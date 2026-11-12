<script setup>
  import Button from '@aziontech/webkit/button'
  import OutcomeMark from '@aziontech/webkit/outcome-mark'
  import { computed, ref } from 'vue'

  const severity = ref('neutral')

  const message = computed(
    () =>
      ({
        neutral: 'web-app has not been deployed yet.',
        success: 'web-app is live in Production.',
        danger: "web-app wasn't deployed. The routing rules were refused."
      })[severity.value]
  )
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <div class="flex items-center gap-(--spacing-sm)">
      <OutcomeMark
        :severity="severity"
        size="large"
        animated
      />
      <p
        class="text-body-sm text-(--text-default)"
        role="status"
      >
        {{ message }}
      </p>
    </div>
    <div class="flex flex-wrap gap-(--spacing-xs)">
      <Button
        label="Finish with success"
        kind="outlined"
        size="small"
        @click="severity = 'success'"
      />
      <Button
        label="Finish with a failure"
        kind="outlined"
        size="small"
        @click="severity = 'danger'"
      />
    </div>
  </div>
</template>

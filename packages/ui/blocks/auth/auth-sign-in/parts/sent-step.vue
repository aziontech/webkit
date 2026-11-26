<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import type { SignInCopy } from '../lib/sign-in-copy'

  export interface SentStepProps {
    /** The card copy in the app's language. */
    copy: SignInCopy
  }

  defineProps<SentStepProps>()

  const emit = defineEmits<{
    resend: [event: MouseEvent]
    'open-reset': [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xs)">
    <div class="flex items-center gap-(--spacing-xs)">
      <p class="text-body-sm text-(--text-default)">
        {{ copy.didNotReceive }}
      </p>
      <Button
        type="button"
        :label="copy.resendEmail"
        variant="link"
        @click="(event: MouseEvent) => emit('resend', event)"
      />
    </div>
    <div class="flex items-center gap-(--spacing-xs)">
      <p class="text-body-sm text-(--text-default)">
        {{ copy.alreadyOpened }}
      </p>
      <Button
        type="button"
        :label="copy.setNewPassword"
        variant="link"
        @click="(event: MouseEvent) => emit('open-reset', event)"
      />
    </div>
  </div>
</template>

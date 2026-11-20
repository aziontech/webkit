<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import FeedbackReasonDialog from '@aziontech/webkit/feedback-reason-dialog'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { ref } from 'vue'

  const answer =
    'Turn on **Image Optimization** in the application settings, then add `?ims=300x` to the image URL.'
  const feedback = ref(null)
  const reasonOpen = ref(false)
  const sending = ref(false)

  const onFeedback = (value) => {
    feedback.value = value
    if (value === 'down') reasonOpen.value = true
  }

  const sendReason = () => {
    sending.value = true
    setTimeout(() => {
      sending.value = false
      reasonOpen.value = false
    }, 600)
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ChatMessage timestamp="10:44">
      <StreamingResponse :content="answer" />
      <template #actions>
        <ChatMessage.Actions>
          <ChatMessage.Feedback
            :model-value="feedback"
            @update:model-value="onFeedback"
          />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
    <FeedbackReasonDialog
      v-model:open="reasonOpen"
      :loading="sending"
      @submit="sendReason"
    />
  </div>
</template>

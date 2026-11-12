<script setup>
  import ChatMessageRoot from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'

  const questions = [
    'Which domains does storefront answer on?',
    'Is the certificate of shop.example.com valid?',
    'When does it expire?',
    'Can it renew on its own?',
    'What is the cache hit ratio today?',
    'Which paths miss the cache most?'
  ]
  const answers = [
    'storefront answers on www.example.com and shop.example.com.',
    'Yes, it is a valid Let’s Encrypt certificate.',
    'On 14 January, in 64 days.',
    'Yes. Automatic renewal is on for both domains.',
    '91% over the last 24 hours.',
    'The search pages, because every query is a new cache key.'
  ]
</script>

<template>
  <div
    class="flex h-[24rem] w-full max-w-(--container-3xl) flex-col rounded-(--shape-card) border border-(--border-default)"
  >
    <Conversation>
      <template
        v-for="(question, index) in questions"
        :key="question"
      >
        <ChatMessageRoot from="user">{{ question }}</ChatMessageRoot>
        <ChatMessageRoot>{{ answers[index] }}</ChatMessageRoot>
      </template>
    </Conversation>
  </div>
</template>

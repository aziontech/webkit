<script setup>
  import ChatMessageRoot from '@aziontech/ui/chat-message-root'
  import Conversation from '@aziontech/ui/conversation'
  import { computed, onBeforeUnmount, ref } from 'vue'

  const history = [
    ['Which domains does storefront answer on?', 'www.example.com and shop.example.com.'],
    [
      'Is the certificate of shop.example.com valid?',
      'Yes, it is a valid Let’s Encrypt certificate.'
    ],
    ['When does it expire?', 'On 14 January, in 64 days.'],
    ['Can it renew on its own?', 'Yes. Automatic renewal is on for both domains.'],
    ['What is the cache hit ratio today?', '91% over the last 24 hours.'],
    [
      'Which paths miss the cache most?',
      'The search pages, because every query is a new cache key.'
    ],
    ['Can I cache them anyway?', 'Yes. Add a cache rule that ignores the query string on /search.'],
    ['Will that serve stale results?', 'For up to 60 seconds, the TTL of the rule.'],
    ['Add the rule with a 60 second TTL.', 'Done. The rule is live on storefront.']
  ]

  const PAGE = 3
  const start = ref(history.length - PAGE)
  const loading = ref(false)
  const turns = computed(() => history.slice(start.value))
  let timer

  function loadOlder() {
    loading.value = true
    timer = setTimeout(() => {
      start.value = Math.max(0, start.value - PAGE)
      loading.value = false
    }, 800)
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div
    class="flex h-[24rem] w-full max-w-(--container-3xl) flex-col rounded-(--shape-card) border border-(--border-default)"
  >
    <Conversation
      :more-messages="start > 0"
      :loading-more="loading"
      @load-more="loadOlder"
    >
      <template
        v-for="[question, answer] in turns"
        :key="question"
      >
        <ChatMessageRoot from="user">{{ question }}</ChatMessageRoot>
        <ChatMessageRoot>{{ answer }}</ChatMessageRoot>
      </template>
    </Conversation>
  </div>
</template>

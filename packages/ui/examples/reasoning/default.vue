<script setup>
  import Reasoning from '@aziontech/webkit/reasoning'
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <Reasoning :duration="14">
      <p>The reader asks why the cache hit ratio of storefront dropped this week.</p>
      <p>
        Checking the cache settings of <code>storefront</code>: query strings are part of the cache
        key, and a campaign started on Monday adds <code>utm_source</code> to every link.
      </p>
      <p>Each campaign link is a new cache key, so most requests miss the cache.</p>
    </Reasoning>
  </div>
</template>

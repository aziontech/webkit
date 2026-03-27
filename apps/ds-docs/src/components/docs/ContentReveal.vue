<script setup lang="ts">
/**
 * ContentReveal
 *
 * Wraps page content with a smooth enter animation using Motion.
 * Use in layouts so that when a page renders, the main content area
 * fades in and slides up progressively.
 */

import { motion } from 'motion-v';
</script>

<template>
  <motion.div
    class="content-reveal"
    :initial="{ opacity: 0, y: 10 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.05,
    }"
  >
    <slot />
  </motion.div>
</template>

<style scoped>
.content-reveal {
  /* Preserve layout; motion handles transform */
  min-height: 0;
}
</style>

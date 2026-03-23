<template>
  <div
    class="border border-neutral-700 bg-neutral-900 px-6 py-5 flex flex-col justify-between"
    :class="{'before:bg-neutral-200 before:w-2 before:h-2 before:absolute before:block relative before:left-[-4px] before:top-[-4px] before:border before:border-neutral-700 before:rounded-sm after:bg-neutral-200 after:w-2 after:h-2 after:absolute after:block after:top-[-4px] after:right-[-4px] after:border after:border-neutral-700 after:rounded-sm': showRoundedBorder, 'rounded-md': !showRoundedBorder }"
  >
    <div class="flex flex-col gap-3" :class="{'before:w-2 before:h-2  before:bg-neutral-200 before:absolute before:block before:left-[-4px] before:bottom-[-4px] before:border before:border-neutral-700 before:rounded-sm after:bg-neutral-200 after:w-2 after:h-2 after:absolute after:block after:bottom-[-4px] after:right-[-4px] after:border after:border-neutral-700 after:rounded-sm': showRoundedBorder }">
      <p class="text-xs font-medium font-proto-mono uppercase text-orange-400">
        {{ overline }}
      </p>

      <h3 class="font-sora text-[18px]/7 font-normal text-base">
        {{ title }}
      </h3>

      <p class="text-sm/7 font-sora text-muted">
        {{ description }}
      </p>
    </div>

    <div class="mt-6" v-if="link">
      <Button
        :type="'linkSecondary'"
        :label="linkText || 'Learn more'"
        :href="link"
        :size="'large'"
        :customClass="'px-0 py-0'"
      />
    </div>
  </div>
</template>

<script setup>
import Button from '../button'
defineOptions({ name: 'CardContent' })

defineProps({
  overline: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: ''
  },
  showRoundedBorder: {
    type: Boolean,
    default: false
  }
})
</script>

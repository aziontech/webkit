<template>
  <div
    class="border border-default bg-surface px-6 py-5 flex flex-col justify-between"
    :class="cardContainerClass"
  >
    <div class="flex flex-col gap-elements-base" :class="contentInnerClass">
      <p class="font-proto-mono text-overline-sm text-brand-primary-400" v-if="overline">
        {{ overline }}
      </p>

      <span
          v-if="icon"
          :class="icon"
          class="text-brand-primary-400 text-heading-sm"
      ></span>

      <h3 class="font-sora text-heading-sm font-normal" v-if="title">
        {{ title }}
      </h3>

      <p class="text-body-sm font-sora text-muted" v-if="description">
        {{ description }}
      </p>
    </div>

    <div class="mt-6" v-if="link">
      <Button
        type="link"
        :label="linkText || 'Learn more'"
        :href="link"
        :size="'small'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '../../../components/site/button/button.vue'

defineOptions({ name: 'CardContent' })

const props = defineProps({
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
  icon: {
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
  },
  group: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  },
  isLargeScreen: {
    type: Boolean,
    default: true
  },
  isInLastRow: {
    type: Boolean,
    default: true
  },
  showRightBullets: {
    type: Boolean,
    default: true
  }
})

const baseBulletClasses = 'before:bg-surface before:w-2 before:h-2 before:absolute before:block before:border before:border-subtle before:rounded-sm after:bg-surface after:w-2 after:h-2 after:absolute after:block after:border after:border-subtle after:rounded-sm'

const cardContainerClass = computed(() => {
  if (!props.showRoundedBorder) {
    return 'rounded-md'
  }

  if (props.group) {
    if (props.isLast) {
      return [
        baseBulletClasses,
        'relative',
        'before:left-[-4px] before:top-[-4px]',
        props.showRightBullets ? 'after:right-[-4px] after:top-[-4px]' : 'after:hidden'
      ]
    }

    if (props.isLargeScreen) {
      return [
        baseBulletClasses,
        'relative',
        'before:left-[-4px] before:top-[-4px] before:block',
        'after:hidden'
      ]
    } else {
      return [
        baseBulletClasses,
        'relative',
        'before:left-[-4px] before:top-[-4px]',
        props.showRightBullets ? 'after:right-[-4px] after:top-[-4px]' : 'after:hidden'
      ]
    }
  }

  return [
    baseBulletClasses,
    'relative',
    'before:left-[-4px] before:top-[-4px]',
    props.showRightBullets ? 'after:right-[-4px] after:top-[-4px]' : 'after:hidden'
  ]
})

const contentInnerClass = computed(() => {
  if (!props.showRoundedBorder) {
    return ''
  }

  if (props.group) {
    // Only show bottom bullets if card is in the last row
    if (!props.isInLastRow) {
      return [
        'before:hidden',
        'after:hidden'
      ]
    }

    if (props.isLast) {
      return [
        baseBulletClasses,
        'before:left-[-4px] before:bottom-[-4px]',
        props.showRightBullets ? 'after:right-[-4px] after:bottom-[-4px]' : 'after:hidden'
      ]
    }

    if (props.isLargeScreen) {
      return [
        baseBulletClasses,
        'before:left-[-4px] before:bottom-[-4px] before:block',
        'after:hidden'
      ]
    } else {
      return [
        baseBulletClasses,
        'before:left-[-4px] before:bottom-[-4px]',
        props.showRightBullets ? 'after:right-[-4px] after:bottom-[-4px]' : 'after:hidden'
      ]
    }
  }

  return [
    baseBulletClasses,
    'before:left-[-4px] before:bottom-[-4px]',
    props.showRightBullets ? 'after:right-[-4px] after:bottom-[-4px]' : 'after:hidden'
  ]
})
</script>

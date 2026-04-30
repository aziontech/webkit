<script setup>
  import { computed } from 'vue'

  defineOptions({ name: 'PricingCard' })

  const props = defineProps({
    popular: {
      type: Boolean,
      default: false
    },
    popularText: {
      type: String,
      default: 'Popular'
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    features: {
      type: Array,
      default: () => []
    },
    monthlyPrice: {
      type: String,
      default: ''
    },
    annualPrice: {
      type: String,
      default: ''
    },
    currentPeriod: {
      type: String,
      default: 'monthly'
    },
    priceLabel: {
      type: String,
      default: 'start at'
    },
    buttonLabel: {
      type: String,
      default: ''
    },
    buttonLink: {
      type: String,
      default: ''
    },
    buttonTarget: {
      type: String,
      default: '_self'
    },
    customPrice: {
      type: String,
      default: ''
    },
    buttonHidden: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String,
      default: 'vertical',
      validator: (value) => ['vertical', 'horizontal'].includes(value)
    }
  })

  const currentPrice = computed(() =>
    props.currentPeriod === 'monthly' ? props.monthlyPrice : props.annualPrice
  )

  const normalizedCurrentPrice = computed(() => currentPrice.value || '')

  const currentPeriodSuffix = computed(() => {
    if (currentPrice.value === '$0') {
      return '/forever'
    }
    return props.currentPeriod === 'annual' ? '/yr' : '/mo'
  })

  const isHorizontal = computed(() => props.orientation === 'horizontal')
</script>

<template>
  <div
    :class="[
      'border-default border text-default bg-surface',
      isHorizontal
        ? 'p-5 flex flex-col md:flex-row gap-5 h-full w-full'
        : 'p-6 flex flex-col justify-between h-full w-full md:w-[20rem]',
      !buttonHidden ? 'rounded-xl pb-2' : 'rounded-t-xl lg:rounded-xl'
    ]"
  >
    <div :class="isHorizontal ? 'md:w-1/3 md:min-w-56' : 'pb-5'">
      <div class="flex gap-4 pb-4 items-center">
        <h3 class="text-heading-lg font-sora font-bold">{{ title }}</h3>
        <span
          v-if="popular"
          class="h-fit text-body-xs flex font-proto-mono justify-center items-center bg-violet-500 text-neutral-900 px-2 py-1 rounded"
        >
          {{ popularText }}
        </span>
      </div>
      <p class="text-body-sm text-muted">{{ subtitle }}</p>
    </div>

    <div :class="isHorizontal ? 'flex-1' : 'h-[13rem]'">
      <ul :class="isHorizontal ? 'mb-0' : 'mb-10'">
        <li
          v-for="(feature, index) in features"
          :key="`${feature?.label || 'feature'}-${index}`"
          class="flex items-center gap-2 mb-2"
        >
          <span
            v-if="feature?.icon"
            :class="[feature.icon, 'text-primary']"
          />
          <p class="font-sora text-body-sm">{{ feature?.label }}</p>
        </li>
      </ul>
    </div>

    <div
      :class="[
        'flex mb-2 justify-between flex-wrap font-proto-mono',
        isHorizontal ? 'md:w-44 md:min-w-44 md:self-stretch' : 'h-24',
        !buttonHidden ? 'pb-2' : 'pb-0',
        customPrice ? 'items-end' : 'items-center'
      ]"
    >
      <span
        v-if="!customPrice"
        class="text-body-xs w-full mb-2 text-left font-proto-mono"
      >
        {{ priceLabel }}
      </span>

      <template v-if="!customPrice">
        <div class="flex items-end text-body-sm font-proto-mono">
          <span v-if="normalizedCurrentPrice.startsWith('$')">$</span>
          <h4 class="text-big-number-lg leading-none tracking-tighter font-proto-mono">
            {{ normalizedCurrentPrice.replace('$', '') }}
          </h4>
          <span class="font-proto-mono">{{ currentPeriodSuffix }}</span>
        </div>
      </template>

      <template v-else>
        <span class="text-heading-md w-full flex items-end text-left font-proto-mono">
          {{ customPrice }}
        </span>
      </template>
    </div>

    <div
      v-if="!buttonHidden"
      class="pb-4 hidden md:flex"
    >
      <slot name="button" />
    </div>
  </div>
</template>

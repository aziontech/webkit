<script setup>
  import { computed } from 'vue'
  import Button from '../site/button/button.vue'

  defineOptions({ name: 'PricingCard' })

  const props = defineProps({
    popular: {
      type: Boolean,
      default: false
    },
    pupularText: {
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
    }
  })

  const currentPrice = computed(() =>
    props.currentPeriod === 'monthly' ? props.monthlyPrice : props.annualPrice
  )

  const normalizedCurrentPrice = computed(() => currentPrice.value || '')

  const currentPeriodSuffix = computed(() => (props.currentPeriod === 'annual' ? '/yr' : '/mo'))
</script>

<template>
  <div
    :class="[
      'p-6 flex flex-col justify-between h-full w-full md:w-[20rem] border-default border text-default bg-surface',
      !buttonHidden ? 'rounded-xl pb-2' : 'rounded-t-xl lg:rounded-xl'
    ]"
  >
    <div class="pb-5">
      <div class="flex gap-4 pb-4 items-center">
        <h3 class="text-heading-lg font-sora font-bold">{{ title }}</h3>
        <span
          v-if="popular"
          class="h-fit text-body-xs flex font-proto-mono justify-center items-center bg-violet-500 text-neutral-900 px-2 py-1 rounded"
        >
          {{ pupularText }}
        </span>
      </div>
      <p class="text-body-sm text-muted">{{ subtitle }}</p>
    </div>

    <div class="h-[13rem]">
      <ul class="mb-10">
        <li
          v-for="(feature, index) in features"
          :key="`${feature?.label || 'feature'}-${index}`"
          class="flex items-center gap-2 mb-2"
        >
          <span
            v-if="feature?.icon"
            :class="['pi', feature.icon, 'text-primary']"
          />
          <p class="font-sora text-body-sm">{{ feature?.label }}</p>
        </li>
      </ul>
    </div>

    <div
      :class="[
        'h-24 flex mb-2 justify-between flex-wrap font-proto-mono',
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
          <h4 class="text-big-number-md leading-[3.5rem] tracking-tighter font-proto-mono">
            {{ normalizedCurrentPrice.replace('$', '') }}
          </h4>
          <span class="font-proto-mono">{{ currentPeriodSuffix }}</span>
        </div>
      </template>

      <template v-else>
        <span class="text-heading-md w-full flex items-end text-left font-sora">
          {{ customPrice }}
        </span>
      </template>
    </div>

    <div
      v-if="!buttonHidden"
      class="pb-4 hidden md:flex"
    >
      <Button
        :icon="'pi pi-chevron-right'"
        :label="buttonLabel"
        :type="'primary'"
        :href="buttonLink"
        :target="buttonTarget"
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import Button from '../button/button.vue'

  const props = defineProps({
    popular: Boolean,
    title: String,
    subtitle: String,
    features: Array,
    monthlyPrice: String,
    annualPrice: String,
    currentPeriod: {
      type: String,
      default: 'monthly'
    },
    priceLabel: {
      type: String,
      default: 'start at'
    },
    buttonLabel: String,
    customPrice: String,
    buttonHidden: {
      type: Boolean,
      default: false
    }
  })

  const currentPrice = computed(() => {
    return props.currentPeriod === 'monthly' ? props.monthlyPrice : props.annualPrice
  })
</script>

<template>
  <div
    :class="[
      'p-6 flex flex-col justify-between h-full w-full md:w-[20rem] text-white',
      popular ? 'bg-neutral-900' : 'bg-neutral-900',
      !buttonHidden ? 'rounded-t-xl md:rounded-xl pb-2' : 'rounded-xl'
    ]"
  >
    <div class="pb-5">
      <div class="flex gap-4 pb-4 items-center">
        <h3 class="display-2 font-sora font-bold">{{ title }}</h3>
        <template v-if="popular">
          <span
            class="h-fit text-xs flex font-proto-mono justify-center items-center text-neutral-950 bg-orange-500 px-2 py-1 rounded"
            >Popular</span
          >
        </template>
      </div>
      <p class="text-sm">{{ subtitle }}</p>
    </div>
    <div class="h-[13rem]">
      <ul class="mb-10">
        <li
          class="flex items-center gap-2 mb-2"
          v-for="feature in features"
          :key="feature"
        >
          <span
            v-if="feature.icon"
            :class="['pi', feature.icon, 'text-orange-500']"
          ></span>
          <p class="font-sora text-sm">{{ feature.label }}</p>
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
        class="text-xs w-full mb-2 text-left font-proto-mono"
        v-if="!customPrice"
        >{{ priceLabel }}</span
      >
      <template v-if="!customPrice">
        <div class="flex items-end text-sm font-proto-mono">
          <span v-if="currentPrice.startsWith('$')">$</span>
          <h4 class="text-7xl leading-[3.5rem] tracking-tighter font-proto-mono">
            {{ currentPrice.replace('$', '') }}
          </h4>
          <span class="font-proto-mono">{{ currentPeriod === 'monthly' ? '/mo' : '/mo' }}</span>
        </div>
      </template>
      <template v-else>
        <span class="display-3 w-full flex items-end text-left font-sora">{{ customPrice }}</span>
      </template>
    </div>
    <div class="pb-4 hidden md:flex">
      <Button
        :icon="'pi pi-chevron-right'"
        :theme="popular ? 'light' : 'dark'"
        :label="buttonLabel"
        :type="popular ? 'primary' : 'secondary'"
        size="small"
      />
    </div>
  </div>
</template>

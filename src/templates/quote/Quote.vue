
<template>
  <div class="flex flex-col text-center lg:text-start lg:gap-x-16 gap-y-6 items-center justify-center"
      :class="[{'lg:flex-row' : direction === 'row'}, {'lg:flex-col' : direction === 'column'}]"
  >
    <p class="max-w-md text-xl font-medium leading-normal" :class="[{'text-center': direction === 'column' }]">
      {{ text }}
    </p>
    <div class="flex flex-col gap-3 lg:items-start min-w-[180px] mt-4 lg:mt-0" :class="[{'lg:items-center' : direction === 'column'}]">
      <ImageSwitcher>
        <template #lightImage>
          <img
            :src="`${imageLight}?ims=x40`"
            loading="lazy"
            width="160" height="40" :alt="alt" />
        </template>
        <template #darkImage>
          <img
            :src="`${imageDark}?ims=x40`"
            loading="lazy"
            width="160" height="40" :alt="alt" />
        </template>
      </ImageSwitcher>
      <template v-if="label">
        <p class="text-xs text-color-secondary leading-normal" :class="[{'text-center' : direction === 'column'}]">
          {{ label }}
        </p>
      </template>
    </div>
  </div>
</template>

<script setup>
import ImageSwitcher from "../themeawareimageswitcher/ImageSwitcher.vue";

defineProps({
  text: {
    type: String,
    required: true,
  },
  imageLight: {
    type: String,
    required: true,
  },
  imageDark: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  direction: {
    type: String,
    required: false,
    default: 'row',
    options: ["row", 'column']
  },
  alt: {
    type: String,
    required: false,
  }
})
</script>

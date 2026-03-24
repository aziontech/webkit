<template>
  <div class="flex flex-col items-center gap-3">
    <div class="flex items-center rounded-lg justify-center bg-[#13131A] w-fit p-2 px-3">
      <div class="flex items-center relative">
        <div
          ref="backgroundElement"
          :class="[
            'absolute top-1 bottom-1 rounded-sm transition-all duration-300 ease-out',
            'bg-[#B5B1F4]'
          ]"
          :style="backgroundStyle"
        ></div>
        <div
          ref="mainButton"
          @click="selectOption('main')"
          :class="[
            'whitespace-nowrap relative z-10 px-3 py-1 rounded-md transition-all duration-300 ease-in-out',
            'font-proto-mono tracking-tight uppercase cursor-pointer text-center',
            selectedOption === 'main'
              ? 'text-neutral-900'
              : 'text-neutral-400 hover:text-neutral-200'
          ]"
        >
          {{ mainLabel }}
        </div>
        <div
          ref="alternativeButton"
          @click="selectOption('alternative')"
          :class="[
            'whitespace-nowrap relative z-10 px-3 py-1 rounded-md transition-all duration-300 ease-in-out',
            'font-proto-mono tracking-tight uppercase cursor-pointer text-center',
            selectedOption === 'alternative'
              ? 'text-neutral-900'
              : 'text-neutral-400 hover:text-neutral-200'
          ]"
        >
          {{ alternativeLabel }}
        </div>
      </div>
    </div>
    <p
      v-if="description"
      class="text-xs font-sora text-neutral-100 text-center mt-3 mb-[3.75rem]"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup>
  import { ref, watch, computed, onMounted, nextTick } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: 'main'
    },
    mainLabel: {
      type: String,
      default: 'monthly'
    },
    alternativeLabel: {
      type: String,
      default: 'yearly'
    },
    description: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const selectedOption = ref(props.modelValue)
  const mainButton = ref(null)
  const alternativeButton = ref(null)
  const backgroundElement = ref(null)

  const backgroundStyle = computed(() => {
    if (!mainButton.value || !alternativeButton.value) {
      return {}
    }

    const activeButton =
      selectedOption.value === 'main' ? mainButton.value : alternativeButton.value
    const width = activeButton.offsetWidth
    const left =
      selectedOption.value === 'main'
        ? mainButton.value.offsetLeft
        : alternativeButton.value.offsetLeft

    return {
      width: `${width}px`,
      left: `${left}px`
    }
  })

  const selectOption = (option) => {
    selectedOption.value = option
    emit('update:modelValue', option)
    emit('change', option)
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      selectedOption.value = newValue
    }
  )

  onMounted(() => {
    nextTick(() => {
      if (backgroundElement.value) {
        backgroundElement.value.style.transition = 'none'
        void backgroundElement.value.offsetWidth
        backgroundElement.value.style.transition = ''
      }
    })
  })
</script>

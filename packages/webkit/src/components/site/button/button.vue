<template>
  <a
    v-if="isLink"
    :href="href"
    :target="target"
    :class="rootClasses"
    @click="emit('click', $event)"
  >
    <span :class="labelClasses">{{ label }}</span>
    <span
      :class="arrowClasses"
      aria-hidden="true"
    />
  </a>

  <PrimeButton
    v-else
    :label="label"
    :size="size"
    :icon="icon"
    :class="rootClasses"
    :pt="{
      icon: {
        class: iconClasses
      },
      label: {
        class: labelClasses
      }
    }"
    @click="emit('click', $event)"
  />
</template>

<script setup>
  import PrimeButton from 'primevue/button'
  import { computed } from 'vue'

  const emit = defineEmits(['click'])

  const props = defineProps({
    label: String,
    size: {
      type: String,
      options: ['small', 'large'],
      default: 'large'
    },
    type: {
      type: String,
      options: ['primary', 'secondary', 'link'],
      default: 'secondary'
    },
    href: String,
    icon: String,
    customClass: {
      type: String
    },
    target: {
      type: String,
      default: '_self',
      options: ['_blank', '_self']
    },
    location: {
      required: false,
      type: String,
      default: 'cta'
    }
  })

  const isLink = computed(() => props.type === 'link')

  const variantClasses = {
    primary: {
      root:
        'group h-fit border-1 border-neutral-100 bg-neutral-100 text-neutral-900 duration-300 transition rounded-md hover:bg-orange-500 hover:border-orange-500 hover:text-neutral-900 focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none',
      label: 'font-proto-mono whitespace-nowrap',
      icon: '!text-[.75rem] duration-300 transition flex items-center mr-2 text-neutral-900 group-hover:text-neutral-900'
    },
    secondary: {
      root:
        'group h-fit bg-neutral-900 text-neutral-100 duration-300 transition rounded-md active:bg-neutral-900 border-1 border-neutral-800 hover:bg-neutral-950 hover:text-orange-500 focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none',
      label: 'font-proto-mono whitespace-nowrap',
      icon: '!text-[.75rem] duration-300 transition flex items-center mr-2 text-neutral-100 group-hover:text-neutral-100'
    },
    link: {
      root:
        "group inline-flex items-center gap-3 w-fit cursor-pointer no-underline relative after:duration-150 hover:after:w-full group-hover:after:w-full after:left-0 after:w-0 after:h-[1px] after:transition-all after:content-[''] after:absolute after:-bottom-[.1rem] after:bg-neutral-200 bg-transparent border-none text-neutral-100 !leading-[.75rem] focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none",
      label: 'font-proto-mono whitespace-nowrap',
      icon: ''
    }
  }

  const paddingClasses = computed(() => {
    if (isLink.value) {
      return 'px-0 py-0'
    }

    return props.size === 'small' ? 'px-3 py-2' : 'px-3 py-3'
  })

  const rootClasses = computed(() => {
    return [variantClasses[props.type].root, paddingClasses.value, props.customClass]
  })

  const labelClasses = computed(() => {
    const sizeClasses = props.size === 'small' ? 'text-xs leading-[1rem]' : 'text-sm leading-[1.5rem]'
    return `${variantClasses[props.type].label} ${sizeClasses}`
  })

  const iconClasses = computed(() => {
    return variantClasses[props.type].icon
  })

  const arrowClasses = computed(() => {
    return [
      'flex pi pi-arrow-right text-sm text-brand-primary-400 group-hover:translate-x-[.1rem] -translate-x-[.1rem] transition-transform relative',
      props.target === '_blank' ? 'translate-y-0 group-hover:translate-y-[-50%] top-[20%]' : ''
    ]
  })

</script>

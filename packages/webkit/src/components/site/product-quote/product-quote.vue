<template>
  <section
    :id="id"
    class="text-white relative overflow-hidden max-w-xl xxxl:max-w-xxl mx-auto"
    :class="padding[spacing ?? 'default']"
  >
    <div class="mx-auto flex flex-col items-start text-left gap-6 md:gap-8">
      <div
        v-if="logo"
        class="flex items-center justify-start"
      >
        <img
          :src="logo"
          :alt="logoAlt || 'Company logo'"
          class="h-7 md:h-10 w-auto object-contain"
          :class="logoClass"
        />
      </div>

      <blockquote class="flex flex-col gap-4 md:gap-6">
        <p class="display-4-mobile md:display-4 max-w-sm md:max-w-7xl text-neutral-200 font-sora">
          "{{ quote }}"
        </p>
      </blockquote>

      <div
        v-if="author || role"
        class="flex gap-8 w-full justify-start text-neutral-300"
      >
        <p
          v-if="author"
          class="font-proto-mono text-sm text-orange-500"
        >
          {{ author }}
        </p>
        <p
          v-if="role"
          class="font-proto-mono text-sm text-white"
        >
          {{ role }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  export interface ProductQuoteButtonProps {
    label: string
    size?: 'small' | 'large'
    type?: 'primary' | 'secondary' | 'link' | 'tertiary' | 'linkExternal'
    href: string
    icon?: string
    theme?: string
    customClass?: string
  }

  interface ProductQuoteProps {
    quote: string
    author?: string
    role?: string
    logo?: string
    logoAlt?: string
    logoClass?: string
    buttons?: ProductQuoteButtonProps[]
    spacing?: 'none' | 'small' | 'default' | 'large'
    id?: string
  }

  withDefaults(defineProps<ProductQuoteProps>(), {
    spacing: 'default',
    buttons: () => []
  })

  const padding = {
    none: 'py-0',
    small: 'py-5 lg:py-10 xl:py-16 2xl:py-20',
    default: 'py-10 lg:py-20 xl:py-30 2xl:py-40',
    large: 'py-14 lg:py-30 xl:py-40 2xl:py-48'
  }
</script>

<template>
  <a
    :href="href"
    :target="target"
    class="group cursor-pointer"
  >
    <div
      class="p-3 md:p-6 h-full gap-20 flex flex-col justify-between border border-neutral-700 group-hover:bg-neutral-800 rounded-lg transition-colors relative overflow-hidden"
    >
      <div
        class="flex group-hover:text-color-secondary h-10"
        :class="icon ? 'justify-between' : 'justify-end'"
      >
        <div
          class="text-2xl"
          v-if="icon"
        >
          <i
            class="pi text-color-secondary text-4xl"
            :class="icon"
          />
        </div>
        <i
          class="pi font-bold text-2xl text-neutral-800 group-hover:text-neutral-500 transition-colors"
          :class="target === '_blank' ? 'pi-arrow-up-right' : 'pi-arrow-right'"
        />
      </div>
      <div class="flex flex-col gap-3 font-sora relative">
        <div
          class="relative min-h-[4rem] flex flex-col inset-0 transform transition-all duration-300 ease-in-out group-hover:-translate-y-0 translate-y-2/3"
        >
          <h4 class="font-sora text-2xl">
            {{ title }}
          </h4>
          <p
            class="text-neutral-400 font-sora flex items-center group-hover:opacity-100 opacity-0 transform transition-all duration-300"
            v-html="description"
          />
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
  const props = defineProps({
    label: {
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
    href: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      options: ['_blank', '_self'],
      default: '_self'
    }
  })
</script>

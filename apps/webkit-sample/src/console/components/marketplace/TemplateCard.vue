<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'

  interface Props {
    icon: string
    markClass?: string
    title: string
    description?: string
    color?: string
  }

  withDefaults(defineProps<Props>(), {
    markClass: '',
    description: '',
    color: 'var(--primary)'
  })

  const emit = defineEmits<{
    select: [event: Event]
  }>()

  const glow = (color) => `radial-gradient(120% 90% at 18% 0%, ${color}33, transparent 62%)`

  const activate = (event) => emit('select', event)
</script>

<template>
  <CardBox
    class="group relative cursor-pointer"
    role="button"
    tabindex="0"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate"
  >
    <template #content>
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-100 motion-reduce:transition-none"
        :style="{ background: glow(color) }"
      />
      <div class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-left">
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
        >
          <i
            :class="[icon, markClass]"
            class="text-body-lg leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <h3 class="text-label-md text-(--text-default)">{{ title }}</h3>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
        </div>
      </div>
    </template>
  </CardBox>
</template>

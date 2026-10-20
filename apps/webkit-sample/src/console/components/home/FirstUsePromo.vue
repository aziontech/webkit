<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import { computed } from 'vue'

  interface Props {
    title: string
    description?: string
    href?: string
    navigates?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    href: '',
    navigates: false
  })

  defineSlots<{
    logos(): unknown
  }>()

  const goesAway = computed(() => Boolean(props.href) || props.navigates)

  defineEmits<{
    activate: []
  }>()
</script>

<template>
  <CardBox
    :padded="false"
    class="w-full"
  >
    <template #content>
      <component
        :is="href ? 'a' : 'button'"
        :type="href ? undefined : 'button'"
        :href="href || undefined"
        :target="href ? '_blank' : undefined"
        :rel="href ? 'noreferrer' : undefined"
        class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-left transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
        @click="href ? undefined : $emit('activate')"
      >
        <span
          class="flex items-center [&>*+*]:-ml-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ml-1.5 group-focus-visible:[&>*+*]:-ml-1.5 motion-reduce:[&>*+*]:transition-none"
          aria-hidden="true"
        >
          <slot name="logos" />
        </span>

        <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <span class="text-heading-xxs text-(--text-default)">{{ title }}</span>
          <span
            v-if="description"
            class="text-pretty text-body-sm text-(--text-muted)"
            >{{ description }}</span
          >
        </span>

        <i
          v-if="goesAway"
          class="pi pi-external-link absolute right-(--spacing-md) top-(--spacing-md) text-body-sm leading-none text-(--text-muted) transition-colors duration-150 ease-out motion-reduce:transition-none group-hover:text-(--text-default)"
          aria-hidden="true"
        />
      </component>
    </template>
  </CardBox>
</template>

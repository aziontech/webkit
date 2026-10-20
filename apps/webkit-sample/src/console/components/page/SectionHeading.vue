<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  interface Props {
    title?: string
    description?: string
    anchor?: boolean
    documentation?: string
    documentationLabel?: string
    size?: 'small' | 'medium'
    titleId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    anchor: false,
    documentation: '',
    documentationLabel: 'Documentation',
    size: 'medium'
  })

  defineSlots<{
    description(): unknown
    actions(): unknown
    bottom(): unknown
  }>()

  const route = useRoute()

  const anchorId = computed(() => {
    if (props.titleId) return props.titleId
    if (!props.anchor) return undefined
    return props.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  })

  const anchorUrl = computed(
    () => `${globalThis.location?.origin ?? ''}${route.fullPath.split('#')[0]}#${anchorId.value}`
  )
</script>

<template>
  <header class="group/heading flex flex-col">
    <div
      class="flex flex-col gap-(--spacing-md) px-(--spacing-xs) md:flex-row md:items-start md:justify-between"
    >
      <div
        v-if="title || description || $slots.description"
        class="flex min-w-0 flex-col gap-(--spacing-xxs)"
      >
        <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
          <h2
            v-if="title"
            :id="anchorId"
            :data-size="size"
            class="scroll-mt-(--spacing-xl) text-balance data-[size=medium]:text-heading-xs data-[size=medium]:text-(--text-default) data-[size=small]:text-label-md data-[size=small]:text-(--text-muted)"
          >
            {{ title }}
          </h2>
          <span
            v-if="anchor"
            class="shrink-0 opacity-0 transition-opacity duration-150 ease-out group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
          >
            <CopyButton
              :value="anchorUrl"
              kind="transparent"
              size="small"
              :aria-label="`Copy link to the ${title} section`"
              copied-label="Link copied"
            />
          </span>
        </div>
        <p
          v-if="description || $slots.description"
          class="text-pretty text-body-sm text-(--text-muted)"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div
        v-if="documentation || $slots.actions"
        class="flex w-full flex-wrap items-center gap-(--spacing-xs) md:w-auto md:shrink-0 md:flex-nowrap"
      >
        <a
          v-if="documentation"
          :href="documentation"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex shrink-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-label-sm text-(--text-link) underline-offset-2 transition-colors duration-150 ease-out hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
        >
          {{ documentationLabel }}
          <i
            class="pi pi-external-link shrink-0 text-body-sm leading-none"
            aria-hidden="true"
          />
        </a>
        <slot name="actions" />
      </div>
    </div>

    <div
      v-if="$slots.bottom"
      class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out has-[>div>div>*]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div class="min-w-0 overflow-hidden">
        <div class="pt-(--spacing-sm)">
          <slot name="bottom" />
        </div>
      </div>
    </div>
  </header>
</template>

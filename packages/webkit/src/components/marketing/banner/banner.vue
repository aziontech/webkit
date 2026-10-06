<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import SectionTitle from '../section-title/section-title.vue'

  defineOptions({
    name: 'Banner',
    inheritAttrs: false
  })

  interface Props {
    /** The announcement, rendered as the band's `h2` in the leading column. */
    title: string
    /** Supporting note set on the raised trailing column; overridden by the `aside` slot. */
    description?: string
    /** Short uppercase overline naming the programme, above the announcement. */
    eyebrow?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    eyebrow: ''
  })

  const slots = defineSlots<{
    /** The controls the band exists to offer, under the announcement. */
    actions?(): unknown
    /** Trailing column content; replaces the `description` prop when provided. */
    aside?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-banner')

  const hasAside = computed<boolean>(() => Boolean(slots.aside) || props.description.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title"
  >
    <div class="flex flex-col md:flex-row">
      <div
        class="flex flex-col justify-between gap-(--spacing-xl) bg-(--bg-surface) p-(--spacing-xxl) md:basis-2/3 md:grow"
      >
        <SectionTitle
          :framed="false"
          kind="left"
          :title="title"
          :eyebrow="eyebrow"
        />

        <div
          v-if="slots.actions"
          class="flex w-full flex-col items-stretch gap-(--spacing-sm) [&>*]:w-full md:w-auto md:flex-row md:items-center md:[&>*]:w-auto"
        >
          <slot name="actions" />
        </div>
      </div>

      <div
        v-if="hasAside"
        class="bg-(--bg-surface-raised) p-(--spacing-xxl) md:basis-1/3 md:shrink-0"
      >
        <p class="m-0 text-pretty text-heading-sm text-(--text-muted)">
          <slot name="aside">{{ description }}</slot>
        </p>
      </div>
    </div>
  </section>
</template>

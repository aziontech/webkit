<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Topic',
    inheritAttrs: false
  })

  /** Level of the heading element. */
  export type TopicHeadingLevel = 2 | 3 | 4

  interface Props {
    /** The claim, rendered as the topic's heading. */
    title: string
    /** One sentence explaining the claim; overridden by the default slot. */
    description?: string
    /** Icon class for the glyph that leads the headline. */
    icon?: string
    /** When set, the whole claim renders as an anchor link to this URL and its headline closes on a trailing arrow. */
    href?: string
    /** Level of the heading element. Keep 2 when the band has no headline of its own; drop it to 3 when a section-title has already opened the section, so the document outline stays in order. */
    headingLevel?: TopicHeadingLevel
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    icon: '',
    href: '',
    headingLevel: 2
  })

  const slots = defineSlots<{
    /** Description body; replaces the `description` prop when provided. */
    default?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-topic')

  const hasDescription = computed<boolean>(
    () => Boolean(slots.default) || props.description.length > 0
  )

  const isLink = computed<boolean>(() => props.href.length > 0)
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :data-testid="testId"
    :data-icon="icon ? true : null"
    :data-described="hasDescription || null"
    :data-linked="isLink || null"
    class="group flex flex-col gap-(--spacing-sm) text-(--text-default) no-underline transition-colors duration-150 ease-out motion-reduce:transition-none data-[linked]:hover:text-(--primary) data-[linked]:focus-visible:ring-2 data-[linked]:focus-visible:ring-(--ring-color) data-[linked]:focus-visible:ring-offset-2 data-[linked]:focus-visible:ring-offset-(--bg-canvas) data-[linked]:focus-visible:outline-none"
  >
    <div class="flex items-baseline gap-(--spacing-xs)">
      <i
        v-if="icon"
        :class="icon"
        aria-hidden="true"
        class="shrink-0 text-heading-xs text-(--primary)"
      />
      <component
        :is="`h${headingLevel}`"
        class="m-0 text-balance text-heading-xs"
      >
        {{ title }}
        <i
          v-if="isLink"
          aria-hidden="true"
          class="pi pi-arrow-up-right ml-(--spacing-xxs) text-body-xs transition-[translate] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </component>
    </div>
    <p
      v-if="hasDescription"
      class="m-0 text-pretty text-body-sm text-(--text-muted)"
    >
      <slot>{{ description }}</slot>
    </p>
  </component>
</template>

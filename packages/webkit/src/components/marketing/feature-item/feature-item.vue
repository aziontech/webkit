<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeHref } from '../../../utils/safe-href'

  defineOptions({
    name: 'FeatureItem',
    inheritAttrs: false
  })

  /** Level of the heading element. */
  export type FeatureItemHeadingLevel = 2 | 3 | 4

  export interface FeatureItemProps {
    /** The claim, rendered as the topic's heading. */
    title: string
    /** One sentence explaining the claim; overridden by the default slot. */
    description?: string
    /** Icon class for the glyph that leads the headline. */
    icon?: string
    /** When set, the whole claim renders as an anchor link to this URL and its headline closes on a trailing arrow. */
    href?: string
    /** Level of the heading element. Keep 2 when the band has no headline of its own; drop it to 3 when a module-header has already opened the section, so the document outline stays in order. */
    headingLevel?: FeatureItemHeadingLevel
  }

  const props = withDefaults(defineProps<FeatureItemProps>(), {
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feature-item')

  const hasDescription = () => Boolean(slots.default) || props.description.length > 0

  const isLink = computed<boolean>(() => safeHref(props.href) !== null)

  const opensElsewhere = computed<boolean>(() => attrs['target'] === '_blank')

  const ROOT_CLASS =
    'group flex flex-col gap-(--spacing-sm) text-(--text-default) no-underline transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none ' +
    'data-[linked]:relative data-[linked]:rounded-(--shape-control) data-[linked]:after:absolute ' +
    'data-[linked]:after:inset-x-0 data-[linked]:after:-inset-y-(--spacing-xs) data-[linked]:focus-visible:outline-2 ' +
    'data-[linked]:focus-visible:outline-offset-(--spacing-xs) data-[linked]:focus-visible:outline-(--ring-color)'

  const LINK_ARROW_CLASS =
    'az az-arrow-right ms-(--spacing-2xs) text-body-xs transition-[translate] duration-moderate-02 ease-expressive-entrance ' +
    'motion-reduce:transition-none group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5'

  const EXTERNAL_ARROW_CLASS =
    'az az-arrow-up-right ms-(--spacing-2xs) text-body-xs transition-[translate] duration-moderate-02 ease-expressive-entrance ' +
    'motion-reduce:transition-none group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:-translate-y-0.5'
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :data-testid="testId"
    :data-icon="icon ? true : null"
    :data-described="hasDescription() || null"
    :data-linked="isLink || null"
    :class="ROOT_CLASS"
  >
    <div class="flex items-start gap-(--spacing-xs)">
      <span
        v-if="icon"
        class="flex h-lh shrink-0 items-center text-heading-xs text-(--primary)"
      >
        <i
          :class="icon"
          aria-hidden="true"
        />
      </span>
      <component
        :is="`h${headingLevel}`"
        class="m-0 text-balance text-heading-xs decoration-(color:--primary) decoration-2 underline-offset-4 group-data-[linked]:group-hover:underline"
      >
        {{ title }}
        <i
          v-if="isLink && opensElsewhere"
          aria-hidden="true"
          :class="EXTERNAL_ARROW_CLASS"
        />
        <i
          v-else-if="isLink"
          aria-hidden="true"
          :class="LINK_ARROW_CLASS"
        />
      </component>
    </div>
    <p
      v-if="hasDescription()"
      class="m-0 max-w-(--container-2xl) text-pretty text-body-md text-(--text-muted)"
    >
      <slot>{{ description }}</slot>
    </p>
  </component>
</template>

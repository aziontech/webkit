<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import CopyButton from '../../actions/copy-button/copy-button.vue'

  /** Heading scale: medium for a band heading, small for a muted label-sized heading. */
  export type SectionHeaderSize = 'small' | 'medium'

  defineOptions({
    name: 'SectionHeader',
    inheritAttrs: false
  })

  interface Props {
    /** The band title, rendered as an h2. */
    title: string
    /** One sentence under the title. */
    description?: string
    /** Heading scale of the title. */
    size?: SectionHeaderSize
    /** Id of the h2 that a hash link targets; when set, a copy-link button appears beside the title on hover or focus. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    size: 'medium',
    anchor: ''
  })

  defineSlots<{
    /** Rich description content (links, inline code); replaces the description prop. */
    description(): unknown
    /** The band's own actions, on the right of the copy. */
    actions(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-section-header'
  )

  const anchorUrl = computed(() =>
    props.anchor ? `${globalThis.location?.href.split('#')[0] ?? ''}#${props.anchor}` : ''
  )
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="group/heading @container/section-header flex flex-col"
  >
    <div class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)">
      <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
        <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
          <h2
            :id="anchor || undefined"
            :data-testid="`${testId}__title`"
            :data-size="size"
            class="scroll-mt-(--spacing-xl) text-balance data-[size=medium]:text-heading-xs data-[size=medium]:text-(--text-default) data-[size=small]:text-label-md data-[size=small]:text-(--text-muted)"
          >
            {{ title }}
          </h2>
          <span
            v-if="anchor"
            class="shrink-0 opacity-0 transition-opacity duration-150 ease-out group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 [@media(hover:none)]:opacity-100 motion-reduce:transition-none"
          >
            <CopyButton
              :value="anchorUrl"
              :data-testid="`${testId}__copy-link`"
              kind="transparent"
              size="small"
              :aria-label="`Copy link to the ${title} section`"
              copied-label="Link copied"
            />
          </span>
        </div>
        <p
          v-if="$slots['description'] || description"
          :data-testid="`${testId}__description`"
          class="text-pretty text-body-sm text-(--text-muted)"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div
        v-if="$slots['actions']"
        :data-testid="`${testId}__actions`"
        class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-xs) @md/section-header:w-auto @md/section-header:max-w-full"
      >
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

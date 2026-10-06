<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import Overline from '../../overline/overline.vue'

  defineOptions({
    name: 'SectionTitle',
    inheritAttrs: false
  })

  /** Layout of the header row. */
  export type SectionTitleKind = 'centered' | 'left' | 'horizontal'
  /** Step of the headline on the heading scale. */
  export type SectionTitleSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Headline of the section, rendered as the section's `h2`. */
    title: string
    /** Supporting sentence under the headline; overridden by the default slot. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** Layout of the header: `centered` stacks and centers the copy, `left` stacks it at the start edge, `horizontal` sets the headline and its description in two columns. */
    kind?: SectionTitleKind
    /** Step of the headline on the heading scale: `small` for a subsection inside a band, `medium` for an ordinary section opener, `large` for a band whose headline is the statement. */
    size?: SectionTitleSize
    /** Draw the header's own frame and padding. Turn it off when the header is composed inside a band that already owns both. */
    framed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    eyebrow: '',
    kind: 'centered',
    size: 'medium',
    framed: true
  })

  const slots = defineSlots<{
    default?(): unknown
    actions?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-section-title'
  )

  const hasDescription = computed<boolean>(
    () => Boolean(slots.default) || props.description.length > 0
  )

  const frame = computed(() => (props.framed ? FrameBox : 'div'))
  const frameProps = computed(() =>
    props.framed ? { flush: true, borders: 'y', marks: 'all' } : {}
  )
</script>

<template>
  <component
    :is="frame"
    v-bind="{ ...$attrs, ...frameProps }"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-framed="props.framed || null"
    class="group"
  >
    <div
      class="flex flex-col items-start gap-(--spacing-xl) group-data-[framed]:px-(--spacing-xl) group-data-[framed]:py-(--spacing-xxl) group-data-[kind=centered]:items-center"
    >
      <div
        v-if="kind === 'horizontal'"
        class="flex w-full flex-col gap-(--spacing-lg)"
      >
        <Overline
          v-if="eyebrow"
          prefix="//"
          show-cursor
          >{{ eyebrow }}</Overline
        >
        <div class="grid gap-(--spacing-xl) md:grid-cols-3">
          <h2
            class="m-0 text-balance text-(--text-default) group-data-[size=small]:text-heading-lg group-data-[size=medium]:text-heading-xl group-data-[size=large]:text-heading-2xl"
          >
            {{ title }}
          </h2>
          <p
            v-if="hasDescription"
            class="m-0 self-start text-pretty text-heading-sm text-(--text-muted) md:col-start-3"
          >
            <slot>{{ description }}</slot>
          </p>
        </div>
      </div>

      <div
        v-else
        class="flex w-full max-w-(--container-2xl) flex-col gap-(--spacing-lg) group-data-[kind=centered]:items-center group-data-[kind=centered]:text-center"
      >
        <Overline
          v-if="eyebrow"
          prefix="//"
          show-cursor
          >{{ eyebrow }}</Overline
        >
        <h2
          class="m-0 text-balance text-(--text-default) group-data-[size=small]:text-heading-lg group-data-[size=medium]:text-heading-xl group-data-[size=large]:text-heading-2xl"
        >
          {{ title }}
        </h2>
        <p
          v-if="hasDescription"
          class="m-0 text-pretty text-heading-sm text-(--text-muted)"
        >
          <slot>{{ description }}</slot>
        </p>
      </div>

      <div
        v-if="slots.actions"
        class="flex w-full flex-col items-stretch gap-(--spacing-md) [&>*]:w-full sm:w-auto sm:flex-row sm:items-center sm:[&>*]:w-auto sm:group-data-[kind=centered]:justify-center"
      >
        <slot name="actions" />
      </div>
    </div>
  </component>
</template>

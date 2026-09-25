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

  interface Props {
    /** Headline of the section, rendered as the section's `h2`. */
    title: string
    /** Supporting sentence under the headline; overridden by the default slot. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** Layout of the header: `centered` stacks and centers the copy, `left` stacks it at the start edge, `horizontal` sets the headline and its description in two columns. */
    kind?: SectionTitleKind
    /** Draw the header's own frame and padding. Turn it off when the header is composed inside a band that already owns both. */
    framed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    eyebrow: '',
    kind: 'centered',
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

  // Unframed, the header is a plain block: the band composing it owns the rule and the
  // padding, so drawing either here would draw it twice.
  const frame = computed(() => (props.framed ? FrameBox : 'div'))
  const frameProps = computed(() =>
    props.framed ? { flush: true, borders: 'y', marks: 'bottom' } : {}
  )
</script>

<template>
  <!-- There is no gap around the frame: it spans the column edge to edge and its own bottom
       rule is what divides the title from the section body, so the row adds no outer margin
       and no second line. The header holds no vertical air of its own beyond this padding —
       the rhythm around it belongs to the SectionGap frames on either side. -->
  <component
    :is="frame"
    v-bind="{ ...$attrs, ...frameProps }"
    :data-testid="testId"
    :data-kind="kind"
    :data-framed="props.framed || null"
    class="group"
  >
    <div
      class="flex flex-col items-start gap-(--spacing-xl) group-data-[framed]:px-(--spacing-xl) group-data-[framed]:py-(--spacing-xxl) group-data-[kind=centered]:items-center"
    >
      <!-- Horizontal: the overline leads, then the headline and its description share a
           three-column grid — headline in the first column, description in the third, the
           middle column left as air. Below `md` the grid collapses to one column and the
           description falls back under the headline, in reading order. -->
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
          <h2 class="m-0 text-balance text-heading-xl text-(--text-default)">
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

      <!-- Centered and left share one stacked column; only the alignment differs, which is
           why it switches on the root's `data-kind` instead of on a second template. -->
      <div
        v-else
        class="flex w-full max-w-(--container-2xl) flex-col gap-(--spacing-lg) group-data-[kind=centered]:items-center group-data-[kind=centered]:text-center"
      >
        <!-- The overline anatomy the framed sections share: a `//` prefix, the label in the
             accent, and the blinking cursor. All three are props of Overline, so this is the
             DS component configured — not a copy of its look. -->
        <Overline
          v-if="eyebrow"
          prefix="//"
          show-cursor
          >{{ eyebrow }}</Overline
        >
        <h2 class="m-0 text-balance text-heading-xl text-(--text-default)">
          {{ title }}
        </h2>
        <p
          v-if="hasDescription"
          class="m-0 text-pretty text-heading-sm text-(--text-muted)"
        >
          <slot>{{ description }}</slot>
        </p>
      </div>

      <!-- The actions row stacks and goes fluid below `sm` — a section CTA is a primary
           target and a thumb should not have to aim at a shrink-wrapped label — and
           `[&>*]:w-full` is what reaches the slotted controls, since the wrapper's own width
           says nothing about theirs. From `sm` up it is a content-width row, centered only
           when the header is. -->
      <div
        v-if="slots.actions"
        class="flex w-full flex-col items-stretch gap-(--spacing-md) [&>*]:w-full sm:w-auto sm:flex-row sm:items-center sm:[&>*]:w-auto sm:group-data-[kind=centered]:justify-center"
      >
        <slot name="actions" />
      </div>
    </div>
  </component>
</template>

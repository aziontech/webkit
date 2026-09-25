<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import Overline from '../../overline/overline.vue'
  import SectionTitle from '../section-title/section-title.vue'

  defineOptions({
    name: 'CallToAction',
    inheritAttrs: false
  })

  /** Layout of the band. */
  export type CallToActionKind = 'panel' | 'split' | 'lead'

  interface Props {
    /** Headline of the band, rendered as its `h2`. */
    title: string
    /** Second line of the headline, set in muted ink; rendered as a second span of the same `h2`. */
    titleMuted?: string
    /** Supporting sentence — under the headline in `panel`, in the aside cell in `split`; overridden by the default slot. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** Layout of the band: `panel` sets the copy and its controls on one surface, `split` divides it into a raised lead cell and an aside that each floor their own control, `lead` is that lead cell standing alone with every control in it. */
    kind?: CallToActionKind
    /** Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame. */
    framed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    titleMuted: '',
    description: '',
    eyebrow: '',
    kind: 'panel',
    framed: false
  })

  const slots = defineSlots<{
    /** Description body; replaces the `description` prop when provided. */
    default?(): unknown
    /** The controls the band exists to offer; in `split`, the lead cell's primary control. */
    actions?(): unknown
    /** The aside cell's control in `split`; ignored in `panel` and `lead`, where every control belongs in `actions`. */
    aside?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-call-to-action'
  )

  const hasDescription = computed<boolean>(
    () => Boolean(slots.default) || props.description.length > 0
  )

  const frame = computed(() => (props.framed ? FrameBox : 'div'))
  const frameProps = computed(() =>
    props.framed ? { flush: true, borders: 'y', marks: 'bottom' } : {}
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :aria-label="title"
  >
    <component
      :is="frame"
      v-bind="frameProps"
    >
      <div
        v-if="kind === 'split'"
        class="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]"
      >
        <div
          class="flex flex-col justify-between gap-(--spacing-xxl) bg-(--bg-surface-raised) p-(--spacing-xl)"
        >
          <div class="flex flex-col gap-(--spacing-lg)">
            <Overline
              v-if="eyebrow"
              prefix="//"
              show-cursor
              >{{ eyebrow }}</Overline
            >
            <h2 class="m-0 text-balance text-heading-xl">
              <span class="block text-(--text-default)">{{ title }}</span>
              <span
                v-if="titleMuted"
                class="block text-(--text-muted)"
                >{{ titleMuted }}</span
              >
            </h2>
          </div>

          <div
            v-if="slots.actions"
            class="[&>*]:w-full md:[&>*]:w-fit"
          >
            <slot name="actions" />
          </div>
        </div>

        <div
          class="flex flex-col justify-between gap-(--spacing-xxl) border-t border-(--border-default) p-(--spacing-xl) lg:border-t-0 lg:border-l"
        >
          <p
            v-if="hasDescription"
            class="m-0 text-pretty text-heading-sm text-(--text-default)"
          >
            <slot>{{ description }}</slot>
          </p>

          <div
            v-if="slots.aside"
            class="[&>*]:w-full"
          >
            <slot name="aside" />
          </div>
        </div>
      </div>

      <div
        v-else-if="kind === 'lead'"
        class="flex flex-col gap-(--spacing-xl) bg-(--bg-surface-raised) p-(--spacing-xl)"
      >
        <div class="flex w-full max-w-(--container-2xl) flex-col gap-(--spacing-lg)">
          <Overline
            v-if="eyebrow"
            prefix="//"
            show-cursor
            >{{ eyebrow }}</Overline
          >
          <h2 class="m-0 text-balance text-heading-xl">
            <span class="block text-(--text-default)">{{ title }}</span>
            <span
              v-if="titleMuted"
              class="block text-(--text-muted)"
              >{{ titleMuted }}</span
            >
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
          class="flex flex-col items-stretch gap-(--spacing-sm) [&>*]:w-full md:flex-row md:items-center md:[&>*]:w-auto"
        >
          <slot name="actions" />
        </div>
      </div>

      <div
        v-else
        class="flex flex-col gap-(--spacing-xl) bg-(--bg-surface) p-(--spacing-xxl) md:flex-row md:items-center md:justify-between"
      >
        <SectionTitle
          :framed="false"
          kind="left"
          :title="title"
          :eyebrow="eyebrow"
          :description="description"
        >
          <template
            v-if="slots.default"
            #default
          >
            <slot />
          </template>
        </SectionTitle>

        <div
          v-if="slots.actions"
          class="flex w-full flex-col items-stretch gap-(--spacing-sm) [&>*]:w-full md:w-auto md:flex-row md:items-center md:[&>*]:w-auto"
        >
          <slot name="actions" />
        </div>
      </div>
    </component>
  </section>
</template>

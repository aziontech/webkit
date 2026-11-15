<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'
  import Tag, { type TagSeverity, type TagVariant } from '../tag/tag.vue'

  defineOptions({
    name: 'Card',
    inheritAttrs: false
  })

  /** Layout of the card. */
  export type CardVariant = 'default' | 'integration'

  /** Status colour of an integration badge; the `Tag` severity it renders. */
  export type CardBadgeSeverity = TagSeverity

  /** Brand look of an integration badge; the `Tag` variant it renders. */
  export type CardBadgeVariant = TagVariant

  export interface CardBadge {
    label: string
    variant?: CardBadgeVariant
    severity?: CardBadgeSeverity
  }

  interface Props {
    /** Heading rendered in the header when the `header` slot is empty; with `variant="integration"`, the item name. */
    title?: string
    /** Pads the content region. Set false for flush, edge-to-edge content such as an ItemList with full-width dividers. */
    padded?: boolean
    /** `integration` lays the card out as a catalog tile from `title`, `logo`, `vendor`, `description`, `badges`, `installed` and the `actions` slot. */
    variant?: CardVariant
    /** Integration variant: icon class for the logo mark. The `logo` slot takes an image instead. */
    logo?: string
    /** Integration variant: who publishes the item, shown as "by {vendor}". */
    vendor?: string
    /** Integration variant: one or two sentences on what the item does. */
    description?: string
    /** Integration variant: small tags such as the category or the context. */
    badges?: CardBadge[]
    /** Integration variant: shows the Installed tag. */
    installed?: boolean
    /** Integration variant: the title links here; without it the title is a button that emits `select`. */
    href?: string
    /** Integration variant: the featured layout, centred on a raised surface with a primary glow at the top and the badges in the top end corner. */
    featured?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    padded: true,
    variant: 'default',
    logo: '',
    vendor: '',
    description: '',
    badges: () => [],
    installed: false,
    href: '',
    featured: false
  })

  const emit = defineEmits<{
    /** Integration variant without `href`: the title (the whole tile) was activated. */
    select: [event: MouseEvent]
  }>()

  defineSlots<{
    /** Replaces the default header layout (title + header-actions). */
    header(): unknown
    /** Actions aligned to the end of the default header; visible on header hover. */
    'header-actions'(): unknown
    /** Main card body; with `variant="integration"` it renders under the description. */
    default(): unknown
    /** Footer actions or metadata; omitted when empty. */
    footer(): unknown
    /** Integration variant: replaces the logo mark, for an `img` with an empty `alt`. */
    logo(): unknown
    /** Integration variant: one action at the end of the tile, above the stretched title target. */
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const { t } = useTranslate({ card: en.card })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-card')

  const isIntegration = computed(() => props.variant === 'integration')
  const isFeatured = computed(() => isIntegration.value && props.featured)
  const hasHeaderSlot = () => Boolean(slots['header'])
  const hasHeaderActionsSlot = () => Boolean(slots['header-actions'])
  const hasFooterSlot = () => Boolean(slots['footer'])
  const hasContentSlot = () => Boolean(slots['default'])
  const hasActionsSlot = () => Boolean(slots['actions'])

  const showHeaderRegion = () =>
    hasHeaderSlot() ||
    hasHeaderActionsSlot() ||
    (!isIntegration.value && Boolean(props.title?.trim()))

  const showDefaultHeader = () => showHeaderRegion() && !hasHeaderSlot()

  const onSelect = (event: MouseEvent) => emit('select', event)
</script>

<template>
  <section
    v-bind="$attrs"
    :class="
      cn(
        'group/card flex flex-col overflow-clip bg-(--bg-surface) border border-(length:--border-width-default) border-(--border-default) rounded-(--shape-card) data-[variant=integration]:transition-colors data-[variant=integration]:not-data-[featured]:hover:bg-(--bg-hover) motion-reduce:transition-none data-[featured]:isolate data-[featured]:bg-(--bg-surface-raised) data-[featured]:hover:border-(--border-strong)',
        attrs.class as string | undefined
      )
    "
    :data-variant="variant"
    :data-featured="isFeatured || null"
    :data-testid="testId"
  >
    <header
      v-if="showHeaderRegion()"
      class="group flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
      :data-testid="`${testId}__header`"
    >
      <slot
        v-if="hasHeaderSlot()"
        name="header"
      />
      <template v-else-if="showDefaultHeader()">
        <h2
          v-if="title && !isIntegration"
          class="text-label-md text-(--text-default)"
          :data-testid="`${testId}__title`"
        >
          {{ title }}
        </h2>
        <div
          v-if="hasHeaderActionsSlot()"
          class="ms-auto opacity-0 transition-opacity motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"
          :data-testid="`${testId}__header-actions`"
        >
          <slot name="header-actions" />
        </div>
      </template>
    </header>

    <div
      class="@container/card relative flex min-h-0 flex-1 flex-col data-[padded]:p-(--spacing-md)"
      :data-padded="props.padded || null"
      :data-testid="`${testId}__content`"
    >
      <div
        v-if="isIntegration"
        class="flex min-w-0 flex-1 flex-col gap-(--spacing-md) group-data-[featured]/card:items-center group-data-[featured]/card:px-(--spacing-sm) group-data-[featured]/card:py-(--spacing-lg) group-data-[featured]/card:text-center"
      >
        <span
          v-if="isFeatured"
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 top-0 -z-1 h-24 bg-[radial-gradient(120%_90%_at_50%_0%,var(--primary),transparent_62%)] opacity-10 transition-opacity group-hover/card:opacity-20 motion-reduce:transition-none"
          :data-testid="`${testId}__glow`"
        />
        <div
          v-if="isFeatured && badges.length"
          class="pointer-events-none absolute end-(--spacing-md) top-(--spacing-md) flex flex-wrap justify-end gap-(--spacing-xs)"
          :data-testid="`${testId}__badges`"
        >
          <Tag
            v-for="badge in badges"
            :key="badge.label"
            :label="badge.label"
            :variant="badge.variant"
            :severity="badge.severity"
            size="small"
          />
        </div>
        <div
          class="flex min-w-0 items-start gap-(--spacing-md) group-data-[featured]/card:flex-col group-data-[featured]/card:items-center"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
            :data-testid="`${testId}__logo`"
          >
            <slot name="logo">
              <i
                :class="logo || 'ai ai-box'"
                class="text-body-lg leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </slot>
          </span>
          <div
            class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) group-data-[featured]/card:items-center"
          >
            <div
              class="flex flex-wrap items-baseline gap-x-(--spacing-xs) group-data-[featured]/card:flex-col group-data-[featured]/card:items-center group-data-[featured]/card:gap-y-(--spacing-2xs)"
            >
              <h3
                class="min-w-0 text-label-md text-(--text-default) group-data-[featured]/card:text-heading-xs"
                :data-testid="`${testId}__title`"
              >
                <a
                  v-if="href"
                  :href="href"
                  class="text-(--text-default) no-underline outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                  ><bdi>{{ title }}</bdi></a
                >
                <button
                  v-else
                  type="button"
                  class="cursor-pointer border-0 bg-transparent p-0 text-start text-(--text-default) group-data-[featured]/card:text-center outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                  @click="onSelect"
                >
                  <bdi>{{ title }}</bdi>
                </button>
              </h3>
              <bdi
                v-if="vendor"
                class="text-body-xs text-(--text-muted)"
                :data-testid="`${testId}__vendor`"
                >{{ t('card.byVendor', { vendor }) }}</bdi
              >
            </div>
            <p
              v-if="description"
              class="m-0 line-clamp-3 text-pretty text-body-sm text-(--text-muted)"
            >
              {{ description }}
            </p>
          </div>
        </div>
        <slot v-if="hasContentSlot()" />
        <div
          v-if="installed || (badges.length && !isFeatured) || hasActionsSlot()"
          class="mt-auto flex min-w-0 flex-wrap items-center gap-(--spacing-xs) group-data-[featured]/card:justify-center"
        >
          <Tag
            v-if="installed"
            :label="t('card.installed')"
            severity="success"
            size="small"
            icon="ai ai-check"
            :data-testid="`${testId}__installed`"
          />
          <template v-if="!isFeatured">
            <Tag
              v-for="badge in badges"
              :key="badge.label"
              :label="badge.label"
              :variant="badge.variant"
              :severity="badge.severity ?? (badge.variant ? undefined : 'info')"
              size="small"
            />
          </template>
          <div
            v-if="hasActionsSlot()"
            class="relative z-[1] ms-auto group-data-[featured]/card:ms-0"
            :data-testid="`${testId}__actions`"
          >
            <slot name="actions" />
          </div>
        </div>
      </div>
      <slot v-else-if="hasContentSlot()" />
    </div>

    <footer
      v-if="hasFooterSlot()"
      class="flex min-h-14 shrink-0 items-center justify-center gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
      :data-testid="`${testId}__footer`"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>

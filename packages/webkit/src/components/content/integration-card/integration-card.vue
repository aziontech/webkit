<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import { safeHref } from '../../../utils/safe-href'
  import Tag, { type TagSeverity, type TagVariant } from '../tag/tag.vue'

  defineOptions({
    name: 'IntegrationCard',
    inheritAttrs: false
  })

  /** Status colour of a badge; the `Tag` severity it renders. */
  export type IntegrationCardBadgeSeverity = TagSeverity

  /** Brand look of a badge; the `Tag` variant it renders. */
  export type IntegrationCardBadgeVariant = TagVariant

  export interface IntegrationCardBadge {
    label: string
    variant?: IntegrationCardBadgeVariant
    severity?: IntegrationCardBadgeSeverity
  }

  export interface IntegrationCardProps {
    /** The item name; the tile's single target. */
    title?: string
    /** Icon class for the logo mark. The `logo` slot takes an image instead. */
    logo?: string
    /** Who publishes the item, shown as "by {vendor}". */
    vendor?: string
    /** One or two sentences on what the item does. */
    description?: string
    /** Small tags such as the category or the context. */
    badges?: IntegrationCardBadge[]
    /** Shows the Installed tag. */
    installed?: boolean
    /** The title links here; without it the title is a button that emits `select`. */
    href?: string
    /** The featured layout, centred on a raised surface with a primary glow at the top and the badges in the top end corner. */
    featured?: boolean
  }

  const props = withDefaults(defineProps<IntegrationCardProps>(), {
    title: '',
    logo: '',
    vendor: '',
    description: '',
    badges: () => [],
    installed: false,
    href: '',
    featured: false
  })

  const emit = defineEmits<{
    /** Without `href`: the title (the whole tile) was activated. */
    select: [event: MouseEvent]
  }>()

  defineSlots<{
    /** Extra content under the description. */
    default(): unknown
    /** Replaces the logo mark, for an `img` with an empty `alt`. */
    logo(): unknown
    /** One action at the end of the tile, above the stretched title target. */
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const { t } = useTranslate({ integrationCard: en.integrationCard })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'integration-card')

  const hasContentSlot = () => Boolean(slots['default'])
  const hasActionsSlot = () => Boolean(slots['actions'])

  const onSelect = (event: MouseEvent) => emit('select', event)
</script>

<template>
  <section
    v-bind="$attrs"
    :class="
      cn(
        'group/card relative flex flex-col overflow-clip bg-(--bg-surface) border border-(length:--border-width-default) border-(--border-default) rounded-(--shape-card) p-(--spacing-md) transition-colors not-data-[featured]:hover:bg-(--bg-hover) motion-reduce:transition-none data-[featured]:isolate data-[featured]:bg-(--bg-surface-raised) data-[featured]:hover:border-(--border-strong)',
        attrs.class as string | undefined
      )
    "
    :data-featured="props.featured || null"
    :data-testid="testId"
  >
    <div
      class="flex min-w-0 flex-1 flex-col gap-(--spacing-md) group-data-[featured]/card:items-center group-data-[featured]/card:px-(--spacing-sm) group-data-[featured]/card:py-(--spacing-lg) group-data-[featured]/card:text-center"
    >
      <span
        v-if="featured"
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 -z-1 h-24 bg-[radial-gradient(120%_90%_at_50%_0%,var(--primary),transparent_62%)] opacity-10 transition-opacity group-hover/card:opacity-20 motion-reduce:transition-none"
        :data-testid="`${testId}__glow`"
      />
      <div
        v-if="featured && badges.length"
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
              :class="logo || 'az az-box'"
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
                v-if="safeHref(href)"
                :href="safeHref(href) ?? undefined"
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
              >{{ t('integrationCard.byVendor', { vendor }) }}</bdi
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
        v-if="installed || (badges.length && !featured) || hasActionsSlot()"
        class="mt-auto flex min-w-0 flex-wrap items-center gap-(--spacing-xs) group-data-[featured]/card:justify-center"
      >
        <Tag
          v-if="installed"
          :label="t('integrationCard.installed')"
          severity="success"
          size="small"
          icon="az az-check"
          :data-testid="`${testId}__installed`"
        />
        <template v-if="!featured">
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
  </section>
</template>

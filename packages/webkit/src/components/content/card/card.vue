<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'
  import Tag from '../tag/tag.vue'

  defineOptions({
    name: 'Card',
    inheritAttrs: false
  })

  export interface CardBadge {
    label: string
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'accent'
  }

  const props = withDefaults(
    defineProps<{
      /** Heading rendered in the header when the `header` slot is empty; with `kind="integration"`, the item name. */
      title?: string
      /** Pads the content region. Set false for flush, edge-to-edge content such as an ItemList with full-width dividers. */
      padded?: boolean
      /** `integration` lays the card out as a catalog tile from `title`, `logo`, `vendor`, `description`, `badges`, `installed` and the `action` slot. */
      kind?: 'default' | 'integration'
      /** Integration kind: icon class for the logo mark. The `logo` slot takes an image instead. */
      logo?: string
      /** Integration kind: who publishes the item, shown as "by {vendor}". */
      vendor?: string
      /** Integration kind: one or two sentences on what the item does. */
      description?: string
      /** Integration kind: small tags such as the category or the context. */
      badges?: CardBadge[]
      /** Integration kind: shows the Installed tag. */
      installed?: boolean
      /** Integration kind: the title links here; without it the title is a button that emits `select`. */
      href?: string
    }>(),
    {
      title: '',
      padded: true,
      kind: 'default',
      logo: '',
      vendor: '',
      description: '',
      badges: () => [],
      installed: false,
      href: ''
    }
  )

  const emit = defineEmits<{
    /** Integration kind without `href`: the title (the whole tile) was activated. */
    select: [event: MouseEvent]
  }>()

  defineSlots<{
    /** Replaces the default header layout (title + header-action). */
    header(): unknown
    /** Actions aligned to the end of the default header; visible on header hover. */
    'header-action'(): unknown
    /** Main card body; with `kind="integration"` it renders under the description. */
    content(): unknown
    /** Footer actions or metadata; omitted when empty. */
    footer(): unknown
    /** Integration kind: replaces the logo mark, for an `img` with an empty `alt`. */
    logo(): unknown
    /** Integration kind: one action at the end of the tile, above the stretched title target. */
    action(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const { t } = useTranslate({ card: en.card })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-card')

  const isIntegration = computed(() => props.kind === 'integration')
  const hasHeaderSlot = () => Boolean(slots['header'])
  const hasHeaderActionSlot = () => Boolean(slots['header-action'])
  const hasFooterSlot = () => Boolean(slots['footer'])
  const hasContentSlot = () => Boolean(slots['content'])
  const hasActionSlot = () => Boolean(slots['action'])

  const showHeaderRegion = () =>
    hasHeaderSlot() ||
    hasHeaderActionSlot() ||
    (!isIntegration.value && Boolean(props.title?.trim()))

  const showDefaultHeader = () => showHeaderRegion() && !hasHeaderSlot()

  const rootClasses = computed(() =>
    cn(
      'flex flex-col overflow-clip',
      'bg-(--bg-surface)',
      'border border-(length:--border-width-default) border-(--border-default)',
      'rounded-(--shape-card)',
      'data-[kind=integration]:transition-colors data-[kind=integration]:hover:bg-(--bg-hover) motion-reduce:transition-none',
      attrs.class as string | undefined
    )
  )

  const headerClasses =
    'group flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)'

  const titleClasses = 'text-label-md text-(--text-default)'

  const contentClasses =
    '@container/card relative flex min-h-0 flex-1 flex-col data-[padded]:p-(--spacing-md)'

  const footerClasses =
    'flex min-h-14 shrink-0 items-center justify-center gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm)'

  const onSelect = (event: MouseEvent) => emit('select', event)
</script>

<template>
  <section
    v-bind="$attrs"
    :class="rootClasses"
    :data-kind="kind"
    :data-testid="testId"
  >
    <header
      v-if="showHeaderRegion()"
      :class="headerClasses"
      :data-testid="`${testId}__header`"
    >
      <slot
        v-if="hasHeaderSlot()"
        name="header"
      />
      <template v-else-if="showDefaultHeader()">
        <h2
          v-if="title && !isIntegration"
          :class="titleClasses"
          :data-testid="`${testId}__title`"
        >
          {{ title }}
        </h2>
        <div
          v-if="hasHeaderActionSlot()"
          class="ms-auto opacity-0 transition-opacity motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"
          :data-testid="`${testId}__header-action`"
        >
          <slot name="header-action" />
        </div>
      </template>
    </header>

    <div
      :class="contentClasses"
      :data-padded="props.padded || null"
      :data-testid="`${testId}__content`"
    >
      <div
        v-if="isIntegration"
        class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)"
      >
        <div class="flex min-w-0 items-start gap-(--spacing-md)">
          <span
            class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
            :data-testid="`${testId}__logo`"
          >
            <slot name="logo">
              <i
                :class="logo || 'pi pi-box'"
                class="text-body-lg leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </slot>
          </span>
          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
            <div class="flex flex-wrap items-baseline gap-x-(--spacing-xs)">
              <h3
                class="min-w-0 text-label-md text-(--text-default)"
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
                  class="cursor-pointer border-0 bg-transparent p-0 text-start text-(--text-default) outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
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
        <slot
          v-if="hasContentSlot()"
          name="content"
        />
        <div
          v-if="installed || badges.length || hasActionSlot()"
          class="mt-auto flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
        >
          <Tag
            v-if="installed"
            :label="t('card.installed')"
            severity="success"
            size="small"
            icon="pi pi-check"
            :data-testid="`${testId}__installed`"
          />
          <Tag
            v-for="badge in badges"
            :key="badge.label"
            :label="badge.label"
            :severity="badge.severity ?? 'info'"
            size="small"
          />
          <div
            v-if="hasActionSlot()"
            class="relative z-[1] ms-auto"
            :data-testid="`${testId}__action`"
          >
            <slot name="action" />
          </div>
        </div>
      </div>
      <slot
        v-else-if="hasContentSlot()"
        name="content"
      />
    </div>

    <footer
      v-if="hasFooterSlot()"
      :class="footerClasses"
      :data-testid="`${testId}__footer`"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import RegistrationFrame from '../registration-frame/registration-frame.vue'
  import { FooterInjectionKey } from './injection-key'

  defineOptions({
    name: 'Footer',
    inheritAttrs: false
  })

  /** Where the footer sits. */
  export type FooterVariant = 'content' | 'site' | 'console'

  export interface FooterProps {
    /** Accessible name for the contentinfo landmark. Empty uses the locale catalog (`Footer`). */
    ariaLabel?: string
    /**
     * Where the footer sits: `content` (the default) runs the bands full bleed across the zone
     * that holds it; `site` spans the page like the site header, opening on a plain full-width
     * rule, like the header's, and insetting its content to the header measure; `console` is one
     * slim bar under a console page, the brand and the links of each column on one line with the
     * status and language at its end.
     */
    variant?: FooterVariant
    /** When set, the brand slot renders inside one home link to this URL, with the focus ring and the hover of a link. */
    homeHref?: string
    /** Accessible name of the home link. Empty uses the locale catalog (`Azion home`). */
    homeAriaLabel?: string
  }

  const props = withDefaults(defineProps<FooterProps>(), {
    ariaLabel: '',
    variant: 'content',
    homeHref: '',
    homeAriaLabel: ''
  })

  const slots = defineSlots<{
    /** The Footer.Column items; a 2-column grid that becomes 4 columns at md, or one inline row in the console variant. */
    default(): unknown
    /** The social icon buttons, after the brand at the start of the bottom bar. */
    social(): unknown
    /** The system status indicator, at the end of the bottom bar. */
    status(): unknown
    /** The language select, after the status. */
    language(): unknown
    /** The brand lockup that opens the bottom bar. */
    brand(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ footer: en.footer })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'footer')

  const hasColumns = () => Boolean(slots.default)

  const hasStart = () => Boolean(slots.brand || slots.social)

  const hasEnd = () => Boolean(slots.status || slots.language)

  const homeLink = computed(() => safeHref(props.homeHref))

  provide(FooterInjectionKey, {
    testId: testId.value
  })

  const HOME_LINK_CLASS =
    'relative z-1 inline-flex w-fit items-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance ' +
    'hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-(--bg-canvas)'

  const BANDS_CLASS =
    'flex w-full flex-col ' +
    'group-data-[variant=console]/footer:flex-row group-data-[variant=console]/footer:flex-wrap group-data-[variant=console]/footer:items-center ' +
    'group-data-[variant=console]/footer:gap-x-(--spacing-lg) group-data-[variant=console]/footer:gap-y-(--spacing-sm) group-data-[variant=console]/footer:px-(--spacing-lg) ' +
    'group-data-[variant=console]/footer:py-(--spacing-sm)'

  const COLUMNS_CLASS =
    'order-2 grid w-full grid-cols-2 gap-y-(--spacing-lg) px-(--footer-inset) ' +
    'md:grid-cols-4 md:gap-y-0 ' +
    'group-data-[variant=console]/footer:flex group-data-[variant=console]/footer:w-auto group-data-[variant=console]/footer:min-w-0 group-data-[variant=console]/footer:flex-wrap ' +
    'group-data-[variant=console]/footer:items-center group-data-[variant=console]/footer:gap-x-(--spacing-lg) group-data-[variant=console]/footer:gap-y-(--spacing-xs) ' +
    'group-data-[variant=console]/footer:md:gap-y-(--spacing-xs)'

  const BAR_CLASS =
    'order-3 flex flex-col gap-y-(--spacing-md) border-0 border-t border-t-(length:--border-width-default) border-t-(--border-default) ' +
    'px-[calc(var(--footer-inset,0%)_+_var(--spacing-lg))] py-(--spacing-md) ' +
    'first:border-t-0 md:min-h-14 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-(--spacing-lg) md:py-(--spacing-sm) ' +
    'group-data-[variant=console]/footer:contents'
</script>

<template>
  <footer
    v-bind="$attrs"
    :aria-label="ariaLabel || t('footer.label')"
    :data-testid="testId"
    :data-variant="variant"
    class="group/footer flex w-full flex-col bg-(--bg-canvas) data-[variant=site]:[--footer-inset:max(0%,calc((100%_-_var(--layout-measure-site-header))_/_2))]"
  >
    <RegistrationFrame
      :borders="variant === 'content' ? 'none' : 'top'"
      marks="none"
      :data-testid="`${testId}__frame`"
      class="w-full"
    >
      <div :class="BANDS_CLASS">
        <div
          v-if="hasColumns()"
          :data-testid="`${testId}__columns`"
          :class="COLUMNS_CLASS"
        >
          <slot />
        </div>

        <div
          v-if="hasStart() || hasEnd()"
          :data-testid="`${testId}__bar`"
          :class="BAR_CLASS"
        >
          <div
            v-if="hasStart()"
            :data-testid="`${testId}__social`"
            class="order-1 flex min-w-0 flex-wrap items-center gap-(--spacing-2xs)"
          >
            <div
              v-if="slots.brand"
              :data-testid="`${testId}__brand`"
              class="me-(--spacing-xs) flex shrink-0 items-center *:flex *:items-center [&_svg]:block [&_svg]:h-[18px] [&_svg]:w-auto"
            >
              <a
                v-if="homeLink"
                :href="homeLink"
                :aria-label="homeAriaLabel || t('footer.home')"
                :data-testid="`${testId}__home`"
                :class="HOME_LINK_CLASS"
              >
                <slot name="brand" />
                <span
                  aria-hidden="true"
                  data-slot="touch-target"
                  class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
                />
              </a>
              <slot
                v-else
                name="brand"
              />
            </div>
            <slot name="social" />
          </div>

          <div
            v-if="hasEnd()"
            :data-testid="`${testId}__status`"
            class="order-3 flex min-w-0 flex-wrap items-center justify-between gap-x-(--spacing-lg) gap-y-(--spacing-xs) md:ms-auto md:justify-end group-data-[variant=console]/footer:ms-auto"
          >
            <slot name="status" />
            <slot name="language" />
          </div>
        </div>
      </div>
    </RegistrationFrame>
  </footer>
</template>

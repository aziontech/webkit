<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Brand from '../../content/brand/brand.vue'
  import StatusIndicator from '../../feedback/status-indicator/status-indicator.vue'
  import Select from '../../input/select/select.vue'
  import SelectContent from '../../input/select/select-content/select-content.vue'
  import SelectItem from '../../input/select/select-item/select-item.vue'
  import SelectTrigger from '../../input/select/select-trigger/select-trigger.vue'
  import Footer from '../../layout/footer/footer.vue'
  import FooterColumn from '../../layout/footer/footer-column/footer-column.vue'
  import FooterLink from '../../layout/footer/footer-link/footer-link.vue'

  defineOptions({
    name: 'SiteFooterSection',
    inheritAttrs: false
  })

  /** Where the footer sits. */
  export type SiteFooterSectionVariant = 'content' | 'site'

  /** One link of a footer column. */
  export type SiteFooterSectionLink = {
    /** Visible label of the link. */
    label: string
    /** Destination the link points to. */
    href: string
    /** Where the link opens; `_blank` opens it in a new tab and closes its label on the external-link glyph. */
    target?: '_blank' | '_self'
  }

  /** One titled column of footer links. */
  export type SiteFooterSectionColumn = {
    /** Heading of the column. */
    title: string
    /** The links of the column, in order. */
    links: SiteFooterSectionLink[]
  }

  /** One profile icon button of the social row. */
  export type SiteFooterSectionSocial = {
    /** Icon class of the network glyph. */
    icon: string
    /** Accessible name of the button, naming the network. */
    label: string
    /** URL of the profile. */
    href: string
  }

  export interface SiteFooterSectionProps {
    /** Where the footer sits: `site` closes a framed marketing page and draws its frame, `content` runs the bands full bleed. */
    variant?: SiteFooterSectionVariant
    /** Accessible name of the footer landmark. Empty uses the locale catalog (`Footer`). */
    ariaLabel?: string
    /** Destination of the Azion mark; the mark is not rendered when empty. */
    home?: string
    /** Accessible name of the Azion mark link. Empty uses the locale catalog (`Azion home`). */
    homeAriaLabel?: string
    /** The link columns, in order; each is `{ title, links }` where every link is `{ label, href, target? }`; a `_blank` link opens in a new tab and closes on the external-link glyph. */
    columns?: SiteFooterSectionColumn[]
    /** The profile icon buttons, in order; each is `{ icon, label, href }` where `label` names the button for assistive tech. They open in a new tab. */
    socials?: SiteFooterSectionSocial[]
    /** Line of the system status indicator; the indicator is not rendered when empty. */
    statusLabel?: string
    /** Options of the language select, as the reader sees them; the first one is selected until `v-model:language` holds another. The select is not rendered when empty. */
    languages?: string[]
    /** Accessible name of the language select, also its placeholder. Empty uses the locale catalog (`Language`). */
    languageAriaLabel?: string
  }

  const props = withDefaults(defineProps<SiteFooterSectionProps>(), {
    variant: 'site',
    ariaLabel: '',
    home: '',
    homeAriaLabel: '',
    columns: () => [],
    socials: () => [],
    statusLabel: '',
    languages: () => [],
    languageAriaLabel: ''
  })

  /** The chosen option of the language select; empty shows the first option. Use with `v-model:language`. */
  const language = defineModel<string>('language', { default: '' })

  const attrs = useAttrs()
  const { t } = useTranslate({ siteFooterSection: en.siteFooterSection, common: en.common })

  const selectedLanguage = computed({
    get: () => language.value || props.languages[0] || '',
    set: (value: string) => {
      language.value = value
    }
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'site-footer-section'
  )

  const hasHome = computed(() => props.home.length > 0)
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    class="w-full data-[variant=content]:border-t data-[variant=content]:border-(--border-default)"
  >
    <Footer
      :variant="variant"
      :aria-label="ariaLabel || t('siteFooterSection.label')"
    >
      <FooterColumn
        v-for="column in columns"
        :key="column.title"
        :title="column.title"
      >
        <FooterLink
          v-for="link in column.links"
          :key="link.label"
          :href="link.href"
          :target="link.target"
          :rel="link.target === '_blank' ? 'noopener noreferrer' : undefined"
          :data-external="link.target === '_blank' || null"
        >
          {{ link.label }}
          <template v-if="link.target === '_blank'">
            <i
              class="az az-external-link shrink-0 text-body-xs leading-none"
              aria-hidden="true"
            />
            <span class="sr-only">{{ ` ${t('common.newTab')}` }}</span>
          </template>
        </FooterLink>
      </FooterColumn>

      <template
        v-if="hasHome"
        #brand
      >
        <a
          :href="safeHref(home) ?? undefined"
          :aria-label="homeAriaLabel || t('siteFooterSection.home')"
          class="inline-flex w-fit items-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
        >
          <Brand size="small" />
        </a>
      </template>

      <template
        v-if="socials.length > 0"
        #social
      >
        <IconButton
          v-for="social in socials"
          :key="social.label"
          variant="ghost"
          size="small"
          :icon="social.icon"
          :ariaLabel="social.label"
          :href="social.href"
          target="_blank"
        />
      </template>

      <template
        v-if="statusLabel"
        #status
      >
        <StatusIndicator
          severity="success"
          :label="statusLabel"
        />
      </template>

      <template
        v-if="languages.length > 0"
        #language
      >
        <div class="w-28">
          <Select
            v-model="selectedLanguage"
            :placeholder="languageAriaLabel || t('siteFooterSection.language')"
          >
            <SelectTrigger :aria-label="languageAriaLabel || t('siteFooterSection.language')">
              <template #leading>
                <i
                  class="az az-globe text-(--text-muted)"
                  aria-hidden="true"
                />
              </template>
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in languages"
                :key="option"
                :value="option"
              >
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </template>
    </Footer>
  </div>
</template>

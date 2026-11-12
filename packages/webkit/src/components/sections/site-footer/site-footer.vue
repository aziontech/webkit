<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Brand from '../../content/brand/brand.vue'
  import StatusIndicator from '../../feedback/status-indicator/status-indicator.vue'
  import Select from '../../inputs/select/select.vue'
  import SelectContent from '../../inputs/select/select-content/select-content.vue'
  import SelectOption from '../../inputs/select/select-option/select-option.vue'
  import SelectTrigger from '../../inputs/select/select-trigger/select-trigger.vue'
  import Footer from '../../layout/footer/footer.vue'
  import FooterColumn from '../../layout/footer/footer-column/footer-column.vue'
  import FooterLink from '../../layout/footer/footer-link/footer-link.vue'

  defineOptions({
    name: 'SiteFooter',
    inheritAttrs: false
  })

  /** Where the footer sits. */
  export type SiteFooterKind = 'content' | 'site'

  /** One link of a footer column. */
  export type SiteFooterLink = {
    /** Visible label of the link. */
    label: string
    /** Destination the link points to. */
    href: string
    /** Opens the link in a new tab and closes its label on the external-link glyph. */
    external?: boolean
  }

  /** One titled column of footer links. */
  export type SiteFooterColumn = {
    /** Heading of the column. */
    title: string
    /** The links of the column, in order. */
    links: SiteFooterLink[]
  }

  /** One profile icon button of the social row. */
  export type SiteFooterSocial = {
    /** Icon class of the network glyph. */
    icon: string
    /** Accessible name of the button, naming the network. */
    label: string
    /** URL of the profile. */
    href: string
  }

  interface Props {
    /** Where the footer sits: `site` closes a framed marketing page and draws its frame, `content` runs the bands full bleed. */
    kind?: SiteFooterKind
    /** Accessible name of the footer landmark. Empty uses the locale catalog (`Footer`). */
    ariaLabel?: string
    /** Destination of the Azion mark; the mark is not rendered when empty. */
    home?: string
    /** Accessible name of the Azion mark link. Empty uses the locale catalog (`Azion home`). */
    homeAriaLabel?: string
    /** The link columns, in order; each is `{ title, links }` where every link is `{ label, href, external? }`; an `external` link opens in a new tab and closes on the external-link glyph. */
    columns?: SiteFooterColumn[]
    /** The profile icon buttons, in order; each is `{ icon, label, href }` where `label` names the button for assistive tech. They open in a new tab. */
    socials?: SiteFooterSocial[]
    /** Line of the system status indicator; the indicator is not rendered when empty. */
    statusLabel?: string
    /** Options of the language select, as the reader sees them; the first one is selected. The select is not rendered when empty. */
    languages?: string[]
    /** Accessible name of the language select, also its placeholder. Empty uses the locale catalog (`Language`). */
    languageAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'site',
    ariaLabel: '',
    home: '',
    homeAriaLabel: '',
    columns: () => [],
    socials: () => [],
    statusLabel: '',
    languages: () => [],
    languageAriaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ siteFooter: en.siteFooter })

  const language = ref<string>(props.languages[0] ?? '')

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-site-footer'
  )

  const hasHome = computed(() => props.home.length > 0)
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    class="w-full border-t border-(--border-default)"
  >
    <Footer
      :kind="kind"
      :aria-label="ariaLabel || t('siteFooter.label')"
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
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
          :data-external="link.external || null"
        >
          {{ link.label }}
          <template v-if="link.external">
            <i
              class="pi pi-external-link text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="sr-only">{{ ` ${t('siteFooter.newTab')}` }}</span>
          </template>
        </FooterLink>
      </FooterColumn>

      <template #social>
        <a
          v-if="hasHome"
          :href="home"
          :aria-label="homeAriaLabel || t('siteFooter.home')"
          class="me-(--spacing-xs) hidden w-fit md:inline-flex items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
        >
          <Brand size="small" />
        </a>
        <IconButton
          v-for="social in socials"
          :key="social.label"
          kind="transparent"
          :icon="social.icon"
          :ariaLabel="social.label"
          :href="social.href"
          target="_blank"
        />
      </template>

      <template
        v-if="statusLabel || languages.length > 0"
        #status
      >
        <div
          :data-testid="`${testId}__bar`"
          class="flex w-full flex-col items-start gap-(--spacing-md) md:w-auto md:flex-row md:items-center md:gap-(--spacing-lg)"
        >
          <StatusIndicator
            v-if="statusLabel"
            severity="success"
            :label="statusLabel"
          />
          <div
            v-if="languages.length > 0"
            class="w-28"
          >
            <Select
              v-model="language"
              :placeholder="languageAriaLabel || t('siteFooter.language')"
            >
              <SelectTrigger :aria-label="languageAriaLabel || t('siteFooter.language')">
                <template #iconLeft>
                  <i
                    class="pi pi-globe text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
              </SelectTrigger>
              <SelectContent>
                <SelectOption
                  v-for="option in languages"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </SelectOption>
              </SelectContent>
            </Select>
          </div>
        </div>
      </template>
    </Footer>
  </div>
</template>

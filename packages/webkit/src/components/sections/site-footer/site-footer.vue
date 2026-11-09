<script setup lang="ts">
  import { useMediaQuery } from '@vueuse/core'
  import { computed, ref, useAttrs } from 'vue'

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
    /** Accessible name of the footer landmark. */
    ariaLabel?: string
    /** Destination of the Azion mark; the mark is not rendered when empty. */
    home?: string
    /** Accessible name of the Azion mark link. */
    homeAriaLabel?: string
    /** The link columns, in order; each is `{ title, links }` where every link is `{ label, href }`. */
    columns?: SiteFooterColumn[]
    /** The profile icon buttons, in order; each is `{ icon, label, href }` where `label` names the button for assistive tech. They open in a new tab. */
    socials?: SiteFooterSocial[]
    /** Line of the system status indicator; the indicator is not rendered when empty. */
    statusLabel?: string
    /** Options of the language select, as the reader sees them; the first one is selected. The select is not rendered when empty. */
    languages?: string[]
    /** Accessible name of the language select, also its placeholder. */
    languageAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'site',
    ariaLabel: 'Footer',
    home: '',
    homeAriaLabel: 'Azion home',
    columns: () => [],
    socials: () => [],
    statusLabel: '',
    languages: () => [],
    languageAriaLabel: 'Language'
  })

  const attrs = useAttrs()

  const wide = useMediaQuery('(min-width: 1024px)')

  const language = ref<string>(props.languages[0] ?? '')

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-site-footer'
  )

  const hasHome = computed(() => props.home.length > 0)

  const brandLeadsSocialRow = computed(() => hasHome.value && wide.value)

  const brandInSignature = computed(() => hasHome.value && !wide.value)
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
      :aria-label="ariaLabel"
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
        >
          {{ link.label }}
        </FooterLink>
      </FooterColumn>

      <template #social>
        <a
          v-if="brandLeadsSocialRow"
          :href="home"
          :aria-label="homeAriaLabel"
          class="mr-(--spacing-xs) inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
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
            v-model="language"
            :placeholder="languageAriaLabel"
          >
            <SelectTrigger :aria-label="languageAriaLabel">
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
      </template>

      <template
        v-if="brandInSignature"
        #brand
      >
        <a
          :href="home"
          :aria-label="homeAriaLabel"
          class="mx-auto inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
        >
          <Brand size="small" />
        </a>
      </template>
    </Footer>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { useAppNavigation } from '../../../composables/use-app-navigation'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Command from '../../overlay/command/command.vue'
  import CommandEmpty from '../../overlay/command/command-empty/command-empty.vue'
  import CommandGroup from '../../overlay/command/command-group/command-group.vue'
  import CommandInput from '../../overlay/command/command-input/command-input.vue'
  import CommandItem from '../../overlay/command/command-item/command-item.vue'
  import CommandList from '../../overlay/command/command-list/command-list.vue'
  import SiteFooter, {
    type SiteFooterColumn,
    type SiteFooterKind,
    type SiteFooterSocial
  } from '../../sections/site-footer/site-footer.vue'
  import SiteNav, { type SiteNavLink, type SiteNavMenu } from '../../sections/site-nav/site-nav.vue'

  defineOptions({
    name: 'SiteLayout',
    inheritAttrs: false
  })

  /** The site bar, bound onto `SiteNav`. */
  export type SiteLayoutNavigation = {
    /** The mega-menus, in bar order. */
    menus: SiteNavMenu[]
    /** Where the Azion mark links. */
    home?: string
    /** Bar entries that open no panel. */
    links?: SiteNavLink[]
    /** The contact link. */
    contact?: SiteNavLink
    /** The sign-up button. */
    primaryAction?: SiteNavLink
    /** The login button. */
    secondaryAction?: SiteNavLink
    /** Keeps the login button in the bar on phones too. */
    secondaryActionOnPhones?: boolean
  }

  /** The site footer, bound onto `SiteFooter`. */
  export type SiteLayoutFooter = {
    /** `site` closes a framed page and draws its frame; `content` runs full bleed. */
    kind?: SiteFooterKind
    /** Accessible name of the footer landmark. */
    ariaLabel?: string
    /** Destination of the Azion mark. */
    home?: string
    /** Accessible name of the Azion mark link. */
    homeAriaLabel?: string
    /** The link columns, in order. */
    columns?: SiteFooterColumn[]
    /** The profile icon buttons, in order. */
    socials?: SiteFooterSocial[]
    /** Line of the system status indicator. */
    statusLabel?: string
    /** Options of the language select. */
    languages?: string[]
    /** Accessible name of the language select. */
    languageAriaLabel?: string
  }

  /** A destination of the site navigation, as listed in the search palette. */
  export type SiteLayoutPage = {
    /** Visible text. */
    label: string
    /** Where it leads. */
    href: string
  }

  interface Props {
    /** The bar, bound onto `SiteNav`. */
    navigation: SiteLayoutNavigation
    /** The footer, bound onto `SiteFooter`; `kind` defaults to `site`. No footer when absent. */
    footer?: SiteLayoutFooter
    /** Placeholder of the palette's input. Empty uses the locale catalog (`Search the site`). */
    searchPlaceholder?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    footer: undefined,
    searchPlaceholder: ''
  })

  const emit = defineEmits<{
    /** A navigation destination was chosen in the palette; the layout then follows it. */
    navigate: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, page: SiteLayoutPage]
    /** A palette item from the `search` slot was chosen. */
    'search-select': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: string | number
    ]
  }>()

  /** Whether the search palette is open. Use with `v-model:search-open`. */
  const searchOpen = defineModel<boolean>('searchOpen', { default: false })

  defineSlots<{
    /** The page's sections, rendered inside the layout's main landmark. */
    default(): unknown
    /** Extra palette groups listed before the navigation destinations. */
    search(props: { query: string }): unknown
  }>()

  const { follow } = useAppNavigation()

  const attrs = useAttrs()
  const { t } = useTranslate({ siteLayout: en.siteLayout })

  const query = ref('')

  const PAGE_VALUE = 'site-layout:page:'

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-site-layout'
  )

  const paletteGroups = computed(() => {
    const groups = props.navigation.menus.map((menu) => ({
      key: menu.value,
      heading: menu.label,
      pages: menu.columns
        .flat()
        .flatMap((group) => group.items)
        .filter((item): item is typeof item & { href: string } => Boolean(item.href))
        .map((item) => ({ label: item.label, href: item.href }))
    }))
    const links = [
      ...(props.navigation.links ?? []),
      ...(props.navigation.contact ? [props.navigation.contact] : [])
    ]
    if (links.length) {
      groups.push({
        key: 'site-layout-links',
        heading: '',
        pages: links.map((link) => ({ label: link.label, href: link.href }))
      })
    }
    return groups
      .filter((group) => group.pages.length)
      .map((group) => ({
        ...group,
        pages: group.pages.map((page, index) => ({
          ...page,
          value: `${PAGE_VALUE}${group.key}:${index}`
        }))
      }))
  })

  const pageByValue = computed(
    () =>
      new Map(
        paletteGroups.value.flatMap((group) =>
          group.pages.map((page) => [page.value, { label: page.label, href: page.href }] as const)
        )
      )
  )

  watch(searchOpen, () => {
    query.value = ''
  })

  const openSearch = () => {
    searchOpen.value = true
  }

  const onQuery = (value: unknown) => {
    query.value = typeof value === 'string' ? value : ''
  }

  const onPaletteSelect = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    value: string | number
  ) => {
    const page = pageByValue.value.get(String(value))
    if (!page) {
      emit('search-select', event, value)
      return
    }
    emit('navigate', event, page)
    follow(event, page)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-h-dvh w-full min-w-0 flex-col bg-(--bg-canvas) text-(--text-default)"
  >
    <SiteNav
      v-bind="navigation"
      :data-testid="`${testId}__nav`"
      @search="openSearch"
    />
    <main
      :data-testid="`${testId}__main`"
      class="flex min-w-0 flex-1 flex-col"
    >
      <slot />
    </main>
    <SiteFooter
      v-if="footer"
      kind="site"
      v-bind="footer"
      :data-testid="`${testId}__footer`"
    />

    <Command
      v-model:open="searchOpen"
      @select="onPaletteSelect"
    >
      <CommandInput
        :placeholder="searchPlaceholder || t('siteLayout.searchPlaceholder')"
        @update:model-value="onQuery"
      />
      <CommandList>
        <slot
          name="search"
          :query="query"
        />
        <CommandGroup
          v-for="group in paletteGroups"
          :key="group.key"
          :heading="group.heading || t('siteLayout.pages')"
        >
          <CommandItem
            v-for="page in group.pages"
            :key="page.value"
            :value="page.value"
          >
            {{ page.label }}
          </CommandItem>
        </CommandGroup>
        <CommandEmpty>{{ t('siteLayout.searchEmpty') }}</CommandEmpty>
      </CommandList>
    </Command>
  </div>
</template>

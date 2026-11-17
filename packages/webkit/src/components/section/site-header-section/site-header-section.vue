<script setup lang="ts">
  import { useMediaQuery } from '@vueuse/core'
  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    onMounted,
    onScopeDispose,
    ref,
    useAttrs,
    watch
  } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import SearchTrigger from '../../action/search-trigger/search-trigger.vue'
  import Brand from '../../content/brand/brand.vue'
  import AppHeader from '../../layout/app-header/app-header.vue'
  import AppHeaderBrand from '../../layout/app-header/app-header-brand.vue'
  import AppHeaderCenter from '../../layout/app-header/app-header-center.vue'
  import AppHeaderEnd from '../../layout/app-header/app-header-end.vue'
  import AppHeaderStart from '../../layout/app-header/app-header-start.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import NavigationMenu from '../../navigation/navigation-menu/navigation-menu.vue'
  import NavigationMenuContent from '../../navigation/navigation-menu/navigation-menu-content.vue'
  import NavigationMenuItem from '../../navigation/navigation-menu/navigation-menu-item.vue'
  import NavigationMenuList from '../../navigation/navigation-menu/navigation-menu-list.vue'
  import NavigationMenuTrigger from '../../navigation/navigation-menu/navigation-menu-trigger.vue'
  import NavigationMenuViewport from '../../navigation/navigation-menu/navigation-menu-viewport.vue'
  import type {
    SidebarMenuGroupNode,
    SidebarMenuNode
  } from '../../navigation/sidebar-menu/injection-key'
  import SidebarMenu from '../../navigation/sidebar-menu/sidebar-menu.vue'
  import SidebarMenuBack from '../../navigation/sidebar-menu/sidebar-menu-back/sidebar-menu-back.vue'
  import Drawer from '../../overlay/drawer/drawer.vue'
  import DrawerContent from '../../overlay/drawer/drawer-content.vue'
  import DrawerTitle from '../../overlay/drawer/drawer-title.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'

  defineOptions({
    name: 'SiteHeaderSection',
    inheritAttrs: false
  })

  /** A link in the bar, the sheet or a panel. */
  export type SiteHeaderSectionLink = {
    /** Visible label of the link. */
    label: string
    /** Destination of the link. */
    href: string
  }

  /** One entry of a mega-menu panel. */
  export type SiteHeaderSectionItem = {
    /** Visible label of the entry. */
    label: string
    /** One line under the label. */
    description?: string
    /** Destination of the entry; an entry without it links to `#`. */
    href?: string
    /** Icon class drawn before the label. */
    icon?: string
  }

  /** A labelled group of entries inside a panel column. */
  export type SiteHeaderSectionGroup = {
    /** Header of the group. */
    label: string
    /** Destination the header links to; a plain header without it. */
    href?: string
    /** The entries of the group, in order. */
    items: SiteHeaderSectionItem[]
  }

  /** One mega-menu of the bar. */
  export type SiteHeaderSectionMenu = {
    /** Stable id of the menu. */
    value: string
    /** Label of the menu's trigger. */
    label: string
    /** The panel's columns, each holding one or more groups. */
    columns: SiteHeaderSectionGroup[][]
  }

  export interface SiteHeaderSectionProps {
    /** Where the Azion mark links. */
    home?: string
    /** The mega-menus, in bar order; each is `{ value, label, columns }` where `columns` is an array of columns, each holding groups of `{ label, href?, items }` and each item `{ label, description?, href?, icon? }`. */
    menus: SiteHeaderSectionMenu[]
    /** Bar entries that open no panel, after the menus; each is `{ label, href }`. */
    links?: SiteHeaderSectionLink[]
    /** Contact link set in the bar from `xl` up and last in the sheet's tree; `{ label, href }`. */
    contact?: SiteHeaderSectionLink
    /** The sign-up button, filled, in the bar and in the sheet footer; `{ label, href }`. */
    primaryAction?: SiteHeaderSectionLink
    /** The login button beside it, in the bar from `sm` up and in the sheet footer; `{ label, href }`. */
    secondaryAction?: SiteHeaderSectionLink
    /** Keeps the login button in the bar below `sm` too; off, it steps out on phones, as on azion.com, and stays in the sheet footer. */
    secondaryActionOnPhones?: boolean
  }

  const props = withDefaults(defineProps<SiteHeaderSectionProps>(), {
    home: '/',
    links: () => [],
    contact: undefined,
    primaryAction: undefined,
    secondaryAction: undefined,
    secondaryActionOnPhones: false
  })

  const emit = defineEmits<{
    /** The search trigger was clicked or ⌘K / Ctrl K was pressed; open the page's Command palette from it. */
    search: [event: MouseEvent | KeyboardEvent]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ siteHeaderSection: en.siteHeaderSection })

  const navOpen = ref(false)
  const navPath = ref<string[]>([])
  const barEl = ref<ComponentPublicInstance | null>(null)
  const openerEl = ref<ComponentPublicInstance | null>(null)
  const columnInset = ref(0)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'site-header-section'
  )

  const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const navGroups = computed<SidebarMenuGroupNode[]>(() => {
    const menuNodes: SidebarMenuNode[] = props.menus.map((menu) => {
      const groups = menu.columns.flat()
      return {
        id: menu.value,
        label: menu.label,
        type: 'drill',
        groups: groups.map((group) => ({
          label: groups.length > 1 ? group.label : undefined,
          items: group.items.map((item) => ({
            id: [menu.value, slug(item.label)].join('-'),
            label: item.label,
            href: item.href ?? '#'
          }))
        }))
      }
    })
    const linkNodes: SidebarMenuNode[] = props.links.map((link) => ({
      id: slug(link.label),
      label: link.label,
      href: link.href
    }))
    const contactNodes: SidebarMenuNode[] = props.contact
      ? [{ id: 'contact', label: props.contact.label, href: props.contact.href }]
      : []
    return [{ items: [...menuNodes, ...linkNodes, ...contactNodes] }]
  })

  watch(navOpen, async (open) => {
    if (open) return
    navPath.value = []
    await nextTick()
    const button = openerEl.value?.$el as globalThis.HTMLElement | null | undefined
    button?.focus()
  })

  const barQuery = useMediaQuery('(min-width: 80rem)')

  watch(barQuery, (wide) => {
    if (wide) navOpen.value = false
  })

  const onNavigate = (_event: globalThis.MouseEvent, node: SidebarMenuNode) => {
    if (!node.groups) navOpen.value = false
  }

  const readColumnInset = () => {
    const node = barEl.value?.$el as
      globalThis.Element | globalThis.CharacterData | null | undefined
    const el = node instanceof globalThis.Element ? node : node?.nextElementSibling
    if (el) {
      columnInset.value = Number.parseFloat(globalThis.getComputedStyle(el).paddingLeft) || 0
    }
  }

  onMounted(() => {
    readColumnInset()
    globalThis.addEventListener('resize', readColumnInset, { passive: true })
  })

  onScopeDispose(() => globalThis.removeEventListener('resize', readColumnInset))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="contents"
  >
    <AppHeader
      ref="barEl"
      variant="site"
      aria-label="Azion"
      class="sticky top-0 z-40"
    >
      <AppHeaderStart class="justify-start!">
        <IconButton
          ref="opener"
          icon="az az-menu"
          variant="outline"
          size="medium"
          :ariaLabel="t('siteHeaderSection.open')"
          class="shrink-0 xl:hidden"
          @click="navOpen = true"
        />
        <AppHeaderBrand>
          <a
            :href="home"
            :aria-label="t('siteHeaderSection.home')"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          >
            <Brand
              variant="default"
              size="small"
            />
          </a>
        </AppHeaderBrand>
      </AppHeaderStart>

      <AppHeaderCenter class="justify-start!">
        <NavigationMenu
          aria-label="Azion"
          class="min-w-0"
        >
          <NavigationMenuList class="hidden items-center gap-(--spacing-2xs) xl:flex">
            <NavigationMenuItem
              v-for="menu in menus"
              :key="menu.value"
              :value="menu.value"
            >
              <NavigationMenuTrigger>
                {{ menu.label }}
              </NavigationMenuTrigger>
              <NavigationMenuContent class="w-full">
                <div
                  :data-columns="menu.columns.length"
                  class="grid gap-x-0 gap-y-(--spacing-md) data-[columns=1]:grid-cols-1 data-[columns=2]:grid-cols-2 data-[columns=4]:grid-cols-4 data-[columns=4]:w-[calc(min(var(--layout-measure-site-header),100vw)_-_2*var(--layout-boundary-inline)_-_2*var(--spacing-md)_-_2px)]"
                >
                  <div
                    v-for="(column, index) in menu.columns"
                    :key="index"
                    class="flex flex-col gap-y-(--spacing-md)"
                  >
                    <NavigationMenuList
                      v-for="group in column"
                      :key="group.label"
                      :label="group.label"
                      :href="group.href"
                    >
                      <NavigationMenuItem
                        v-for="item in group.items"
                        :key="item.label"
                        layout="entry"
                        :href="item.href ?? '#'"
                        :description="item.description"
                        close-on-click
                      >
                        <template
                          v-if="item.icon"
                          #icon
                        >
                          <i :class="item.icon" />
                        </template>
                        {{ item.label }}
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem
              v-for="link in links"
              :key="link.label"
            >
              <NavigationMenuTrigger :href="link.href">{{ link.label }}</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuViewport
            side="bottom"
            align="start"
            :side-offset="12"
            :collision-padding="{ x: columnInset, y: 8 }"
            variant="contrast"
            arrow
          />
        </NavigationMenu>
      </AppHeaderCenter>

      <AppHeaderEnd>
        <div
          v-if="contact"
          class="hidden xl:flex"
        >
          <Button
            :label="contact.label"
            variant="ghost"
            size="medium"
            :href="contact.href"
          />
        </div>
        <div
          v-if="secondaryAction"
          :data-testid="`${testId}__secondary-action`"
          :data-on-phones="secondaryActionOnPhones || null"
          class="hidden sm:flex data-[on-phones]:flex"
        >
          <Button
            :label="secondaryAction.label"
            variant="secondary"
            size="medium"
            :href="secondaryAction.href"
          />
        </div>
        <Button
          key="button-2"
          v-if="primaryAction"
          :label="primaryAction.label"
          variant="primary"
          size="medium"
          class="shrink-0"
          :href="primaryAction.href"
        />
        <SearchTrigger
          collapsible
          :label="t('siteHeaderSection.search')"
          class="shrink-0"
          @open="emit('search', $event)"
        />
      </AppHeaderEnd>
    </AppHeader>

    <Drawer
      v-model:open="navOpen"
      side="start"
      size="small"
    >
      <DrawerContent>
        <PanelHeader class="hidden w-full md:flex">
          <DrawerTitle>{{ t('siteHeaderSection.menu') }}</DrawerTitle>
        </PanelHeader>

        <ScrollArea class="min-h-0 w-full min-w-0 flex-1">
          <SidebarMenu
            v-model:path="navPath"
            :groups="navGroups"
            aria-label="Azion"
            class="w-full p-(--spacing-md)"
            @navigate="onNavigate"
          >
            <SidebarMenuBack />
          </SidebarMenu>
        </ScrollArea>

        <PanelFooter
          v-if="primaryAction || secondaryAction"
          class="w-full flex-col items-stretch px-(--spacing-md)"
        >
          <Button
            v-if="secondaryAction"
            :label="secondaryAction.label"
            variant="outline"
            size="medium"
            class="w-full"
            :href="secondaryAction.href"
          />
          <Button
            key="button-2"
            v-if="primaryAction"
            :label="primaryAction.label"
            variant="primary"
            size="medium"
            class="w-full"
            :href="primaryAction.href"
          />
        </PanelFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>

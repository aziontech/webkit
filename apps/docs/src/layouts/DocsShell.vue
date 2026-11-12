<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import SearchCommand from '../components/SearchCommand.vue'
  import SideNav from '../components/SideNav.vue'
  import { LOCALES, messages } from '../lib/i18n'
  import { settings } from '../lib/settings'

  const route = useRoute()
  const t = messages
  const navOpen = ref(false)
  const searchOpen = ref(false)

  const sections = computed(() => [
    { to: '/foundations', label: t.value.foundations },
    { to: '/components', label: t.value.components },
    { to: '/blocks', label: t.value.blocks }
  ])

  const activeSection = computed(
    () => sections.value.find((section) => route.path.startsWith(section.to))?.to ?? ''
  )

  const localeLabel = (value: unknown) =>
    LOCALES.find((option) => option.value === value)?.label ?? String(value)

  function toggleDirection() {
    settings.dir = settings.dir === 'rtl' ? 'ltr' : 'rtl'
  }

  watch(
    () => route.fullPath,
    () => {
      navOpen.value = false
    }
  )
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:start-(--spacing-sm) focus:top-(--spacing-sm) focus:z-50 focus:rounded-(--shape-elements) focus:bg-(--bg-surface) focus:px-(--spacing-sm) focus:py-(--spacing-xs)"
      >Skip to content</a
    >
    <div class="@container sticky top-0 z-40 w-full">
      <GlobalHeader :aria-label="t.navigation">
        <GlobalHeader.Left>
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <div class="shrink-0 lg:hidden">
              <IconButton
                icon="pi pi-bars"
                kind="outlined"
                size="medium"
                :aria-label="t.openNavigation"
                @click="navOpen = true"
              />
            </div>
            <GlobalHeader.Brand>
              <a
                href="/"
                :aria-label="t.home"
                class="inline-flex w-fit items-center gap-(--spacing-xs) rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              >
                <Brand
                  kind="default"
                  size="small"
                />
                <span
                  class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) text-overline-sm text-(--text-muted)"
                >
                  WebKit
                </span>
              </a>
            </GlobalHeader.Brand>
            <nav
              :aria-label="t.navigation"
              class="ms-(--spacing-sm) hidden items-center gap-(--spacing-xxs) lg:flex"
            >
              <a
                v-for="section in sections"
                :key="section.to"
                :href="section.to"
                :aria-current="activeSection === section.to ? 'page' : undefined"
                :class="[
                  'rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-label-md transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none',
                  activeSection === section.to ? 'text-(--text-default)' : 'text-(--text-muted)'
                ]"
                >{{ section.label }}</a
              >
            </nav>
          </div>
        </GlobalHeader.Left>
        <GlobalHeader.Nav />
        <GlobalHeader.Right>
          <SearchTrigger
            collapsible
            :label="t.search"
            @open="searchOpen = true"
          />
          <div class="hidden w-36 shrink-0 md:block">
            <Select
              v-model="settings.locale"
              size="medium"
              :display-value="localeLabel"
            >
              <Select.Trigger :aria-label="t.language">
                <template #iconLeft>
                  <i
                    class="pi pi-globe text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
              </Select.Trigger>
              <Select.Content>
                <Select.Option
                  v-for="option in LOCALES"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
          <Tooltip :text="settings.dir === 'rtl' ? t.leftToRight : t.rightToLeft">
            <IconButton
              :icon="settings.dir === 'rtl' ? 'pi pi-align-left' : 'pi pi-align-right'"
              kind="outlined"
              size="medium"
              :aria-label="t.rightToLeft"
              :aria-pressed="settings.dir === 'rtl'"
              class="shrink-0"
              @click="toggleDirection"
            />
          </Tooltip>
          <div class="hidden shrink-0 sm:block">
            <ThemeSwitcher
              v-model="settings.theme"
              :aria-label="t.theme"
            />
          </div>
          <IconButton
            icon="pi pi-github"
            kind="outlined"
            size="medium"
            :aria-label="t.github"
            href="https://github.com/aziontech/webkit"
            target="_blank"
            class="hidden shrink-0 sm:inline-flex"
          />
        </GlobalHeader.Right>
      </GlobalHeader>
    </div>

    <div class="relative flex min-h-0 flex-1">
      <aside
        class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-(--container-2xs) shrink-0 lg:flex"
      >
        <Sidebar
          :aria-label="t.navigation"
          class="w-full"
        >
          <SideNav />
        </Sidebar>
      </aside>

      <main
        id="main"
        class="min-w-0 flex-1"
      >
        <slot />
      </main>
    </div>

    <Drawer
      v-model:open="navOpen"
      dismissible
      :side="settings.dir === 'rtl' ? 'right' : 'left'"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <PanelHeader class="w-full">
            <DrawerTitle>{{ t.navigation }}</DrawerTitle>
          </PanelHeader>
          <PanelContent>
            <div class="flex flex-col gap-(--spacing-md)">
              <div class="flex flex-wrap gap-(--spacing-xs)">
                <a
                  v-for="section in sections"
                  :key="section.to"
                  :href="section.to"
                  class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-label-md"
                  >{{ section.label }}</a
                >
              </div>
              <ThemeSwitcher
                v-model="settings.theme"
                :aria-label="t.theme"
              />
              <SideNav />
            </div>
          </PanelContent>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <SearchCommand v-model:open="searchOpen" />
  </div>
</template>

<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { LOCALES, messages } from '../lib/i18n'
  import { settings } from '../lib/settings'
  import SearchCommand from './search-command.vue'
  import SideNav from './side-nav.vue'

  const route = useRoute()
  const t = messages
  const navOpen = ref(false)
  const searchOpen = ref(false)

  const sections = computed(() => [
    { to: '/foundations', label: t.value.foundations },
    { to: '/components', label: t.value.components },
    { to: '/blocks', label: t.value.blocks },
    { to: '/assets', label: t.value.assets }
  ])

  const COPY_ROUTES = new Set(['foundation', 'assets'])

  const hasCopyToasts = computed(() => COPY_ROUTES.has(String(route.name)))

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
      class="sr-only focus:not-sr-only focus:absolute focus:start-(--spacing-sm) focus:top-(--spacing-sm) focus:z-50 focus:rounded-(--shape-control) focus:bg-(--bg-surface) focus:px-(--spacing-sm) focus:py-(--spacing-xs)"
      >Skip to content</a
    >
    <div class="@container sticky top-0 z-40 w-full">
      <AppHeader :aria-label="t.navigation">
        <AppHeader.Start>
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <div class="shrink-0 lg:hidden">
              <IconButton
                icon="az az-menu"
                variant="outline"
                size="medium"
                :aria-label="t.openNavigation"
                @click="navOpen = true"
              />
            </div>
            <AppHeader.Brand>
              <a
                href="/"
                :aria-label="t.home"
                class="inline-flex w-fit items-center gap-(--spacing-xs) rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              >
                <Brand
                  variant="default"
                  size="small"
                />
                <Tag
                  label="WebKit"
                  severity="neutral"
                  size="small"
                />
              </a>
            </AppHeader.Brand>
            <NavigationMenu
              :aria-label="t.navigation"
              class="ms-(--spacing-sm) hidden lg:flex"
            >
              <NavigationMenu.List>
                <NavigationMenu.Item
                  v-for="section in sections"
                  :key="section.to"
                >
                  <NavigationMenu.Link
                    :href="section.to"
                    :active="activeSection === section.to"
                    >{{ section.label }}</NavigationMenu.Link
                  >
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu>
          </div>
        </AppHeader.Start>
        <AppHeader.Center />
        <AppHeader.End>
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
                <template #leading>
                  <i
                    class="az az-globe text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
              </Select.Trigger>
              <Select.Content>
                <Select.Item
                  v-for="option in LOCALES"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
          <Tooltip :content="settings.dir === 'rtl' ? t.leftToRight : t.rightToLeft">
            <IconButton
              :icon="settings.dir === 'rtl' ? 'az az-align-left' : 'az az-align-right'"
              variant="outline"
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
            icon="az az-github"
            variant="outline"
            size="medium"
            :aria-label="t.github"
            href="https://github.com/aziontech/webkit"
            target="_blank"
            class="hidden shrink-0 sm:inline-flex"
          />
        </AppHeader.End>
      </AppHeader>
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
      :side="settings.dir === 'rtl' ? 'end' : 'start'"
      size="small"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>{{ t.navigation }}</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <div class="flex flex-wrap gap-(--spacing-xs)">
              <Button
                v-for="section in sections"
                :key="section.to"
                :href="section.to"
                :label="section.label"
                :aria-current="activeSection === section.to ? 'page' : undefined"
                :variant="activeSection === section.to ? 'secondary' : 'outline'"
                size="medium"
              />
            </div>
            <ThemeSwitcher
              v-model="settings.theme"
              :aria-label="t.theme"
            />
            <SideNav />
          </div>
        </PanelBody>
      </DrawerContent>
    </Drawer>

    <SearchCommand v-model:open="searchOpen" />
    <Toaster
      v-if="hasCopyToasts"
      position="bottom-center"
    />
  </div>
</template>

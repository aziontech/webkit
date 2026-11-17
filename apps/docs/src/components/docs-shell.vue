<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SkipLink from '@aziontech/webkit/skip-link'
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
    <SkipLink />
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
            <AppHeader.Brand
              href="/"
              :aria-label="t.home"
              label="WebKit"
            >
              <Brand
                variant="default"
                size="small"
              />
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

      <div class="flex min-w-0 flex-1 flex-col">
        <main
          id="main"
          class="@container/main min-w-0 flex-1"
        >
          <slot />
        </main>
        <Footer
          variant="console"
          :aria-label="t.footer"
        >
          <Footer.Column :title="t.footerWebkit">
            <Footer.Link href="https://github.com/aziontech/webkit">{{
              t.footerGithub
            }}</Footer.Link>
            <Footer.Link href="https://www.npmjs.com/package/@aziontech/webkit">{{
              t.footerNpm
            }}</Footer.Link>
          </Footer.Column>
          <Footer.Column :title="t.footerAzion">
            <Footer.Link href="https://www.azion.com/en/documentation/">{{
              t.footerAzionDocs
            }}</Footer.Link>
            <Footer.Link href="https://console.azion.com">{{ t.footerConsole }}</Footer.Link>
          </Footer.Column>
          <template #brand>
            <AppHeader.Brand
              href="/"
              :aria-label="t.home"
              label="WebKit"
            >
              <Brand
                variant="default"
                size="small"
              />
            </AppHeader.Brand>
          </template>
        </Footer>
      </div>
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

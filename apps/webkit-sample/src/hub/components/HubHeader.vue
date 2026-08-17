<script setup>
  // Docs-style top bar for the Webkit Hub — modelled on DocsLayout's header (and
  // the Storybook Foundations sections), rebuilt on @aziontech/webkit. Left: the
  // Azion Brand lockup + a "Webkit" badge. Center: a NavigationMenu grouping the
  // library docs into "Getting Started" and "Foundations" mega-menus. Right: a
  // searchbar and a ThemeSwitcher wired to the shared app theme singleton, so
  // light/dark/system persists across the app like every other route.
  //
  // The nav items map to the Storybook Foundations pages; since those aren't
  // routes in this sample app, they're kept as self-contained in-page anchors
  // (matching DocsLayout's prototype convention).
  import Brand from '@aziontech/webkit/brand'
  import InputText from '@aziontech/webkit/input-text'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { useTheme } from '@shared/lib/theme.js'
  import { ref } from 'vue'

  const { theme } = useTheme()
  const query = ref('')

  // Two mega-menus mirroring the Storybook Foundations tree. Each entry carries a
  // glyph, a label, a one-line description, and the in-page anchor it links to.
  const navMenus = [
    {
      value: 'getting-started',
      label: 'Getting Started',
      groups: [
        {
          label: 'Getting Started',
          items: [
            {
              icon: 'pi pi-book',
              label: 'Get Started',
              description: 'Install and set up @aziontech/webkit',
              href: '#get-started'
            },
            {
              icon: 'pi pi-compass',
              label: 'Style Guide',
              description: 'Principles and usage conventions',
              href: '#style-guide'
            }
          ]
        }
      ]
    },
    {
      value: 'foundations',
      label: 'Foundations',
      groups: [
        {
          label: 'Foundations',
          items: [
            {
              icon: 'pi pi-database',
              label: 'All Tokens (Globals)',
              description: 'Every global design token in one place',
              href: '#tokens'
            },
            {
              icon: 'pi pi-palette',
              label: 'Colors',
              description: 'Color scales and semantic roles',
              href: '#colors'
            },
            {
              icon: 'pi pi-align-left',
              label: 'Typography',
              description: 'Type scale and text styles',
              href: '#typography'
            },
            {
              icon: 'pi pi-sun',
              label: 'Theme',
              description: 'Light, dark and semantic theming',
              href: '#theme'
            },
            {
              icon: 'pi pi-star',
              label: 'Icons',
              description: 'The Azion icon library',
              href: '#icons'
            }
          ]
        }
      ]
    }
  ]
</script>

<template>
  <header
    class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-(--spacing-lg) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md)"
  >
    <RouterLink
      to="/site/hub"
      aria-label="Webkit Hub — home"
      class="inline-flex shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface)"
    >
      <Brand
        kind="default"
        size="small"
      />
      <span
        class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) py-px text-overline-sm uppercase tracking-widest text-(--text-muted)"
      >
        Webkit
      </span>
    </RouterLink>

    <NavigationMenu
      aria-label="Webkit documentation"
      class="hidden md:flex"
    >
      <NavigationMenu.List class="items-center gap-(--spacing-xxs)">
        <NavigationMenu.Item
          v-for="menu in navMenus"
          :key="menu.value"
          :value="menu.value"
        >
          <NavigationMenu.Trigger>
            {{ menu.label }}
            <NavigationMenu.Icon>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content class="w-full p-0">
            <div class="grid grid-cols-1 gap-(--spacing-md) p-(--spacing-sm)">
              <NavigationMenu.List
                v-for="group in menu.groups"
                :key="group.label"
                :label="group.label"
              >
                <NavigationMenu.Item
                  v-for="item in group.items"
                  :key="item.label"
                  layout="entry"
                  :href="item.href"
                  :description="item.description"
                  close-on-click
                >
                  <template #icon>
                    <i
                      :class="item.icon"
                      aria-hidden="true"
                    />
                  </template>
                  {{ item.label }}
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          side="bottom"
          align="start"
          :side-offset="12"
        >
          <NavigationMenu.Popup>
            <NavigationMenu.Arrow />
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu>

    <div class="ml-auto flex items-center gap-(--spacing-sm)">
      <div class="hidden w-64 sm:block">
        <InputText
          v-model="query"
          placeholder="Search components"
          size="small"
          aria-label="Search the Webkit Hub"
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
        </InputText>
      </div>
      <ThemeSwitcher
        v-model:value="theme"
        aria-label="Theme"
      />
    </div>
  </header>
</template>

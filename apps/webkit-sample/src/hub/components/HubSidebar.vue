<script setup>
  // The Webkit Hub's global navigation, moved off the top bar into a full-height
  // left rail — the same shape the console (AppSidebar) and the developer docs
  // (DocsLayout) use, rebuilt on the webkit Sidebar. The header carries the Azion
  // brand lockup + a "Webkit" badge and a filter field; the body groups the hub
  // sections (Home, Components, Foundations, Assets) as MenuItems; the footer
  // holds the ThemeSwitcher wired to the shared app theme singleton.
  //
  // Each nav item selects a content view in the Hub shell (WebkitHub) rather than
  // scrolling one long page: activating an item bubbles a `navigate` event whose
  // `item.id` the shell swaps into the main region. "Componentes" fans out to the
  // library's real categories (each renders that category's slice of the Hub
  // grid); "Assets" fans out to Brand / Icons / Illustrations galleries.
  import Brand from '@aziontech/webkit/brand'
  import InputText from '@aziontech/webkit/input-text'
  import MenuItem from '@aziontech/webkit/menu-item'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarGroup from '@aziontech/webkit/sidebar-group'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { useTheme } from '@shared/lib/theme.js'
  import { computed, ref } from 'vue'

  defineProps({
    // Id of the nav item to render as selected.
    active: { type: String, default: 'home' },
    ariaLabel: { type: String, default: 'Webkit Hub navigation' }
  })

  // `navigate` fires when a nav item is activated — event-first per the
  // activation-payload convention. The shell owns the scroll.
  const emit = defineEmits(['navigate'])

  const { theme } = useTheme()

  // The Hub navigation. Each item's `id` selects a content view in the shell:
  // `home` (overview), one per component category under "Componentes", one per
  // foundation under "Foundations" (each its own view rather than a 5-section
  // wall), and the three "Assets" galleries. Ids under "Componentes" match
  // ComponentGrid's category filter (actions … code); ids under "Foundations"
  // are prefixed `foundation-` so `foundation-icons` never collides with the
  // Assets `icons` gallery.
  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'pi pi-home' },
        { id: 'getting-started', label: 'Getting Started', icon: 'pi pi-book' }
      ]
    },
    {
      label: 'Components',
      items: [
        { id: 'actions', label: 'Actions', icon: 'pi pi-bolt' },
        { id: 'inputs', label: 'Inputs', icon: 'pi pi-pencil' },
        { id: 'content', label: 'Content', icon: 'pi pi-id-card' },
        { id: 'feedback', label: 'Feedback', icon: 'pi pi-comment' },
        { id: 'overlay', label: 'Overlay', icon: 'pi pi-clone' },
        { id: 'navigation', label: 'Navigation', icon: 'pi pi-compass' },
        { id: 'layout', label: 'Layout', icon: 'pi pi-table' },
        { id: 'data', label: 'Data', icon: 'pi pi-database' },
        { id: 'code', label: 'Code', icon: 'pi pi-code' }
      ]
    },
    {
      label: 'Foundations',
      items: [
        { id: 'foundation-tokens', label: 'All Tokens', icon: 'pi pi-database' },
        { id: 'foundation-colors', label: 'Colors', icon: 'pi pi-palette' },
        { id: 'foundation-typography', label: 'Typography', icon: 'pi pi-language' },
        { id: 'foundation-theme', label: 'Theme', icon: 'pi pi-sun' },
        { id: 'foundation-icons', label: 'Icons', icon: 'pi pi-star' }
      ]
    },
    {
      label: 'Assets',
      items: [
        { id: 'brand', label: 'Brand', icon: 'pi pi-verified' },
        { id: 'icons', label: 'Icons', icon: 'pi pi-star' },
        { id: 'illustrations', label: 'Illustrations', icon: 'pi pi-image' }
      ]
    }
  ]

  // Nav search: filters the baked-in groups by item label (case-insensitive).
  // Groups with no surviving item drop out; Escape clears the query.
  const query = ref('')
  const filteredGroups = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return navGroups
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(q))
      }))
      .filter((group) => group.items.length > 0)
  })
  const hasResults = computed(() => filteredGroups.value.length > 0)
  const clearSearch = () => {
    query.value = ''
  }
</script>

<template>
  <aside class="h-full w-(--container-2xs) shrink-0">
    <Sidebar :aria-label="ariaLabel">
      <template #header>
        <!-- Brand lockup + Webkit badge, linking home. `px-(--spacing-xxs)` matches the
             console rail (AppSidebar.vue) and the docs bar: a nav row's icon sits 4px
             inside the row box, so without it the wordmark hangs 4px left of every item
             below it. -->
        <RouterLink
          to="/site/hub"
          aria-label="Webkit Hub — home"
          class="inline-flex shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xxs) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface)"
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

        <!-- Nav filter: stays put in the fixed header while the nav scrolls. -->
        <div class="pt-(--spacing-sm)">
          <InputText
            v-model="query"
            placeholder="Search"
            size="small"
            aria-label="Search navigation"
            @keydown.esc="clearSearch"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </div>
      </template>

      <SidebarGroup
        v-for="(group, i) in filteredGroups"
        :key="group.label ?? `group-${i}`"
        :label="group.label"
      >
        <MenuItem
          v-for="item in group.items"
          :key="item.id"
          :label="item.label"
          :icon="item.icon"
          :selected="active === item.id"
          @click="(event) => emit('navigate', event, item)"
        />
      </SidebarGroup>
      <p
        v-if="!hasResults"
        class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
      >
        No results for “{{ query.trim() }}”
      </p>

      <template #footer>
        <!-- Theme control row, mirroring the console footer's inline switcher. -->
        <div class="flex items-center gap-(--spacing-xs) pt-(--spacing-sm)">
          <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)">
            Theme
          </span>
          <ThemeSwitcher
            v-model:value="theme"
            aria-label="Theme"
          />
        </div>
      </template>
    </Sidebar>
  </aside>
</template>

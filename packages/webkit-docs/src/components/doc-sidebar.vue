<script setup lang="ts">
  import InputText from '@aziontech/webkit/input-text'
  import Kbd from '@aziontech/webkit/kbd'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import SidebarGroup from '@aziontech/webkit/sidebar-group'
  import SidebarHeader from '@aziontech/webkit/sidebar-header'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  /**
   * The documentation navigation rail: search at the top, the section tree in
   * the middle, the theme control at the bottom — built on the webkit Sidebar
   * so it inherits the rail's resize, collapse and landmark behaviour.
   */
  defineOptions({ name: 'DocSidebar' })

  /** One navigable page in the tree. */
  export type DocNavItem = { label: string; href?: string; active?: boolean }
  /** A labelled section of the tree. */
  export type DocNavGroup = { label: string; items: DocNavItem[] }

  interface Props {
    /** The section tree. */
    groups?: DocNavGroup[]
    /** Placeholder for the search field. */
    searchPlaceholder?: string
  }

  withDefaults(defineProps<Props>(), {
    groups: () => [],
    searchPlaceholder: 'Search'
  })

  const emit = defineEmits<{
    /** Fired when a navigation entry is activated. */
    navigate: [event: MouseEvent, item: DocNavItem]
  }>()

  const query = ref('')
  const theme = ref('dark')
</script>

<template>
  <Sidebar
    data-testid="doc-sidebar"
    aria-label="Documentation"
  >
    <template #header>
      <SidebarHeader>
        <InputText
          v-model="query"
          :placeholder="searchPlaceholder"
          size="medium"
          class="w-full"
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
          <template #iconRight>
            <Kbd
              meta
              size="small"
              >K</Kbd
            >
          </template>
        </InputText>
      </SidebarHeader>
    </template>

    <SidebarGroup
      v-for="group in groups"
      :key="group.label"
      :label="group.label"
    >
      <!-- SidebarGroup renders a <ul>, so every entry is an <li>. -->
      <li
        v-for="item in group.items"
        :key="item.label"
      >
        <a
          :href="item.href ?? '#'"
          :data-active="item.active || null"
          :aria-current="item.active ? 'page' : undefined"
          class="flex h-8 items-center rounded-(--shape-elements) px-(--spacing-xs) text-label-md text-(--text-default) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) data-[active]:bg-(--bg-selected) motion-reduce:transition-none"
          @click="emit('navigate', $event, item)"
        >
          {{ item.label }}
        </a>
      </li>
    </SidebarGroup>

    <template #footer>
      <SidebarFooter>
        <ThemeSwitcher v-model:value="theme" />
      </SidebarFooter>
    </template>
  </Sidebar>
</template>

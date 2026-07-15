<script setup>
  // The single Azion Console app shell, shared by every console page. A full-height
  // Sidebar sits on the left; the GlobalHeader lives INSIDE the content zone (right
  // of the sidebar) and carries the breadcrumb for the module the user entered.
  // Pages render only their own content through the default slot.
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AppSidebar from './AppSidebar.vue'

  const props = defineProps({
    // Sidebar item id to render as selected.
    active: { type: String, default: '' },
    // Breadcrumb trail for the current module, e.g. [{ label: "Applications" }].
    breadcrumb: { type: Array, default: () => [] },
    // Whether the nav sidebar is shown. Focused flows (create/edit) hide it so
    // the form is the only thing competing for attention.
    sidebar: { type: Boolean, default: true },
    // Whether the content zone applies the standard page inset. Focused flows
    // that manage their own full-bleed layout (create/edit) opt out.
    padded: { type: Boolean, default: true }
  })

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // Locally track the highlighted item, seeded from the page's `active` prop.
  // The full console navigation lives inside AppSidebar; this handles routing.
  const activeItem = ref(props.active)

  const onNavigate = (event, item) => {
    activeItem.value = item.id
    if (item.path && item.path !== route.path) {
      router.push({ path: item.path, query: { email: userEmail.value } })
    }
  }

  // First-level modules (Applications, Home, …) pass a single crumb and show no
  // breadcrumb; the trail only appears once the user is inside something (a
  // trail of 2+ levels, e.g. Applications › New Application).
  const showBreadcrumb = computed(() => props.breadcrumb.length > 1)

  const onCrumb = (event, href) => {
    if (href && href !== '#') {
      router.push({ path: href, query: { email: userEmail.value } })
    }
  }

  const openCreationCenter = () =>
    router.push({ path: '/create', query: { email: userEmail.value } })

  const openAccount = () => router.push({ path: '/account', query: { email: userEmail.value } })

  const signOut = () => router.push('/login')
</script>

<template>
  <div class="flex h-dvh bg-[var(--bg-canvas)]">
    <!-- Single, full-height Azion app sidebar (hidden in focused flows) -->
    <AppSidebar
      v-if="sidebar"
      :user="userEmail"
      :active="activeItem"
      aria-label="Main navigation"
      @navigate="onNavigate"
      @logout="signOut"
    />

    <!-- Content zone: GlobalHeader (with module breadcrumb) + page content -->
    <div class="flex min-w-0 flex-1 flex-col">
      <GlobalHeader aria-label="Azion Console">
        <GlobalHeader.Left>
          <Breadcrumb
            v-if="showBreadcrumb"
            :items="breadcrumb"
            @navigate="onCrumb"
          />
        </GlobalHeader.Left>
        <GlobalHeader.Middle />
        <GlobalHeader.Right>
          <Button
            label="Create"
            kind="secondary"
            size="medium"
            icon="pi pi-plus-circle"
            @click="openCreationCenter"
          />
          <ButtonHighlight
            label="Copilot"
            size="medium"
            icon="ai ai-ask-azion"
          />
          <Button
            label="Documentation"
            kind="outlined"
            size="medium"
            icon="pi pi-book"
            href="https://www.azion.com/en/documentation/"
            target="_blank"
          />
          
          <button
            type="button"
            aria-label="Account settings"
            class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
            @click="openAccount"
          >
            <Avatar
              :label="userEmail"
              size="medium"
            />
          </button>
        </GlobalHeader.Right>
      </GlobalHeader>

      <div
        class="min-h-0 flex-1 overflow-auto"
        :class="{ 'p-[var(--spacing-lg)]': padded }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

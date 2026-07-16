<script setup>
  // The single Azion Console app shell, shared by every console page. A full-height
  // Sidebar sits on the left; the GlobalHeader lives INSIDE the content zone (right
  // of the sidebar) and carries the breadcrumb for the module the user entered.
  // Pages render only their own content through the default slot.
  import { curve, duration } from '@aziontech/theme/animations'
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useSidebar } from '../../sidebar.js'
  import AppSidebar from './AppSidebar.vue'

  const props = defineProps({
    // Sidebar item id to render as selected.
    active: { type: String, default: '' },
    // Breadcrumb trail for the current module, e.g. [{ label: "Applications" }].
    breadcrumb: { type: Array, default: () => [] },
    // Whether the nav sidebar is shown. Focused flows (create/edit) hide it so
    // the form is the only thing competing for attention.
    sidebar: { type: Boolean, default: true },
    // Whether the header carries a toggle that fully collapses the rail. On by
    // default, so the sidebar toggle is available on every console page.
    collapsible: { type: Boolean, default: true },
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

  // Collapsible pages let the user hide the rail entirely to reclaim the space.
  // Backed by a module-level singleton (persisted to localStorage) so the choice
  // survives navigation between modules and page reloads.
  const { collapsed } = useSidebar()

  // The toggle glyph cross-fades on every flip, sliding the way the sidebar is
  // heading: rightward when expanding, leftward when collapsing. We stamp the
  // direction on click so the enter/leave offsets pick the matching sign.
  const toggleDirection = ref('collapse')
  const toggleSidebar = () => {
    toggleDirection.value = collapsed.value ? 'expand' : 'collapse'
    collapsed.value = !collapsed.value
  }

  const iconSwapActiveClasses =
    'transition-[transform,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none motion-reduce:transform-none'
  const iconEnterFromClasses = computed(() =>
    toggleDirection.value === 'expand' ? '-translate-x-2 opacity-0' : 'translate-x-2 opacity-0'
  )
  const iconLeaveToClasses = computed(() =>
    toggleDirection.value === 'expand' ? 'translate-x-2 opacity-0' : '-translate-x-2 opacity-0'
  )

  // ── Sidebar slide timing — tweak these token keys and reload to test ──
  // They index the motion tokens from @aziontech/theme/animations (DESIGN.md
  // § Motion), so the resolved ms / cubic-bezier come from the design system,
  // never hardcoded here. Available keys:
  //   duration: fast-01 (70ms) · fast-02 (110ms) · moderate-01 (150ms) ·
  //             moderate-02 (240ms) · slow-01 (400ms) · slow-02 (700ms)
  //   curve:    productive-entrance · productive-exit ·
  //             expressive-entrance · expressive-exit
  const SIDEBAR_DURATION = 'moderate-02'
  const SIDEBAR_ENTER_CURVE = 'expressive-entrance'
  const SIDEBAR_LEAVE_CURVE = 'expressive-exit'

  // Resolved token values (what actually gets applied) — the inline comments
  // show the ms / cubic-bezier each key currently maps to.
  const sidebarDurationValue = duration[SIDEBAR_DURATION] // 'moderate-02' → 240ms
  const sidebarEnterCurveValue = curve[SIDEBAR_ENTER_CURVE] // 'expressive-entrance' → cubic-bezier(0.17, 0.84, 0.44, 1)
  const sidebarLeaveCurveValue = curve[SIDEBAR_LEAVE_CURVE] // 'expressive-exit' → cubic-bezier(0.95, 0.05, 0.8, 0.04)

  const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  // The rail stays mounted; collapsing animates its WIDTH to 0 (and slides the
  // inner sidebar out via translateX). Because the content zone is `flex-1`, it
  // morphs frame-by-frame to fill the freed space on the SAME timing — the main
  // container and the sidebar animate as one. Width is measured once so there's
  // no visual regression and both ends of the transition are real lengths.
  const railRef = ref(null)
  const railWidth = ref(null)
  onMounted(() => {
    if (railRef.value) railWidth.value = railRef.value.offsetWidth
  })

  // Phase-aware timing: entrance curve when expanding, exit curve when
  // collapsing — same duration token for both. Width + transform share it, so
  // the slide and the morph stay locked together.
  const railTransition = computed(() => {
    if (prefersReducedMotion()) return 'none'
    const curveValue = collapsed.value ? sidebarLeaveCurveValue : sidebarEnterCurveValue
    const timing = `${sidebarDurationValue} ${curveValue}`
    return `width ${timing}, transform ${timing}`
  })

  // Outer rail: the width that the content morphs against.
  const railStyle = computed(() => ({
    width: railWidth.value == null ? undefined : collapsed.value ? '0px' : `${railWidth.value}px`,
    transition: railTransition.value
  }))

  // Inner sidebar: kept at its natural width (so its own layout never reflows
  // while the rail shrinks) and slid out to the left, clipped by the rail.
  const railInnerStyle = computed(() => ({
    width: railWidth.value == null ? undefined : `${railWidth.value}px`,
    transform: collapsed.value ? 'translateX(-100%)' : 'none',
    transition: railTransition.value
  }))

  const onNavigate = (event, item) => {
    activeItem.value = item.id
    if (item.path && item.path !== route.path) {
      router.push({ path: item.path, query: { email: userEmail.value } })
    }
  }

  // The header always names the current location: the breadcrumb renders on
  // every page that passes one, from a single first-level crumb (Home,
  // Applications) up through a nested trail (Applications › New Application).
  // Crumb links navigate; the last crumb is the current page.
  const showBreadcrumb = computed(() => props.breadcrumb.length >= 1)

  const onCrumb = (event, href) => {
    if (href && href !== '#') {
      // A crumb href may carry its own query (e.g. /account?tab=teams-permissions);
      // split it out and merge so the target tab is preserved alongside email.
      const [path, queryString] = href.split('?')
      const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
      router.push({ path, query: { email: userEmail.value, ...extra } })
    }
  }

  const openCreationCenter = () =>
    router.push({ path: '/create', query: { email: userEmail.value } })

  const openAccount = () => router.push({ path: '/account', query: { email: userEmail.value } })

  // Account-menu entries (the sidebar footer ⋮ Dropdown). Navigations route to
  // their page; "Personal Tokens" opens the token create flow (the tokens area
  // under Account Settings), Docs opens externally, and Settings / anything else
  // lands on the /account Settings page. Soft demo entries are handled in the
  // sidebar itself and never reach here.
  const onAccountSelect = (event, value) => {
    if (value === 'personal-tokens') {
      router.push({ path: '/personal-tokens', query: { email: userEmail.value } })
    } else if (value === 'home') {
      router.push({ path: '/home', query: { email: userEmail.value } })
    } else if (value === 'docs') {
      window.open('https://www.azion.com/en/documentation/', '_blank', 'noopener')
    } else {
      openAccount()
    }
  }

  const signOut = () => router.push('/login')
</script>

<template>
  <div class="flex h-dvh overflow-hidden bg-[var(--bg-canvas)]">
    <!-- Single, full-height Azion app sidebar (hidden in focused flows). On a
         collapsible page the rail stays mounted and its width animates to 0
         while the inner sidebar slides out to the left; the content zone morphs
         to fill the space on the same timing. -->
    <div
      v-if="sidebar"
      ref="railRef"
      class="shrink-0 overflow-hidden"
      :style="railStyle"
      :inert="collapsed || null"
      :aria-hidden="collapsed || null"
    >
      <AppSidebar
        class="h-full"
        :style="railInnerStyle"
        :user="userEmail"
        :active="activeItem"
        aria-label="Main navigation"
        @navigate="onNavigate"
        @select="onAccountSelect"
        @logout="signOut"
      />
    </div>

    <!-- Content zone: GlobalHeader (with module breadcrumb) + page content -->
    <div class="flex min-w-0 flex-1 flex-col">
      <GlobalHeader aria-label="Azion Console">
        <GlobalHeader.Left>
          <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
            <!-- Sidebar toggle: outlined icon button whose glyph cross-fades and
                 slides in the direction of travel (right to expand, left to
                 collapse). Hand-rolled rather than <IconButton> so the swap can
                 be directional; matches the outlined/medium chrome. -->
            <button
              v-if="sidebar && collapsible"
              type="button"
              :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
              :aria-pressed="collapsed"
              class="relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-button-md text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-mask)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
              @click="toggleSidebar"
            >
              <Transition
                mode="out-in"
                :enter-active-class="iconSwapActiveClasses"
                :leave-active-class="iconSwapActiveClasses"
                :enter-from-class="iconEnterFromClasses"
                enter-to-class="translate-x-0 opacity-100"
                leave-from-class="translate-x-0 opacity-100"
                :leave-to-class="iconLeaveToClasses"
              >
                <i
                  :key="collapsed"
                  :class="[
                    collapsed ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left',
                    'size-3 text-[length:inherit] leading-none'
                  ]"
                  aria-hidden="true"
                />
              </Transition>
            </button>
            <Breadcrumb
              v-if="showBreadcrumb"
              :items="breadcrumb"
              @navigate="onCrumb"
            />
          </div>
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

      <!-- Content inset matches the GlobalHeader's edge padding
           (`--spacing-md`), so the page content aligns with the header's
           breadcrumb / actions on every breakpoint. -->
      <div
        class="min-h-0 flex-1 overflow-auto"
        :class="{ 'p-[var(--spacing-md)]': padded }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

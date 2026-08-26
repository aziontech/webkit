<script setup>
  // The single header for every "creation" flow (Create Application, Creation
  // Center, Deploy Template): a back IconButton, the Azion brand mark, and the
  // module breadcrumb on the left — and the signed-in user on the right. Creation
  // pages render exactly ONE header, and it is this one.
  //
  // Focused flows drop the sidebar so the form is the only thing competing for
  // attention, but the user must never look "signed out": the account avatar
  // stays anchored to GlobalHeader.Right, mirroring the console shell's header
  // (see AppLayout.vue). It is the one piece of persistent chrome a focused flow
  // keeps.
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { routeActivation } from '../../lib/behavior/anchor-nav'

  defineProps({
    // Breadcrumb trail for the flow. When empty, the breadcrumb is omitted.
    breadcrumb: { type: Array, default: () => [] },
    // Accessible label for the back button.
    backLabel: { type: String, default: 'Back' },
    // Whether the back button is shown (hidden on terminal states like success).
    showBack: { type: Boolean, default: true }
  })

  const emit = defineEmits(['back', 'navigate'])

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder),
  // matching AppLayout so the identity is consistent across shells.
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The account avatar routes to the same account page as the console header,
  // preserving the email query so identity carries across.
  const openAccount = () => router.push({ path: '/account', query: { email: userEmail.value } })

  // The crumb is a real anchor, so the click is CLAIMED here — once, for every creation
  // flow — before it reaches the owner. A creation flow is the one place in the console
  // that always holds uncommitted work, so letting the browser also follow the href puts
  // its "Leave site?" on top of our own unsaved-changes dialog (../../lib/anchor-nav.js).
  // Modified clicks are left to the browser and never forwarded: the owner would route
  // them, which is the opposite of the new tab the reader asked for.
  const onCrumb = (event, href) => {
    if (!routeActivation(event)) return
    emit('navigate', event, href)
  }
</script>

<template>
  <!-- `kind="content"`, even though this bar spans the WINDOW and has no content zone
       beside it: the kind is what decides the inset, and `app` is a flat 16 while every
       create and wizard flow below it opens its column on `--layout-boundary-inline`.
       The two disagreed at every width the form column did not cap at — the back arrow
       sitting inside the heading it belongs to. `content` puts the bar on the same token
       the page reads, so they open on one vertical wherever the column is uncapped. -->
  <GlobalHeader
    kind="content"
    aria-label="Azion Console"
  >
    <GlobalHeader.Left>
      <IconButton
        v-if="showBack"
        icon="pi pi-chevron-left"
        :aria-label="backLabel"
        kind="outlined"
        size="small"
        @click="emit('back')"
      />
      <GlobalHeader.Brand>
        <!-- The brand mark is the way back to the console home, matching the
             website nav (see SiteNav.vue). A RouterLink (not a button) so the
             consumer keeps middle-click / open-in-new-tab.

             The DS `Brand` component, not a hand-inlined copy of the wordmark SVG:
             the lockup and its heights are the component's contract. The inlined
             copy here rendered at the 18px `GlobalHeader.Brand` pins any raw `svg`
             to; `kind="default"` + `size="small"` (16px) is the pair every other
             header in the app renders (site nav, docs bar, hub bar, rail, AuthShell),
             so one brand reads at one size across the whole prototype. -->
        <RouterLink
          :to="{ path: '/home', query: { email: userEmail } }"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </RouterLink>
      </GlobalHeader.Brand>
      <Breadcrumb
        v-if="breadcrumb.length"
        :items="breadcrumb"
        @navigate="onCrumb"
      />
    </GlobalHeader.Left>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <!-- The signed-in user stays visible even in a focused flow. -->
      <button
        type="button"
        aria-label="Account settings"
        class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        @click="openAccount"
      >
        <Avatar
          :label="userEmail"
          size="medium"
          kind="square"
        />
      </button>
    </GlobalHeader.Right>
  </GlobalHeader>
</template>

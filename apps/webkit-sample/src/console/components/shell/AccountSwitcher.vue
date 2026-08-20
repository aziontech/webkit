<script setup>
  // THE ACCOUNT, AS THE HEADER'S ONE PIECE OF IDENTITY.
  //
  // WHAT CHANGED. This used to name the whole tenancy chain — organization /
  // workspace on the pill, the account a band inside a two-column panel (kept whole
  // at ./archive/TenancySwitcher.vue). The organization and workspace levels are
  // parked, so what is left is the level an operator actually acts as: the ACCOUNT.
  //
  // So the control is a mark and a name, and one click. There is no panel here and no
  // chevron to promise one: the roster is a modal dialog (./SwitchAccountDialog.vue),
  // because switching the tenant whose infrastructure you operate re-scopes every page
  // behind it, which is not a thing to do from a surface you dismiss by looking away.
  //
  // The mark is the customer's own (./AccountMark.vue, over the site's client
  // registry), because an account IS a company — the same mark the dialog's rows show,
  // so the thing you click in the header is the thing you picked in the list.
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  import { useAccounts } from '../../lib/state/accounts.js'
  import AccountMark from './AccountMark.vue'
  import SwitchAccountDialog from './SwitchAccountDialog.vue'

  // Two shapes, one per host — unchanged from the switcher this replaces.
  //
  // In the NAVIGATION RAIL it is `fluid`: a full-width row at the top of the header
  // region, above the search field and sized like it (40px), the shape Cloudflare's
  // console uses for the same control. In the APP HEADER (below `md`, where the rail
  // is not on screen) it stays a content-sized pill at 28px, beside the other header
  // controls.
  const props = defineProps({
    // Take the full width of the host.
    fluid: { type: Boolean, default: false }
  })

  const { currentAccount } = useAccounts()

  const dialogOpen = ref(false)

  // The hint's own state, CONTROLLED — not left to the DS Tooltip's hover. The
  // ordinary path here is to hover the pill (read the hint) and then click it, and a
  // tooltip that is already open when the dialog lands cannot be closed by `disabled`
  // alone: the DS `setOpen` returns early while disabled, so the hint would sit over
  // the dialog's own first row.
  const hintOpen = ref(false)

  // ⌘O opens it from anywhere, like the palette's ⌘K one row down (the DS CommandMenu
  // in ./AppSidebar.vue owns that one). ONE MODIFIER PER PLATFORM, matched the way the
  // DS matches ⌘K: Meta on macOS, Ctrl everywhere else — never "either one", which
  // would take Win+O from the OS and make the hint lie to every reader not on a Mac.
  const isMac = computed(
    () =>
      typeof navigator !== 'undefined' &&
      /mac/i.test(navigator.platform || navigator.userAgent || '')
  )

  const SHORTCUT_HINT = computed(() => (isMac.value ? '⌘O' : 'Ctrl+O'))

  const onDocumentKeydown = (event) => {
    if (event.key?.toLowerCase() !== 'o') return
    if (!(isMac.value ? event.metaKey : event.ctrlKey)) return
    if (event.altKey || event.shiftKey) return
    // The browser's own Open-file dialog is the default here, and it would take the
    // keystroke and the reader's attention with it.
    event.preventDefault()
    dialogOpen.value = !dialogOpen.value
  }

  onMounted(() => globalThis.document?.addEventListener('keydown', onDocumentKeydown))
  onUnmounted(() => globalThis.document?.removeEventListener('keydown', onDocumentKeydown))

  const accountName = computed(() => currentAccount.value?.name ?? '')

  const openDialog = () => {
    hintOpen.value = false
    dialogOpen.value = true
  }
</script>

<template>
  <!-- ONE OPTICAL CENTRE. The wrapper is a flex box and the Tooltip inside it is
       forced full-width in the fluid shape: the DS Tooltip root is `inline-flex w-fit
       shrink-0`, and `w-fit` / `w-full` are the same property, so a plain class would
       be settled by CSS source order rather than by which one is written here. Flex
       also has no baseline for the pill to fall off — an inline box would be dropped
       onto the line's baseline, leaving the descender gap below it and the pill 1.5px
       above the actions beside it (measured, on the switcher this replaces). -->
  <div :class="['flex min-w-0 items-center', props.fluid && 'w-full']">
    <Tooltip
      v-model:open="hintOpen"
      :text="`Switch account (${SHORTCUT_HINT})`"
      :placement="props.fluid ? 'right' : 'bottom'"
      :class="props.fluid && 'w-full!'"
    >
      <button
        type="button"
        :aria-label="`Account: ${accountName}. Switch account`"
        :data-fluid="props.fluid || null"
        data-testid="account-switcher"
        class="flex h-7 w-auto max-w-80 items-center gap-1.5 rounded-(--shape-button) px-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[fluid]:h-10 data-[fluid]:w-full data-[fluid]:max-w-none data-[fluid]:px-(--spacing-xs) motion-reduce:transition-none"
        @click="openDialog"
      >
        <!-- THE PILL IS 28 TALL AND ITS MARK IS 24 (Figma 6037:55164: pill 108×28,
             avatar 24×24 at y=2, 4px of horizontal padding, 6px gaps). So the height is
             stated on the pill — `h-7`, padding on the x axis only — and the mark is
             the marble at its own 24, the same size the dialog's rows use. -->
        <AccountMark
          :name="accountName"
          size="medium"
          class="shrink-0"
        />
        <span class="min-w-0 truncate text-label-sm text-(--text-default)">
          {{ accountName }}
        </span>
      </button>
    </Tooltip>

    <!-- It teleports to the body, so it opens the same way from either host and
         survives the rail being collapsed. -->
    <SwitchAccountDialog v-model:open="dialogOpen" />
  </div>
</template>

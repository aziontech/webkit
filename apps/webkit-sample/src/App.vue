<script setup>
  // Single toast region for the whole app — the store is a singleton, so any
  // toast.error()/toast.success() call from any screen surfaces here. It sits
  // OUTSIDE the RouterView on purpose: a report from a background job (see
  // src/lib/deploy-runs.js) has to outlive the page that started it.
  //
  // AppToaster is the webkit Toaster with one thing added: the anatomy a failed
  // async deployment needs (retry + an escape to the module that owns it).
  // Every other toast renders the standard body.
  import AppToaster from '@console/components/shell/AppToaster.vue'
  // The wire that stands in for the page while an expired session is torn down.
  // Mounted HERE, beside the toaster and outside the RouterView, for the same
  // reason: it has to survive the route change it covers — the console goes out
  // and Sign In comes in underneath it, and neither frame is ever seen.
  import SessionWire from '@console/components/shell/SessionWire.vue'
  // Which version of the sample is in force — an empty account or a populated one.
  // Installed here only to read `?state=` off an incoming link; the mode itself is a
  // module-level singleton that outlives every page (./lib/sample-mode.js).
  import { installSampleMode } from '@console/lib/state/sample-mode'
  // The rest of the pretend account — plan and whether the header can switch
  // accounts (./lib/sample-preset.js). Same shape as the version above: a query
  // read on arrival, then a localStorage singleton.
  import { installSamplePreset } from '@console/lib/state/sample-preset'
  import { installSessionExpiry, useSession } from '@console/lib/state/session'
  // Moving any of the header's three switchers — organization, account,
  // workspace — reloads the page you are on: every module list swaps its rows
  // for skeletons and comes back as the new scope's, and an opened resource
  // retreats to the list that owns it (the id it was addressed by belonged to
  // the scope you left). Wired here, once, because both halves outlive the page
  // that triggered them.
  import { installTenancyReload } from '@console/lib/state/tenancy-reload'
  import { RouterView } from 'vue-router'

  import { router } from './router/index'

  installTenancyReload(router)
  installSessionExpiry(router)
  installSampleMode(router)
  installSamplePreset(router)

  const { expiring } = useSession()
</script>

<template>
  <RouterView />
  <SessionWire v-if="expiring" />
  <AppToaster />
</template>

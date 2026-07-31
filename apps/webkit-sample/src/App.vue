<script setup>
  import { RouterView } from 'vue-router'

  // Single toast region for the whole app — the store is a singleton, so any
  // toast.error()/toast.success() call from any screen surfaces here. It sits
  // OUTSIDE the RouterView on purpose: a report from a background job (see
  // src/lib/deploy-runs.js) has to outlive the page that started it.
  //
  // AppToaster is the webkit Toaster with one thing added: the anatomy a failed
  // async deployment needs (retry + an escape to the module that owns it).
  // Every other toast renders the standard body.
  import AppToaster from './components/ui/AppToaster.vue'
  // Moving any of the header's three switchers — organization, account,
  // workspace — reloads the page you are on: every module list swaps its rows
  // for skeletons and comes back as the new scope's, and an opened resource
  // retreats to the list that owns it (the id it was addressed by belonged to
  // the scope you left). Wired here, once, because both halves outlive the page
  // that triggered them.
  import { installTenancyReload } from './lib/tenancy-reload'
  import { router } from './router'

  installTenancyReload(router)
</script>

<template>
  <RouterView />
  <AppToaster />
</template>

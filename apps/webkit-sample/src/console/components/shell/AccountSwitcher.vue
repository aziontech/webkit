<script setup lang="ts">
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  import { useAccounts } from '../../lib/state/accounts.js'
  import AccountMark from './AccountMark.vue'
  import SwitchAccountDialog from './SwitchAccountDialog.vue'

  interface Props {
    fluid?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    fluid: false
  })

  const { currentAccount } = useAccounts()

  const dialogOpen = ref(false)

  const hintOpen = ref(false)

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

    <SwitchAccountDialog v-model:open="dialogOpen" />
  </div>
</template>

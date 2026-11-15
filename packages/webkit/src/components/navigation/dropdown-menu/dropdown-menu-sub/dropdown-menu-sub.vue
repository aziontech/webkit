<script setup lang="ts">
  import { computed, onMounted, provide, ref, useAttrs, useId } from 'vue'

  import { DropdownMenuSubInjectionKey, useDropdownContext } from '../injection-key'

  defineOptions({
    name: 'DropdownMenuSub',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  export interface DropdownMenuSubProps {
    /** Opens the sub-menu when its parent panel opens; the user can still close it. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<DropdownMenuSubProps>(), {
    defaultOpen: false
  })

  const attrs = useAttrs()
  const parent = useDropdownContext()
  const uid = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'dropdown-menu-sub')

  const isOpen = computed(() => parent.activeSub.value === uid)
  const focusOnOpen = ref(false)
  const triggerEl = ref<globalThis.HTMLElement | null>(null)

  function setOpen(value: boolean, focusFirst = false) {
    focusOnOpen.value = value && focusFirst
    if (value) parent.setActiveSub(uid)
    else if (parent.activeSub.value === uid) parent.setActiveSub(null)
  }

  onMounted(() => {
    if (props.defaultOpen) setOpen(true)
  })

  provide(DropdownMenuSubInjectionKey, {
    id: uid,
    triggerId: `${uid}-sub-trigger`,
    contentId: `${uid}-sub-content`,
    isOpen,
    setOpen,
    focusOnOpen,
    triggerEl,
    parent
  })
</script>

<template>
  <div
    v-bind="attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    class="contents"
  >
    <slot />
  </div>
</template>

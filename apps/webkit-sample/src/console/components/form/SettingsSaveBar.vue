<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import { nextTick, onScopeDispose, ref, watch } from 'vue'

  import UnsavedChangesGuard from './UnsavedChangesGuard.vue'

  interface Props {
    dirty?: boolean
    saving?: boolean
    label?: string
    hint?: string
    routeGuard?: boolean
  }

  withDefaults(defineProps<Props>(), {
    dirty: false,
    saving: false,
    label: 'You have unsaved changes.',
    hint: '',
    routeGuard: true
  })

  const emit = defineEmits<{
    save: []
    discard: []
  }>()

  const strip = ref(null)
  const shell = ref(null)
  const reserved = ref(0)
  let observer = null

  const publish = (height) => {
    const root = globalThis.document?.documentElement
    if (!root) return
    if (height) root.style.setProperty('--save-bar-inset', `${height}px`)
    else root.style.removeProperty('--save-bar-inset')
  }

  const overflows = (node) => {
    const overflow = getComputedStyle(node).overflowY
    return overflow === 'auto' || overflow === 'scroll'
  }

  const reachableScroll = () => {
    const element = strip.value
    if (!element) return 0
    let total = 0
    let node = element.parentElement
    while (node && node !== globalThis.document?.body) {
      if (overflows(node)) {
        total += node.scrollHeight - node.clientHeight
        break
      }
      node = node.parentElement
    }
    for (const sibling of element.parentElement?.children ?? []) {
      if (sibling !== element && overflows(sibling))
        total += sibling.scrollHeight - sibling.clientHeight
    }
    return total
  }

  let measured = -1

  const measure = async (element) => {
    const height = element ? element.offsetHeight : 0
    if (height === measured) return
    measured = height
    publish(height)
    if (reserved.value) {
      reserved.value = 0
      await nextTick()
    }
    if (!height) return
    const before = reachableScroll()
    reserved.value = height
    await nextTick()
    if (reachableScroll() <= before) reserved.value = 0
  }

  watch(shell, (element) => {
    observer?.disconnect()
    observer = null
    if (!element) return measure(null)
    observer = new globalThis.ResizeObserver(() => measure(element))
    observer.observe(element)
    measure(element)
  })

  onScopeDispose(() => {
    observer?.disconnect()
    publish(0)
  })
</script>

<template>
  <Transition
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="translate-y-2 opacity-0"
  >
    <footer
      v-if="dirty || saving"
      ref="strip"
      class="sticky bottom-0 z-10 h-0 shrink-0"
      :style="reserved ? { height: `${reserved}px` } : null"
    >
      <div
        ref="shell"
        class="absolute inset-x-0 bottom-0 border-t border-(--border-default) bg-(--bg-canvas) lg:h-14"
      >
        <div
          class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0"
        >
          <div class="flex min-w-0 items-start gap-(--spacing-xs)">
            <i
              class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <p class="min-w-0 text-body-sm text-(--text-default)">
              {{ label }}
              <span
                v-if="hint"
                class="text-(--text-muted)"
                >{{ hint }}</span
              >
            </p>
          </div>
          <div
            class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)"
          >
            <Button
              type="button"
              label="Discard"
              kind="outlined"
              size="medium"
              :disabled="saving"
              @click="emit('discard')"
            />
            <Button
              label="Save"
              kind="primary"
              size="medium"
              :loading="saving"
              @click="emit('save')"
            />
          </div>
        </div>
      </div>
    </footer>
  </Transition>

  <UnsavedChangesGuard
    savable
    :route-guard="routeGuard"
    :dirty="dirty"
    :saving="saving"
    @save="emit('save')"
    @discard="emit('discard')"
  />
</template>

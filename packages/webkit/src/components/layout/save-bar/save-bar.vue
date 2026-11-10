<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /** `floating` overlays the bottom of the scroll region without moving the content, `docked` takes its own row at the bottom, `plain` closes a form column with its actions on the right. */
  export type SaveBarKind = 'floating' | 'docked' | 'plain'

  defineOptions({
    name: 'SaveBar',
    inheritAttrs: false
  })

  interface Props {
    /** How the bar sits at the bottom of its scroll region. */
    kind?: SaveBarKind
  }

  withDefaults(defineProps<Props>(), {
    kind: 'floating'
  })

  defineSlots<{
    /** The status sentence on the left, such as You have unsaved changes. */
    default(): unknown
    /** Discard or Cancel, then Save, on the right. */
    actions(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-save-bar')
</script>

<template>
  <footer
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    class="group/save-bar sticky bottom-0 z-10 shrink-0 data-[kind=floating]:h-0 data-[kind=plain]:border-t-(length:--border-width-default) data-[kind=plain]:border-(--border-muted) data-[kind=plain]:bg-(--bg-surface)"
  >
    <div
      class="group-data-[kind=docked]/save-bar:border-t group-data-[kind=docked]/save-bar:border-(--border-default) group-data-[kind=docked]/save-bar:bg-(--bg-canvas) group-data-[kind=docked]/save-bar:lg:h-14 group-data-[kind=floating]/save-bar:absolute group-data-[kind=floating]/save-bar:inset-x-0 group-data-[kind=floating]/save-bar:bottom-0 group-data-[kind=floating]/save-bar:border-t group-data-[kind=floating]/save-bar:border-(--border-default) group-data-[kind=floating]/save-bar:bg-(--bg-canvas) group-data-[kind=floating]/save-bar:lg:h-14"
    >
      <div
        v-if="kind === 'plain'"
        class="layout-column-form layout-boundary-inline flex items-center justify-end gap-(--spacing-sm) py-(--spacing-md)"
      >
        <div
          v-if="$slots['default']"
          :data-testid="`${testId}__message`"
          class="mr-auto flex min-w-0 items-start gap-(--spacing-xs)"
        >
          <i
            class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
            aria-hidden="true"
          />
          <p class="min-w-0 text-body-sm text-(--text-default)">
            <slot />
          </p>
        </div>
        <div
          :data-testid="`${testId}__actions`"
          class="flex items-center gap-(--spacing-sm)"
        >
          <slot name="actions" />
        </div>
      </div>
      <div
        v-else
        class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0"
      >
        <div
          v-if="$slots['default']"
          :data-testid="`${testId}__message`"
          class="flex min-w-0 items-start gap-(--spacing-xs)"
        >
          <i
            class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
            aria-hidden="true"
          />
          <p class="min-w-0 text-body-sm text-(--text-default)">
            <slot />
          </p>
        </div>
        <div
          :data-testid="`${testId}__actions`"
          class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /** `floating` overlays the bottom of the scroll region without moving the content, `docked` takes its own row at the bottom, `plain` closes a form column with its actions on the right, `fade` closes a wizard step with no border, the content fading into the canvas above it, `centered` floats the actions as a raised card centred over the bottom of a create page. */
  export type SaveBarKind = 'floating' | 'docked' | 'plain' | 'fade' | 'centered'

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
    /** Replaces the leading region (icon and sentence) with custom content, such as a status. */
    leading(): unknown
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
    class="group/save-bar @container/save-bar sticky bottom-0 z-10 shrink-0 data-[kind=floating]:h-0 data-[kind=plain]:border-t-(length:--border-width-default) data-[kind=plain]:border-(--border-muted) data-[kind=plain]:bg-(--bg-surface) data-[kind=fade]:bg-linear-to-b data-[kind=fade]:from-transparent data-[kind=fade]:to-(--bg-canvas) data-[kind=centered]:pointer-events-none"
  >
    <div
      class="group-data-[kind=docked]/save-bar:border-t group-data-[kind=docked]/save-bar:border-(--border-default) group-data-[kind=docked]/save-bar:bg-(--bg-canvas) group-data-[kind=docked]/save-bar:@xl/save-bar:h-14 group-data-[kind=floating]/save-bar:absolute group-data-[kind=floating]/save-bar:inset-x-0 group-data-[kind=floating]/save-bar:bottom-0 group-data-[kind=floating]/save-bar:border-t group-data-[kind=floating]/save-bar:border-(--border-default) group-data-[kind=floating]/save-bar:bg-(--bg-canvas) group-data-[kind=floating]/save-bar:@xl/save-bar:h-14"
    >
      <div
        v-if="kind === 'plain'"
        class="layout-column-form layout-boundary-inline flex items-center justify-end gap-(--spacing-sm) py-(--spacing-md) @max-md/save-bar:flex-col @max-md/save-bar:items-stretch"
      >
        <div
          v-if="$slots['leading'] || $slots['default']"
          :data-testid="`${testId}__message`"
          class="me-auto flex min-w-0 items-start gap-(--spacing-xs) @max-md/save-bar:me-0"
        >
          <slot name="leading">
            <i
              class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <p class="min-w-0 text-body-sm text-(--text-default)">
              <slot />
            </p>
          </slot>
        </div>
        <div
          :data-testid="`${testId}__actions`"
          class="flex items-center gap-(--spacing-sm) @max-md/save-bar:flex-col-reverse @max-md/save-bar:items-stretch @max-md/save-bar:gap-(--spacing-xs)"
        >
          <slot name="actions" />
        </div>
      </div>
      <div
        v-else-if="kind === 'centered'"
        class="flex justify-center px-(--spacing-md) pt-(--spacing-xl) pb-[max(var(--spacing-lg),env(safe-area-inset-bottom))]"
      >
        <div
          :data-testid="`${testId}__card`"
          class="pointer-events-auto flex max-w-full min-w-0 items-center gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-xs) shadow-(--shadow-lg)"
        >
          <div
            v-if="$slots['leading'] || $slots['default']"
            :data-testid="`${testId}__message`"
            class="flex min-w-0 items-center gap-(--spacing-xs) ps-(--spacing-xs)"
          >
            <slot name="leading">
              <i
                class="pi pi-info-circle shrink-0 text-body-sm text-(--text-muted)"
                aria-hidden="true"
              />
              <p class="min-w-0 truncate text-body-sm text-(--text-default)">
                <slot />
              </p>
            </slot>
          </div>
          <div
            :data-testid="`${testId}__actions`"
            class="flex shrink-0 items-center gap-(--spacing-sm)"
          >
            <slot name="actions" />
          </div>
        </div>
      </div>
      <div
        v-else-if="kind === 'fade'"
        class="layout-column-form layout-boundary-inline flex items-center justify-end gap-(--spacing-sm) pt-(--spacing-xl) pb-(--spacing-lg)"
      >
        <div
          v-if="$slots['leading'] || $slots['default']"
          :data-testid="`${testId}__message`"
          class="me-auto flex min-w-0 items-center gap-(--spacing-xs)"
        >
          <slot name="leading">
            <i
              class="pi pi-info-circle shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <p class="min-w-0 text-body-sm text-(--text-default)">
              <slot />
            </p>
          </slot>
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
        class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) pt-(--spacing-sm) pb-[max(var(--spacing-sm),env(safe-area-inset-bottom))] @xl/save-bar:h-full @xl/save-bar:flex-row @xl/save-bar:flex-wrap @xl/save-bar:items-center @xl/save-bar:justify-between @xl/save-bar:gap-x-(--spacing-xl) @xl/save-bar:py-0"
      >
        <div
          v-if="$slots['leading'] || $slots['default']"
          :data-testid="`${testId}__message`"
          class="flex min-w-0 items-start gap-(--spacing-xs)"
        >
          <slot name="leading">
            <i
              class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <p class="min-w-0 text-body-sm text-(--text-default)">
              <slot />
            </p>
          </slot>
        </div>
        <div
          :data-testid="`${testId}__actions`"
          class="flex flex-col-reverse gap-(--spacing-xs) @xl/save-bar:ms-auto @xl/save-bar:shrink-0 @xl/save-bar:flex-row @xl/save-bar:items-center @xl/save-bar:gap-(--spacing-sm)"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </footer>
</template>

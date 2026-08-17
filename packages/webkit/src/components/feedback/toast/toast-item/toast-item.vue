<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Spinner from '../../../utils/spinner/spinner.vue'
  import type { ToastType } from '../use-toast-store'

  defineOptions({
    name: 'ToastItem',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Severity / lifecycle variant; drives the leading icon color. */
      type?: ToastType
    }>(),
    {
      type: 'default'
    }
  )

  defineSlots<{
    /** Title + description column. */
    default(): unknown
    /** Trailing region, right-aligned and vertically centered (e.g. the action button). */
    trailing(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast__item'
  )

  // Assertive surfaces (error / warning) announce as alerts; the rest are status.
  const role = computed(() =>
    props.type === 'error' || props.type === 'warning' ? 'alert' : 'status'
  )

  // No leading icon for the neutral `default` toast — only the typed variants.
  // `default` shows no icon; `loading` renders the spinning <Spinner/> (below),
  // not a glyph — so both map to an empty glyph here.
  const icons: Record<ToastType, string> = {
    default: '',
    success: 'pi pi-check',
    info: 'pi pi-info-circle',
    warning: 'pi pi-exclamation-triangle',
    error: 'pi pi-exclamation-circle',
    loading: ''
  }
  const icon = computed(() => icons[props.type])
</script>

<template>
  <div
    v-bind="$attrs"
    :role="role"
    :data-testid="testId"
    :data-type="type"
    class="group pointer-events-auto relative flex w-full items-start gap-(--spacing-sm) rounded-(--shape-elements) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm) text-(--text-default) shadow-(--shadow-sm)"
  >
    <div class="flex min-w-0 flex-1 items-start gap-(--spacing-sm)">
      <!--
        The leading glyph gets the TITLE'S LINE BOX, not its own height: `h-[1lh]` on a box
        carrying `text-label-md` resolves to exactly the leading `ToastTitle` uses, so the
        glyph is centred on the first line whether the card is one line or four. Centring it
        on the whole card (the old `self-center` / `items-center`) put it beside the middle
        of a wrapped message, pointing at nothing.
      -->
      <span
        v-if="type === 'loading' || icon"
        class="flex h-[1lh] shrink-0 items-center text-label-md"
        aria-hidden="true"
      >
        <Spinner
          v-if="type === 'loading'"
          class="size-4 text-(--text-muted)"
        />
        <i
          v-else
          :class="icon"
          :data-type="type"
          class="leading-none text-(--text-muted) data-[type=success]:text-(--success-contrast) data-[type=info]:text-(--info-contrast) data-[type=warning]:text-(--warning-contrast) data-[type=error]:text-(--danger-contrast)"
        />
      </span>
      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
        <slot />
      </div>
    </div>
    <!--
      Also on the first line, for the same reason: an action floating at the vertical middle
      of a wrapped card reads as detached from the sentence it acts on. The negative top
      margin is what puts the control's own text back on the title's baseline row.
    -->
    <div
      v-if="$slots['trailing']"
      class="-my-(--spacing-xxs) -mr-(--spacing-xs) flex shrink-0 items-center gap-(--spacing-xxs)"
    >
      <slot name="trailing" />
    </div>
  </div>
</template>

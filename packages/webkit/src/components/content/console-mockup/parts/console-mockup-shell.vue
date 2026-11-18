<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onMounted, onScopeDispose, provide, readonly, ref, useAttrs, watch } from 'vue'

  import Button from '../../../action/button/button.vue'
  import HighlightButton from '../../../action/highlight-button/highlight-button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Texture, {
    type TextureFade,
    type TextureVariant
  } from '../../../content/texture/texture.vue'
  import Avatar from '../../avatar/avatar.vue'
  import Brand from '../../brand/brand.vue'
  import Kbd from '../../kbd/kbd.vue'
  import { ConsoleMockupShellInjectionKey } from '../injection-key'

  defineOptions({ name: 'ConsoleMockupShell', inheritAttrs: false })

  /** How the mockup is plated: a bordered console window, or bare parts floating on the host's surface. */
  export type ConsoleMockupShellVariant = 'window' | 'bare'
  /** Console generation the shell draws: the current one, or the previous one with its top bar. */
  export type ConsoleMockupShellShell = 'console' | 'legacy'
  /** Edge the mockup fades out along; y fades top and bottom. */
  export type ConsoleMockupShellFade = 'none' | 'bottom' | 'top' | 'left' | 'right' | 'y'
  /** Duration tokens the entrance timing can be set to. */
  export type ConsoleMockupShellDuration =
    'fast-01' | 'fast-02' | 'moderate-01' | 'moderate-02' | 'slow-01' | 'slow-02'

  interface Props {
    /** How the mockup is plated: a bordered console window, or bare parts floating on the host's surface. */
    variant?: ConsoleMockupShellVariant
    /** Console generation the shell draws: the current one, or the previous one with its top bar. */
    shell?: ConsoleMockupShellShell
    /** Design width of the frame from `md` up; the frame scales to fit its host. */
    width?: number
    /** Design width of the frame below `md`. */
    mobileWidth?: number
    /** Edge the mockup fades out along; `y` fades top and bottom. */
    fade?: ConsoleMockupShellFade
    /** Draws the console bar over the body. */
    chrome?: boolean
    /** Module label on the console bar; with a rail, `›` splits it into breadcrumbs. */
    title?: string
    /** Active entry of the console's side rail; empty renders no rail. */
    rail?: string
    /** Texture the frame is grounded with, behind the body. */
    texture?: TextureVariant
    /** How the frame's texture fades out before its edges. */
    textureFade?: TextureFade
    /** Duration token of each part's travel. */
    travel?: ConsoleMockupShellDuration
    /** Duration token of the gap between one part's beat and the next. */
    beat?: ConsoleMockupShellDuration
    /** Whether this mockup is the one showing; parts replay their entrance each time it becomes active. */
    active?: boolean
    /** Lets the viewer operate the controls inside instead of drawing them as an inert picture. */
    interactive?: boolean
    /** Plays the entrance as the frame comes into view and replays it when `active` turns back on. Off draws every part in place from the start, with no entrance and no replay. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'window',
    shell: 'console',
    width: 860,
    mobileWidth: 390,
    fade: 'none',
    chrome: true,
    title: '',
    rail: '',
    texture: 'none',
    textureFade: 'vignette',
    travel: 'slow-01',
    beat: 'fast-01',
    active: true,
    interactive: false,
    animated: true
  })

  defineSlots<{
    /** The mockup's body, composed of ConsoleMockupShell.Part beats. */
    default(): unknown
    /** A layer over the whole frame, bar and rail included, such as a drawer. */
    overlay(): unknown
  }>()

  const attrs = useAttrs()

  const RAIL = [
    {
      key: 'start',
      label: '',
      entries: [
        { key: 'overview', icon: 'az az-home', label: 'Overview' },
        { key: 'workloads', icon: 'az az-workloads', label: 'Workloads' },
        { key: 'deployments', icon: 'az az-deploy-pillar', label: 'Deployments' }
      ]
    },
    {
      key: 'build',
      label: 'Build',
      entries: [
        { key: 'applications', icon: 'az az-applications', label: 'Applications' },
        { key: 'functions', icon: 'az az-functions', label: 'Functions' },
        { key: 'variables', icon: 'az az-variables', label: 'Variables' },
        { key: 'connectors', icon: 'az az-connectors', label: 'Connectors' },
        { key: 'custom-pages', icon: 'az az-custom-pages', label: 'Custom Pages' }
      ]
    },
    {
      key: 'secure',
      label: 'Secure',
      entries: [
        { key: 'firewall', icon: 'az az-firewall', label: 'Firewall' },
        { key: 'edge-dns', icon: 'az az-edge-dns', label: 'Edge DNS' },
        { key: 'waf-rules', icon: 'az az-waf', label: 'WAF Rules' },
        {
          key: 'certificate-manager',
          icon: 'az az-certificate-manager',
          label: 'Certificate Manager'
        }
      ]
    }
  ]

  const LEGACY_TOKENS = {
    '--text-label-lg-font-weight': '500',
    '--text-label-md-font-weight': '500',
    '--text-label-sm-font-weight': '500',
    '--text-button-lg-font-weight': '600',
    '--text-button-md-font-weight': '600',
    '--text-tag-sm-font-weight': '600',
    '--text-tag-md-font-weight': '600',
    '--text-tag-sm-font-size': '0.6875rem',
    '--text-body-lg-line-height': '1.5',
    '--text-body-md-line-height': '1.5',
    '--text-body-sm-line-height': '1.5',
    '--text-body-xs-line-height': '1.5'
  }

  const rootEl = ref<globalThis.HTMLElement | null>(null)
  const frame = ref({ width: props.width, height: 600, scale: 1 })

  const reduced = ref(false)

  const entered = ref(!props.animated)
  const onScreen = ref(false)

  let observer: globalThis.ResizeObserver | null = null
  let intersection: globalThis.IntersectionObserver | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'console-mockup-shell'
  )

  const crumbs = computed(() =>
    props.title
      .split('›')
      .map((crumb) => crumb.trim())
      .filter(Boolean)
  )

  const frameStyle = computed(() => ({
    width: `${frame.value.width}px`,
    height: `${frame.value.height}px`,
    transform: `scale(${frame.value.scale})`,
    ...(props.shell === 'legacy' ? LEGACY_TOKENS : {})
  }))

  onMounted(() => {
    reduced.value = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    if (reduced.value) entered.value = true
    if (typeof globalThis.ResizeObserver === 'function') {
      observer = new globalThis.ResizeObserver(measure)
      if (rootEl.value) observer.observe(rootEl.value)
    }
    measure()
  })

  watch(() => [props.width, props.mobileWidth], measure)

  watch(
    () => props.active,
    (active) => {
      if (reduced.value || !props.animated) return
      if (active) arm()
      else entered.value = false
    }
  )

  watch(
    rootEl,
    (element) => {
      intersection?.disconnect()
      if (!element || typeof globalThis.IntersectionObserver !== 'function') return
      intersection = new globalThis.IntersectionObserver(
        ([entry]) => {
          onScreen.value = Boolean(entry?.isIntersecting)
          arm()
        },
        { threshold: 0.3 }
      )
      intersection.observe(element)
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    observer?.disconnect()
    intersection?.disconnect()
  })

  function measure() {
    const host = rootEl.value
    if (!host?.offsetWidth) return
    const mobile = !(globalThis.matchMedia?.('(min-width: 768px)')?.matches ?? true)
    const width = mobile ? props.mobileWidth : props.width
    const scale = host.offsetWidth / width
    frame.value = { width, height: host.offsetHeight / scale, scale }
  }

  function arm() {
    if (reduced.value || !props.animated || entered.value || !onScreen.value || !props.active)
      return
    globalThis.requestAnimationFrame(() =>
      globalThis.requestAnimationFrame(() => {
        if (onScreen.value && props.active) entered.value = true
      })
    )
  }

  function beatStyle(order: number): Record<string, string> {
    if (reduced.value || !props.animated)
      return {
        '--console-mockup-shell-item-duration': '0ms',
        '--console-mockup-shell-item-delay': '0ms'
      }
    return {
      '--console-mockup-shell-item-duration': duration[props.travel],
      '--console-mockup-shell-item-delay': `${Math.round(globalThis.parseFloat(duration[props.beat]) * order)}ms`
    }
  }

  provide(ConsoleMockupShellInjectionKey, { entered: readonly(entered), beatStyle })
</script>

<template>
  <figure
    ref="rootEl"
    v-bind="$attrs"
    :data-testid="testId"
    :inert="interactive ? undefined : true"
    :aria-hidden="interactive ? undefined : 'true'"
    :data-interactive="interactive || null"
    :data-variant="variant"
    :data-fade="fade"
    class="relative m-0 h-full w-full min-w-0 overflow-hidden select-none pointer-events-none data-interactive:pointer-events-auto data-interactive:select-auto data-[variant=bare]:overflow-x-visible data-[variant=bare]:overflow-y-clip data-[variant=window]:rounded-(--shape-card) data-[variant=window]:bg-(--bg-canvas) data-[variant=window]:[background-clip:var(--illustration-rim-boxes,padding-box,border-box,border-box)] data-[variant=window]:[background-image:linear-gradient(var(--bg-canvas),var(--bg-canvas)),var(--illustration-rim,linear-gradient(135deg,var(--border-default)_0%,var(--border-default)_18%,transparent_45%,transparent_55%,var(--border-default)_82%,var(--border-default)_100%)),linear-gradient(var(--bg-canvas),var(--bg-canvas))] data-[variant=window]:[background-origin:var(--illustration-rim-boxes,padding-box,border-box,border-box)] data-[variant=window]:[border:var(--illustration-rim-width-hairline,var(--border-width-default))_solid_transparent]"
  >
    <div
      :data-variant="variant"
      class="absolute top-0 start-0 flex origin-top-left rtl:origin-top-right flex-col data-[variant=window]:bg-(--bg-canvas)"
      :style="frameStyle"
    >
      <Texture
        :variant="texture"
        size="small"
        :fade="textureFade"
      />

      <div
        v-if="chrome && !rail && shell === 'console'"
        inert
        aria-hidden="true"
        class="relative z-10 flex h-11 shrink-0 items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md)"
      >
        <span class="inline-flex shrink-0 items-center">
          <Brand
            variant="default"
            size="small"
          />
        </span>
        <span
          v-if="title"
          class="h-4 w-px shrink-0 bg-(--border-default)"
        />
        <span
          v-if="title"
          class="truncate text-label-sm text-(--text-muted)"
          >{{ title }}</span
        >
        <span class="ms-auto inline-flex shrink-0 items-center">
          <Avatar
            label="myemail@example.com"
            size="small"
            variant="square"
          />
        </span>
      </div>

      <div
        v-if="chrome && shell === 'legacy'"
        inert
        aria-hidden="true"
        class="relative z-10 flex h-14 shrink-0 items-center gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xl)"
      >
        <IconButton
          icon="az az-menu"
          variant="outline"
          size="small"
          ariaLabel="Open navigation"
        />
        <Brand
          variant="default"
          size="small"
        />
        <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Create"
            variant="primary"
            size="small"
            icon="az az-plus"
          />
          <HighlightButton
            label="Copilot"
            size="small"
            icon="az az-ask-azion"
          />
          <Button
            label="Feedback"
            variant="outline"
            size="small"
            icon="az az-flag"
          />
          <IconButton
            icon="az az-circle-help"
            variant="outline"
            size="small"
            ariaLabel="Help"
          />
          <IconButton
            icon="az az-user"
            variant="outline"
            size="small"
            ariaLabel="Account"
          />
        </div>
      </div>

      <div class="relative z-10 flex min-h-0 flex-1">
        <div
          v-if="rail && shell === 'console'"
          inert
          aria-hidden="true"
          class="hidden w-64 shrink-0 flex-col border-e border-(--border-default) md:flex"
        >
          <div class="flex h-14 shrink-0 items-center px-(--spacing-md)">
            <Brand
              variant="default"
              size="small"
            />
          </div>
          <div
            class="flex min-h-0 flex-1 flex-col gap-(--spacing-md) overflow-hidden p-(--spacing-sm)"
          >
            <div
              v-for="group in RAIL"
              :key="group.key"
              class="flex flex-col gap-(--spacing-2xs)"
            >
              <span
                v-if="group.label"
                class="px-(--spacing-sm) pb-(--spacing-2xs) text-label-sm text-(--text-muted)"
                >{{ group.label }}</span
              >
              <span
                v-for="entry in group.entries"
                :key="entry.key"
                :data-active="entry.key === rail || null"
                class="flex h-8 items-center gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-sm) text-label-md text-(--text-default) data-active:bg-(--bg-selected)"
              >
                <i
                  :class="entry.icon"
                  class="shrink-0 text-body-md leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="truncate">{{ entry.label }}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="flex min-h-0 min-w-0 flex-1 flex-col">
          <div
            v-if="chrome && rail && shell === 'console'"
            inert
            aria-hidden="true"
            class="flex h-14 shrink-0 items-center gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-md)"
          >
            <ol class="m-0 flex min-w-0 list-none items-center gap-(--spacing-xs) p-0 text-body-sm">
              <template
                v-for="(crumb, index) in crumbs"
                :key="index"
              >
                <i
                  v-if="index > 0"
                  class="az az-chevron-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
                  aria-hidden="true"
                />
                <li
                  :data-active="index === crumbs.length - 1 || null"
                  class="truncate text-(--text-muted) data-active:text-(--text-default)"
                >
                  {{ crumb }}
                </li>
              </template>
            </ol>
            <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
              <span
                class="flex h-8 w-56 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm)"
              >
                <i
                  class="az az-search text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)"
                  >Search</span
                >
                <Kbd
                  meta
                  size="small"
                  >K</Kbd
                >
              </span>
              <Button
                label="Create"
                variant="primary"
                size="medium"
                icon="az az-circle-plus"
              />
              <HighlightButton
                label="Agent"
                size="medium"
                icon="az az-ask-azion"
              />
              <Avatar
                label="myemail@example.com"
                size="small"
                variant="square"
              />
            </div>
          </div>

          <div
            :data-variant="variant"
            class="min-h-0 min-w-0 flex-1 overflow-hidden data-[variant=bare]:overflow-x-visible data-[variant=bare]:overflow-y-clip"
          >
            <slot />
          </div>
        </div>
      </div>

      <div
        v-if="$slots['overlay']"
        class="absolute inset-0 z-30 overflow-hidden"
      >
        <slot name="overlay" />
      </div>
    </div>

    <div
      v-if="fade !== 'none'"
      :data-fade="fade"
      class="pointer-events-none absolute inset-0 z-20 data-[fade=bottom]:[background-image:linear-gradient(to_bottom,transparent_var(--console-mockup-fade-start,55%),var(--console-mockup-fade-color,var(--bg-canvas))_var(--console-mockup-fade-end,100%))] data-[fade=left]:[background-image:linear-gradient(to_left,transparent_var(--console-mockup-fade-start,55%),var(--console-mockup-fade-color,var(--bg-canvas))_var(--console-mockup-fade-end,100%))] data-[fade=right]:[background-image:linear-gradient(to_right,transparent_var(--console-mockup-fade-start,55%),var(--console-mockup-fade-color,var(--bg-canvas))_var(--console-mockup-fade-end,100%))] data-[fade=top]:[background-image:linear-gradient(to_top,transparent_var(--console-mockup-fade-start,55%),var(--console-mockup-fade-color,var(--bg-canvas))_var(--console-mockup-fade-end,100%))] data-[fade=y]:[background-image:linear-gradient(to_bottom,var(--console-mockup-fade-color,var(--bg-canvas))_0%,transparent_var(--console-mockup-fade-edge,22%),transparent_calc(100%-var(--console-mockup-fade-edge,22%)),var(--console-mockup-fade-color,var(--bg-canvas))_100%)]"
    />
  </figure>
</template>

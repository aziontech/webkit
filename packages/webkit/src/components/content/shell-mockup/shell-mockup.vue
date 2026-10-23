<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onMounted, onScopeDispose, provide, readonly, ref, useAttrs, watch } from 'vue'

  import Button from '../../actions/button/button.vue'
  import ButtonHighlight from '../../actions/button-highlight/button-highlight.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Avatar from '../../avatar/avatar.vue'
  import TextureMaterial, {
    type TextureMaterialFade,
    type TextureMaterialKind
  } from '../../marketing/texture-material/texture-material.vue'
  import Brand from '../brand/brand.vue'
  import Kbd from '../kbd/kbd.vue'
  import { SHELL_MOCKUP_KEY } from './injection-key'

  defineOptions({ name: 'ShellMockup', inheritAttrs: false })

  /** How the mockup is plated: a bordered console window, or bare parts floating on the host's surface. */
  export type ShellMockupKind = 'window' | 'bare'
  /** Console generation the shell draws: the current one, or the previous one with its top bar. */
  export type ShellMockupShell = 'console' | 'legacy'
  /** Edge the mockup fades out along; y fades top and bottom. */
  export type ShellMockupFade = 'none' | 'bottom' | 'top' | 'left' | 'right' | 'y'
  /** Duration tokens the entrance timing can be set to. */
  export type ShellMockupDuration =
    'fast-01' | 'fast-02' | 'moderate-01' | 'moderate-02' | 'slow-01' | 'slow-02'

  interface Props {
    /** How the mockup is plated: a bordered console window, or bare parts floating on the host's surface. */
    kind?: ShellMockupKind
    /** Console generation the shell draws: the current one, or the previous one with its top bar. */
    shell?: ShellMockupShell
    /** Design width of the frame from `md` up; the frame scales to fit its host. */
    width?: number
    /** Design width of the frame below `md`. */
    mobileWidth?: number
    /** Edge the mockup fades out along; `y` fades top and bottom. */
    fade?: ShellMockupFade
    /** Draws the console bar over the body. */
    chrome?: boolean
    /** Module label on the console bar; with a rail, `›` splits it into breadcrumbs. */
    title?: string
    /** Active entry of the console's side rail; empty renders no rail. */
    rail?: string
    /** Texture the frame is grounded with, behind the body. */
    texture?: TextureMaterialKind
    /** How the frame's texture fades out before its edges. */
    textureFade?: TextureMaterialFade
    /** Duration token of each part's travel. */
    travel?: ShellMockupDuration
    /** Duration token of the gap between one part's beat and the next. */
    beat?: ShellMockupDuration
    /** Whether this mockup is the one showing; parts replay their entrance each time it becomes active. */
    active?: boolean
    /** Lets the viewer operate the controls inside instead of drawing them as an inert picture. */
    interactive?: boolean
    /** Draws every part in place from the start, with no entrance and no replay. */
    still?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'window',
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
    still: false
  })

  defineSlots<{
    /** The mockup's body, composed of ShellMockup.Part beats. */
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
        { key: 'overview', icon: 'pi pi-home', label: 'Overview' },
        { key: 'workloads', icon: 'ai ai-workloads', label: 'Workloads' },
        { key: 'deployments', icon: 'ai ai-deploy-pillar', label: 'Deployments' }
      ]
    },
    {
      key: 'build',
      label: 'Build',
      entries: [
        { key: 'applications', icon: 'ai ai-edge-application', label: 'Applications' },
        { key: 'functions', icon: 'ai ai-edge-functions', label: 'Functions' },
        { key: 'variables', icon: 'ai ai-variables', label: 'Variables' },
        { key: 'connectors', icon: 'ai ai-edge-connectors', label: 'Connectors' },
        { key: 'custom-pages', icon: 'ai ai-custom-pages', label: 'Custom Pages' }
      ]
    },
    {
      key: 'secure',
      label: 'Secure',
      entries: [
        { key: 'firewall', icon: 'ai ai-edge-firewall', label: 'Firewall' },
        { key: 'edge-dns', icon: 'ai ai-edge-dns', label: 'Edge DNS' },
        { key: 'waf-rules', icon: 'ai ai-waf-rules', label: 'WAF Rules' },
        {
          key: 'certificate-manager',
          icon: 'ai ai-certificate-manager',
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

  const root = ref<globalThis.HTMLElement | null>(null)
  const frame = ref({ width: props.width, height: 600, scale: 1 })

  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

  const entered = ref(reduced || props.still)
  const onScreen = ref(false)

  let observer: globalThis.ResizeObserver | null = null
  let intersection: globalThis.IntersectionObserver | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-shell-mockup'
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
    if (typeof globalThis.ResizeObserver === 'function') {
      observer = new globalThis.ResizeObserver(measure)
      if (root.value) observer.observe(root.value)
    }
    measure()
  })

  watch(() => [props.width, props.mobileWidth], measure)

  watch(
    () => props.active,
    (active) => {
      if (reduced || props.still) return
      if (active) arm()
      else entered.value = false
    }
  )

  watch(
    root,
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
    const box = root.value?.getBoundingClientRect()
    if (!box?.width) return
    const mobile = !(globalThis.matchMedia?.('(min-width: 768px)')?.matches ?? true)
    const width = mobile ? props.mobileWidth : props.width
    const scale = box.width / width
    frame.value = { width, height: box.height / scale, scale }
  }

  function arm() {
    if (reduced || props.still || entered.value || !onScreen.value || !props.active) return
    globalThis.requestAnimationFrame(() =>
      globalThis.requestAnimationFrame(() => {
        if (onScreen.value && props.active) entered.value = true
      })
    )
  }

  function beatStyle(order: number): Record<string, string> {
    if (reduced || props.still) return { '--part-duration': '0ms', '--part-delay': '0ms' }
    return {
      '--part-duration': duration[props.travel],
      '--part-delay': `${Math.round(globalThis.parseFloat(duration[props.beat]) * order)}ms`
    }
  }

  provide(SHELL_MOCKUP_KEY, { entered: readonly(entered), beatStyle })
</script>

<template>
  <figure
    ref="root"
    v-bind="$attrs"
    :data-testid="testId"
    :inert="interactive ? undefined : true"
    :aria-hidden="interactive ? undefined : 'true'"
    :data-interactive="interactive || null"
    :data-kind="kind"
    :data-fade="fade"
    class="relative m-0 h-full w-full min-w-0 overflow-hidden select-none pointer-events-none data-interactive:pointer-events-auto data-interactive:select-auto data-[kind=bare]:overflow-x-visible data-[kind=bare]:overflow-y-clip data-[kind=window]:rounded-(--shape-card) data-[kind=window]:bg-(--bg-canvas) data-[kind=window]:[background-clip:var(--illustration-rim-boxes,padding-box,border-box,border-box)] data-[kind=window]:[background-image:linear-gradient(var(--bg-canvas),var(--bg-canvas)),var(--illustration-rim,linear-gradient(135deg,var(--border-default)_0%,var(--border-default)_18%,transparent_45%,transparent_55%,var(--border-default)_82%,var(--border-default)_100%)),linear-gradient(var(--bg-canvas),var(--bg-canvas))] data-[kind=window]:[background-origin:var(--illustration-rim-boxes,padding-box,border-box,border-box)] data-[kind=window]:[border:var(--illustration-rim-width-hairline,var(--border-width-default))_solid_transparent]"
  >
    <div
      :data-kind="kind"
      class="absolute top-0 left-0 flex origin-top-left flex-col data-[kind=window]:bg-(--bg-canvas)"
      :style="frameStyle"
    >
      <TextureMaterial
        :kind="texture"
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
            kind="default"
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
        <span class="ml-auto inline-flex shrink-0 items-center">
          <Avatar
            label="myemail@example.com"
            size="small"
            kind="square"
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
          icon="pi pi-bars"
          kind="outlined"
          size="small"
          ariaLabel="Open navigation"
        />
        <Brand
          kind="default"
          size="small"
        />
        <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            label="Create"
            kind="primary"
            size="small"
            icon="pi pi-plus"
          />
          <ButtonHighlight
            label="Copilot"
            size="small"
            icon="ai ai-ask-azion"
          />
          <Button
            label="Feedback"
            kind="outlined"
            size="small"
            icon="pi pi-flag"
          />
          <IconButton
            icon="pi pi-question-circle"
            kind="outlined"
            size="small"
            ariaLabel="Help"
          />
          <IconButton
            icon="pi pi-user"
            kind="outlined"
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
          class="hidden w-64 shrink-0 flex-col border-r border-(--border-default) md:flex"
        >
          <div class="flex h-14 shrink-0 items-center px-(--spacing-md)">
            <Brand
              kind="default"
              size="small"
            />
          </div>
          <div
            class="flex min-h-0 flex-1 flex-col gap-(--spacing-md) overflow-hidden p-(--spacing-sm)"
          >
            <div
              v-for="group in RAIL"
              :key="group.key"
              class="flex flex-col gap-(--spacing-xxs)"
            >
              <span
                v-if="group.label"
                class="px-(--spacing-sm) pb-(--spacing-xxs) text-label-sm text-(--text-muted)"
                >{{ group.label }}</span
              >
              <span
                v-for="entry in group.entries"
                :key="entry.key"
                :data-active="entry.key === rail || null"
                class="flex h-8 items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-sm) text-label-md text-(--text-default) data-active:bg-(--bg-selected)"
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
                  class="pi pi-angle-right shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <li
                  :data-current="index === crumbs.length - 1 || null"
                  class="truncate text-(--text-muted) data-current:text-(--text-default)"
                >
                  {{ crumb }}
                </li>
              </template>
            </ol>
            <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
              <span
                class="flex h-8 w-56 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm)"
              >
                <i
                  class="pi pi-search text-(--text-muted)"
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
                kind="primary"
                size="medium"
                icon="pi pi-plus-circle"
              />
              <ButtonHighlight
                label="Agent"
                size="medium"
                icon="ai ai-ask-azion"
              />
              <Avatar
                label="myemail@example.com"
                size="small"
                kind="square"
              />
            </div>
          </div>

          <div
            :data-kind="kind"
            class="min-h-0 min-w-0 flex-1 overflow-hidden data-[kind=bare]:overflow-x-visible data-[kind=bare]:overflow-y-clip"
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
      class="pointer-events-none absolute inset-0 z-20 data-[fade=bottom]:[background-image:linear-gradient(to_bottom,transparent_var(--mockup-fade-start,55%),var(--mockup-fade-color,var(--bg-canvas))_var(--mockup-fade-end,100%))] data-[fade=left]:[background-image:linear-gradient(to_left,transparent_var(--mockup-fade-start,55%),var(--mockup-fade-color,var(--bg-canvas))_var(--mockup-fade-end,100%))] data-[fade=right]:[background-image:linear-gradient(to_right,transparent_var(--mockup-fade-start,55%),var(--mockup-fade-color,var(--bg-canvas))_var(--mockup-fade-end,100%))] data-[fade=top]:[background-image:linear-gradient(to_top,transparent_var(--mockup-fade-start,55%),var(--mockup-fade-color,var(--bg-canvas))_var(--mockup-fade-end,100%))] data-[fade=y]:[background-image:linear-gradient(to_bottom,var(--mockup-fade-color,var(--bg-canvas))_0%,transparent_var(--mockup-fade-edge,22%),transparent_calc(100%-var(--mockup-fade-edge,22%)),var(--mockup-fade-color,var(--bg-canvas))_100%)]"
    />
  </figure>
</template>

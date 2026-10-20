<script setup lang="ts">
  import FieldRadio from '@aziontech/webkit/field-radio'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputNumber from '@aziontech/webkit/input-number'
  import Label from '@aziontech/webkit/label'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import LegacySwitch from '../LegacySwitch.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ApplicationCacheFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the form switches to override and scrolls through its fields while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const BEHAVIORS = [
    {
      value: 'honor',
      label: 'Honor cache policies',
      description:
        "Honor cache policies from the origin or define a new maximum cache TTL for the edge. If a TTL isn't received from the origin, cache will be maintained at a default TTL."
    },
    {
      value: 'override',
      label: 'Override cache behavior',
      description: "Customize the cache behavior by overriding the origin server's cache policies."
    }
  ]

  interface Frame {
    behavior: string
    anchor: number
    stale: boolean
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { behavior: 'honor', anchor: 0, stale: false, forward: 0, back: 0 },
    { behavior: 'override', anchor: 0, stale: false, forward: 200, back: 420 },
    { behavior: 'override', anchor: 1, stale: false, forward: 650, back: 420 },
    { behavior: 'override', anchor: 2, stale: false, forward: 900, back: 420 },
    { behavior: 'override', anchor: 2, stale: true, forward: 450, back: 300 },
    { behavior: 'override', anchor: 3, stale: true, forward: 800, back: 120 }
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 72

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const column = ref<globalThis.HTMLElement | null>(null)
  const offsets = ref<number[]>([0, 0, 0, 0])

  const measure = () => {
    const anchors = column.value?.querySelectorAll<globalThis.HTMLElement>('[data-anchor]')
    if (!anchors?.length) return
    offsets.value = [...anchors].map((anchor) => anchor.offsetTop)
  }

  const atRest = computed(() => step.value === 0)

  const scrollStyle = computed(() => ({
    translate: `0 ${atRest.value ? 0 : LEAD - (offsets.value[frame.value.anchor] ?? 0)}px`
  }))

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null
  let observer: globalThis.ResizeObserver | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced) {
      step.value = target
      return
    }
    measure()
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onMounted(() => {
    observer = new globalThis.ResizeObserver(measure)
    if (column.value) observer.observe(column.value)
    measure()
  })

  onScopeDispose(() => {
    halt()
    observer?.disconnect()
  })
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    :fade="atRest ? 'bottom' : 'y'"
    class="[--mockup-fade-edge:24%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="column"
      :style="scrollStyle"
      class="relative flex flex-col gap-(--spacing-lg) py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
    >
      <div class="flex flex-col gap-(--spacing-xs)">
        <Label
          for="browser-max-age"
          label="Max Age"
          required
        />
        <InputNumber
          id="browser-max-age"
          :model-value="600"
          size="medium"
          show-buttons
          aria-label="Browser Max Age"
        />
        <HelperText label="Maximum time (in seconds) content can be cached by the browser." />
      </div>

      <MockupPart
        :order="0"
        data-anchor
      >
        <div class="flex flex-col gap-(--spacing-md)">
          <span class="text-label-sm text-(--text-default)">Cache Behavior</span>
          <FieldRadio
            v-for="behavior in BEHAVIORS"
            :key="behavior.value"
            :model-value="frame.behavior"
            name="cache-behavior"
            :value="behavior.value"
            :label="behavior.label"
            :description="behavior.description"
          />
        </div>
      </MockupPart>

      <MockupPart
        :order="1"
        data-anchor
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="cache-max-age"
            label="Max Age"
            required
          />
          <InputNumber
            id="cache-max-age"
            :model-value="3600"
            size="medium"
            show-buttons
            aria-label="Max Age"
          />
          <HelperText
            label="Maximum time (in seconds) content is cached at the edge. Minimum of 3 seconds."
          />
        </div>
      </MockupPart>

      <MockupPart
        :order="2"
        data-anchor
      >
        <span class="flex items-start gap-(--spacing-sm)">
          <LegacySwitch :checked="frame.stale" />
          <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <span class="text-label-md text-(--text-default)">Stale cache</span>
            <span class="text-body-xs text-(--text-muted)">
              Enable stale cache to serve expired content temporarily while fetching updated content
              from the origin.
            </span>
          </span>
        </span>
      </MockupPart>

      <div
        data-anchor
        class="flex flex-col gap-(--spacing-lg)"
      >
        <span class="flex items-start gap-(--spacing-sm)">
          <LegacySwitch :checked="true" />
          <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <span class="text-label-md text-(--text-default)">Large file optimization</span>
            <span class="text-body-xs text-(--text-muted)">
              Optimize caching for large files by splitting them into smaller fragments for
              efficient delivery.
            </span>
          </span>
        </span>
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="cache-offset"
            label="Offset (KB)"
          />
          <InputNumber
            id="cache-offset"
            :model-value="1024"
            size="medium"
            aria-label="Offset (KB)"
          />
          <HelperText
            label="Specifies the fragment size (in KB) for large file optimization. Fixed at 1024 KB."
          />
        </div>
      </div>
    </div>
  </ShellMockup>
</template>

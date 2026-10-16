<script setup lang="ts">
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'NetworkShieldIpListFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the form scrolls to the list and a new entry is typed into it while it is, and taken back out after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const TYPES = [
    {
      value: 'asn',
      label: 'ASN',
      description:
        'Identify networks using Autonomous System Numbers (ASNs). Ideal for traffic grouping.'
    },
    {
      value: 'ip_cidr',
      label: 'IP/CIDR',
      description:
        'Define specific IP addresses or ranges using CIDR notation. Ideal for precise traffic segmentation.'
    },
    {
      value: 'countries',
      label: 'Countries',
      description:
        'Group traffic based on geographic regions or countries. Simplifies location-based configurations.'
    }
  ]

  const ITEMS = ['10.0.0.1', '10.0.0.3', '10.0.0.4', '2001:db8::/32']
  const ENTRY = '171.25.193.25 #comment'

  interface Frame {
    anchor: number
    typed: number
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { anchor: 0, typed: 0, forward: 0, back: 0 },
    { anchor: 1, typed: 0, forward: 200, back: 420 },
    ...Array.from({ length: ENTRY.length }, (_, index) => ({
      anchor: 1,
      typed: index + 1,
      forward: index === 0 ? 820 : 55,
      back: 30
    }))
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 20

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const column = ref<globalThis.HTMLElement | null>(null)
  const offsets = ref<number[]>([0, 0])

  const measure = () => {
    const anchors = column.value?.querySelectorAll<globalThis.HTMLElement>('[data-anchor]')
    if (!anchors?.length) return
    offsets.value = [...anchors].map((anchor) => anchor.offsetTop)
  }

  const atRest = computed(() => frame.value.anchor === 0)

  const scrollStyle = computed(() => ({
    translate: `0 ${atRest.value ? 0 : LEAD - (offsets.value[frame.value.anchor] ?? 0)}px`
  }))

  const listValue = computed(() =>
    [...ITEMS, ...(frame.value.typed ? [ENTRY.slice(0, frame.value.typed)] : [])].join('\n')
  )

  const typing = computed(() => frame.value.typed > 0)

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
    class="[--mockup-fade-edge:16%] [--mockup-fade-start:74%]"
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
      <MockupPart
        :order="0"
        data-anchor
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="network-list-name"
            label="Name"
            required
          />
          <InputText
            id="network-list-name"
            model-value="qa-p-nl-ip"
            size="medium"
            aria-label="Name"
          />
          <HelperText label="Give a unique and descriptive name to identify the network list." />
        </div>
      </MockupPart>

      <MockupPart :order="1">
        <div class="flex flex-col gap-(--spacing-sm)">
          <FieldRadioBlock
            v-for="type in TYPES"
            :key="type.value"
            model-value="ip_cidr"
            name="network-list-type"
            :value="type.value"
            :label="type.label"
            :description="type.description"
          />
        </div>
      </MockupPart>

      <MockupPart
        :order="2"
        data-anchor
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="network-list-items"
            label="List"
            required
          />
          <span
            :data-focused="typing || null"
            class="flex rounded-(--shape-elements) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-focused:ring-2 data-focused:ring-offset-2 motion-reduce:transition-none"
          >
            <Textarea
              id="network-list-items"
              :model-value="listValue"
              rows="7"
              resizable="none"
              aria-label="List"
            />
          </span>
          <HelperText
            label="Enter one IP address or CIDR per line. Optionally, add an expiration date in UTC with --LT (format YYYY-MM-DDTHH:MM:SSZ), followed by a comment with #. The comment must always be the last item on the line, e.g., 192.168.0.1 --LT2027-01-01T00:00:00Z #comment. --LT is reserved and can't be used in comments. Duplicated entries are automatically removed."
          />
        </div>
      </MockupPart>
    </div>
  </ShellMockup>
</template>

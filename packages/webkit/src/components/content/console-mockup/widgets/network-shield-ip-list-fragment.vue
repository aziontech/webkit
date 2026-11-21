<script setup lang="ts">
  import { computed } from 'vue'

  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import Input from '../../../input/input/input.vue'
  import RadioGroup from '../../../input/radio-group/radio-group.vue'
  import RadioGroupItem from '../../../input/radio-group/radio-group-item/radio-group-item.vue'
  import Textarea from '../../../input/textarea/textarea.vue'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'

  defineOptions({ name: 'NetworkShieldIpListFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the form scrolls to the list and a new entry is typed into it while it is, and taken back out after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

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

  const ITEMS = ['192.0.2.1', '192.0.2.3', '192.0.2.4', '2001:db8::/32']
  const ENTRY = '198.51.100.25 #comment'

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

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })

  const listValue = computed(() =>
    [...ITEMS, ...(frame.value.typed ? [ENTRY.slice(0, frame.value.typed)] : [])].join('\n')
  )

  const typing = computed(() => frame.value.typed > 0)

  const FIELD_RING_CLASS =
    'flex rounded-(--shape-control) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-focused:ring-2 data-focused:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:16%] [--console-mockup-fade-start:74%]"
    column-class="flex flex-col gap-(--spacing-lg)"
    :active="active"
    :anchor="frame.anchor || null"
    :lead="20"
    observe
  >
    <ConsoleMockupShellItem
      :order="0"
      data-anchor
    >
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel
          for="network-list-name"
          required
          >Name</FieldLabel
        >
        <Input
          id="network-list-name"
          model-value="qa-p-nl-ip"
          size="medium"
          aria-label="Name"
        />
        <FieldDescription
          >Give a unique and descriptive name to identify the network list.</FieldDescription
        >
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="1">
      <div class="flex flex-col gap-(--spacing-sm)">
        <RadioGroup
          model-value="ip_cidr"
          variant="card"
          name="network-list-type"
          aria-label="Type"
        >
          <RadioGroupItem
            v-for="type in TYPES"
            :key="type.value"
            :value="type.value"
            :description="type.description"
            >{{ type.label }}</RadioGroupItem
          >
        </RadioGroup>
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem
      :order="2"
      data-anchor
    >
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel
          for="network-list-items"
          required
          >List</FieldLabel
        >
        <span
          :data-focused="typing || null"
          :class="FIELD_RING_CLASS"
        >
          <Textarea
            id="network-list-items"
            :model-value="listValue"
            rows="7"
            resize="none"
            aria-label="List"
          />
        </span>
        <FieldDescription
          >Enter one IP address or CIDR per line. Optionally, add an expiration date in UTC with
          --LT (format YYYY-MM-DDTHH:MM:SSZ), followed by a comment with #. The comment must always
          be the last item on the line, e.g., 192.0.2.1 --LT2027-01-01T00:00:00Z #comment. --LT is
          reserved and can't be used in comments. Duplicated entries are automatically
          removed.</FieldDescription
        >
      </div>
    </ConsoleMockupShellItem>
  </MockupScrollColumn>
</template>

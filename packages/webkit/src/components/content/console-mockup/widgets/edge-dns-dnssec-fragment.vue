<script setup lang="ts">
  import CopyButton from '../../../action/copy-button/copy-button.vue'
  import Input from '../../../input/input/input.vue'
  import InputGroupRoot from '../../../input/input-group/input-group.vue'
  import Switch from '../../../input/switch/switch.vue'
  import Item from '../../item/index'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'EdgeDnsDnssecFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; DNSSEC is switched on and its key values are added one by one while it is, and taken back out after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const DNSSEC_KEYS = [
    {
      label: 'Key tag',
      value: '34505',
      description:
        'Unique identifier for the DNSSEC key used to sign your zone. Use this value with your domain provider.'
    },
    {
      label: 'Algorithm',
      value: '13 (ECDSA Curve P-256 with SHA-256)',
      description: 'Specifies the algorithm used to generate the DNSSEC key.'
    },
    {
      label: 'Digest Type',
      value: '2 (SHA-256)',
      description: 'Indicates the hash function used for the DNSSEC digest.'
    },
    {
      label: 'Digest',
      value: '8A9E1F2C3B4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F',
      description:
        'Cryptographic hash of the public key for DNSSEC validation. Provide this to your provider.'
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    dnssec: boolean
    keys: number
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'dnssec', x: -2.4, y: 1.9 }
  const SWITCH: MockupCursorTarget = { key: 'dnssec', x: 0.55, y: 0.6 }

  const REST = { cursor: IDLE, press: false, focused: false, dnssec: false, keys: 0 }
  const ON = { ...REST, cursor: SWITCH, dnssec: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: SWITCH, forward: 120, back: 420 },
    { ...REST, cursor: SWITCH, press: true, focused: true, forward: 480, back: 120 },
    { ...ON, press: true, focused: true, forward: 120, back: 160 },
    { ...ON, focused: true, keys: 1, forward: 260, back: 260 },
    { ...ON, keys: 2, forward: 220, back: 220 },
    { ...ON, keys: 3, forward: 220, back: 220 },
    { ...ON, keys: 4, forward: 220, back: 220 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:74%]"
    :active="active"
    :cursor="frame.cursor"
    cursor-name="Alex"
    :pressed="frame.press"
  >
    <div class="flex flex-col py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <Item
          variant="inline"
          size="small"
        >
          <Item.Content>
            <Item.Title>Enable DNSSEC</Item.Title>
            <Item.Description>
              Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks.
              Configure the Key Tag and Digest values in your domain provider to complete the setup.
            </Item.Description>
          </Item.Content>
          <Item.Actions>
            <span
              data-cursor="dnssec"
              :data-focused="frame.focused || null"
              class="inline-flex rounded-(--shape-control) data-[focused]:ring-2 data-[focused]:ring-(--ring-color) data-[focused]:ring-offset-2 data-[focused]:ring-offset-(--bg-canvas)"
            >
              <Switch
                :model-value="frame.dnssec"
                aria-label="Enable DNSSEC"
              />
            </span>
          </Item.Actions>
        </Item>
      </ConsoleMockupShellItem>

      <template
        v-for="(key, index) in DNSSEC_KEYS"
        :key="key.label"
      >
        <Transition
          enter-from-class="-translate-y-1 opacity-0"
          enter-active-class="transition-[opacity,translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          leave-to-class="-translate-y-1 opacity-0"
          leave-active-class="transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        >
          <div
            v-if="index < frame.keys"
            class="overflow-hidden [interpolate-size:allow-keywords]"
          >
            <div class="pt-(--spacing-lg)">
              <Item
                variant="inline"
                size="small"
                class="flex-col items-stretch gap-(--spacing-sm)"
              >
                <Item.Content>
                  <Item.Title>{{ key.label }}</Item.Title>
                  <Item.Description>{{ key.description }}</Item.Description>
                </Item.Content>
                <Item.Actions class="w-full justify-start">
                  <InputGroupRoot class="w-full">
                    <Input
                      :model-value="key.value"
                      size="medium"
                      monospace
                      class="flex-1"
                      :aria-label="key.label"
                      readonly
                    />
                    <CopyButton
                      variant="ghost"
                      :value="key.value"
                      :aria-label="`Copy ${key.label}`"
                      size="small"
                    />
                  </InputGroupRoot>
                </Item.Actions>
              </Item>
            </div>
          </div>
        </Transition>
      </template>

      <ConsoleMockupShellItem
        :order="1"
        class="pt-(--spacing-lg)"
      >
        <Item
          variant="inline"
          size="small"
        >
          <Item.Content>
            <Item.Title>Active</Item.Title>
            <Item.Description>
              When active, the zone answers authoritative DNS queries for the domain.
            </Item.Description>
          </Item.Content>
          <Item.Actions>
            <Switch
              :model-value="true"
              aria-label="Active"
            />
          </Item.Actions>
        </Item>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>

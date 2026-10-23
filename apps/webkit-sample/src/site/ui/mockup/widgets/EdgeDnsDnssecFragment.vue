<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'EdgeDnsDnssecFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; DNSSEC is switched on and its key values are added one by one while it is, and taken back out after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

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
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:74%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative"
    >
      <div class="flex flex-col py-(--spacing-xs)">
        <MockupPart :order="0">
          <Item
            kind="inline"
            size="small"
          >
            <Item.Content>
              <Item.Title>Enable DNSSEC</Item.Title>
              <Item.Description>
                Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks.
                Configure the Key Tag and Digest values in your domain provider to complete the
                setup.
              </Item.Description>
            </Item.Content>
            <Item.Actions>
              <span
                data-cursor="dnssec"
                class="inline-flex"
              >
                <Switch
                  :model-value="frame.dnssec"
                  :focused="frame.focused"
                  aria-label="Enable DNSSEC"
                />
              </span>
            </Item.Actions>
          </Item>
        </MockupPart>

        <template
          v-for="(key, index) in DNSSEC_KEYS"
          :key="key.label"
        >
          <Transition
            enter-active-class="animate-slide-down motion-reduce:animate-none"
            leave-active-class="animate-slide-down [animation-direction:reverse] motion-reduce:animate-none"
          >
            <div
              v-if="index < frame.keys"
              class="overflow-hidden [interpolate-size:allow-keywords]"
            >
              <div class="pt-(--spacing-lg)">
                <Item
                  kind="inline"
                  size="small"
                  class="flex-col items-stretch gap-(--spacing-sm)"
                >
                  <Item.Content>
                    <Item.Title>{{ key.label }}</Item.Title>
                    <Item.Description>{{ key.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions class="w-full justify-start">
                    <InputGroupRoot class="w-full">
                      <InputText
                        :model-value="key.value"
                        size="medium"
                        class="flex-1 font-code"
                        :aria-label="key.label"
                        readonly
                      />
                      <CopyButton
                        kind="transparent"
                        :value="key.value"
                        :aria-label="`Copy ${key.label}`"
                      />
                    </InputGroupRoot>
                  </Item.Actions>
                </Item>
              </div>
            </div>
          </Transition>
        </template>

        <MockupPart
          :order="1"
          class="pt-(--spacing-lg)"
        >
          <Item
            kind="inline"
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
        </MockupPart>
      </div>

      <MockupCursor
        name="Rafael"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>

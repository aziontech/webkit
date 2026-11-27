<script setup lang="ts">
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import Input from '../../../input/input/input.vue'
  import NumberInput from '../../../input/number-input/number-input.vue'
  import Textarea from '../../../input/textarea/textarea.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import LegacySwitch from '../parts/legacy-switch.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'KvStoreKeyFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; expiration is switched on and its fields slide in while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const VALUE = '{"userId":"user-123","role":"admin"}'

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    expiring: boolean
    added: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'value', x: 0.78, y: 0.55 }
  const SWITCH: MockupCursorTarget = { key: 'expiration', x: 0.6, y: 0.6 }

  const REST = { cursor: IDLE, press: false, expiring: false, added: false }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: SWITCH, forward: 160, back: 420 },
    { ...REST, cursor: SWITCH, press: true, forward: 480, back: 120 },
    { ...REST, cursor: SWITCH, press: true, expiring: true, forward: 120, back: 160 },
    { ...REST, cursor: SWITCH, expiring: true, added: true, forward: 220, back: 80 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:72%]"
    :active="active"
    :cursor="frame.cursor"
    cursor-name="Sam"
    :pressed="frame.press"
  >
    <div class="flex flex-col gap-(--spacing-lg) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col gap-(--spacing-xs)">
          <FieldLabel
            for="kv-key"
            required
            >Key</FieldLabel
          >
          <Input
            id="kv-key"
            model-value="session:user-123"
            size="medium"
            aria-label="Key"
          />
          <FieldDescription>Unique key in the namespace, up to 512 bytes.</FieldDescription>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="1">
        <div class="flex flex-col">
          <span class="flex items-start gap-(--spacing-sm)">
            <LegacySwitch
              :checked="frame.expiring"
              data-cursor="expiration"
            />
            <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <span class="text-label-md text-(--text-default)">Expiration</span>
              <span class="text-body-xs text-(--text-muted)">
                Expire the key automatically after a set time.
              </span>
            </span>
          </span>

          <Transition
            enter-from-class="-translate-y-1 opacity-0"
            enter-active-class="transition-[opacity,translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
            leave-to-class="-translate-y-1 opacity-0"
            leave-active-class="transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          >
            <div
              v-if="frame.added"
              class="overflow-hidden [interpolate-size:allow-keywords]"
            >
              <div class="grid grid-cols-2 gap-(--spacing-sm) pt-(--spacing-md)">
                <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                  <FieldLabel for="kv-expiration-type">Type</FieldLabel>
                  <MockupSelect
                    value="EX"
                    control-id="kv-expiration-type"
                    aria-label="Expiration type"
                  />
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                  <FieldLabel for="kv-expiration-value">Seconds</FieldLabel>
                  <NumberInput
                    id="kv-expiration-value"
                    :model-value="3600"
                    size="medium"
                    aria-label="Expiration seconds"
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="2">
        <div class="flex flex-col gap-(--spacing-xs)">
          <FieldLabel
            for="kv-value"
            required
            >Value</FieldLabel
          >
          <Textarea
            id="kv-value"
            :model-value="VALUE"
            resize="none"
            data-cursor="value"
            aria-label="Value"
          />
          <FieldDescription>String, JSON, Buffer or Stream, up to 25 MB.</FieldDescription>
        </div>
      </ConsoleMockupShellItem>

      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel for="kv-metadata">Metadata</FieldLabel>
        <Textarea
          id="kv-metadata"
          model-value='{ "source": "login" }'
          resize="none"
          aria-label="Metadata"
        />
      </div>
    </div>
  </MockupFragment>
</template>

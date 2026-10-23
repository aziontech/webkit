<script setup lang="ts">
  import HelperText from '@aziontech/webkit/helper-text'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import LegacySwitch from '../LegacySwitch.vue'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import MockupSelect from '../MockupSelect.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'KvStoreKeyFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; expiration is switched on and its fields slide in while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:72%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative"
    >
      <div class="flex flex-col gap-(--spacing-lg) py-(--spacing-xs)">
        <MockupPart :order="0">
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label
              for="kv-key"
              label="Key"
              required
            />
            <InputText
              id="kv-key"
              model-value="session:user-123"
              size="medium"
              aria-label="Key"
            />
            <HelperText label="Unique key in the namespace, up to 512 bytes." />
          </div>
        </MockupPart>

        <MockupPart :order="1">
          <div class="flex flex-col">
            <span class="flex items-start gap-(--spacing-sm)">
              <LegacySwitch
                :checked="frame.expiring"
                data-cursor="expiration"
              />
              <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <span class="text-label-md text-(--text-default)">Expiration</span>
                <span class="text-body-xs text-(--text-muted)">
                  Expire the key automatically after a set time.
                </span>
              </span>
            </span>

            <Transition
              enter-active-class="animate-slide-down motion-reduce:animate-none"
              leave-active-class="animate-slide-down [animation-direction:reverse] motion-reduce:animate-none"
            >
              <div
                v-if="frame.added"
                class="overflow-hidden [interpolate-size:allow-keywords]"
              >
                <div class="grid grid-cols-2 gap-(--spacing-sm) pt-(--spacing-md)">
                  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                    <Label
                      for="kv-expiration-type"
                      label="Type"
                    />
                    <MockupSelect
                      value="EX"
                      control-id="kv-expiration-type"
                      aria-label="Expiration type"
                    />
                  </div>
                  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                    <Label
                      for="kv-expiration-value"
                      label="Seconds"
                    />
                    <InputNumber
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
        </MockupPart>

        <MockupPart :order="2">
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label
              for="kv-value"
              label="Value"
              required
            />
            <Textarea
              id="kv-value"
              :model-value="VALUE"
              resizable="none"
              data-cursor="value"
              aria-label="Value"
            />
            <HelperText label="String, JSON, Buffer or Stream, up to 25 MB." />
          </div>
        </MockupPart>

        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="kv-metadata"
            label="Metadata"
          />
          <Textarea
            id="kv-metadata"
            model-value='{ "source": "login" }'
            resizable="none"
            aria-label="Metadata"
          />
        </div>
      </div>

      <MockupCursor
        name="Marcus"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>

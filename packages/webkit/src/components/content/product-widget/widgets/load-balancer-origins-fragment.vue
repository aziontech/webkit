<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'LoadBalancerOriginsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; Add Address is pressed and a new address joins the list while it is, and leaves after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const ADDRESSES = [
    { address: 'origin-aws.example.com', role: 'primary', weight: 2 },
    { address: '203.0.113.20', role: 'backup', weight: 1 }
  ]

  const ADDED = { address: 'example.com', role: 'primary', weight: 1 }

  interface Frame {
    pressed: boolean
    added: boolean
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { pressed: false, added: false, forward: 0, back: 0 },
    { pressed: true, added: false, forward: 320, back: 0 },
    { pressed: true, added: true, forward: 260, back: 120 },
    { pressed: false, added: true, forward: 360, back: 360 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const goingBack = ref(false)

  const frame = computed(() => FRAMES[step.value])
  const pressed = computed(() => frame.value.pressed && !goingBack.value)

  const meta = (row: { role: string; weight: number }) => [
    { label: 'HTTP Port:', value: '80' },
    { label: 'HTTPS Port:', value: '443' },
    { label: 'Server Role:', value: row.role },
    { label: 'Weight:', value: String(row.weight) }
  ]

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
    goingBack.value = !forward
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
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
      <div class="flex flex-col">
        <div class="flex flex-col gap-(--spacing-xs)">
          <ShellMockupPart
            v-for="(row, index) in ADDRESSES"
            :key="row.address"
            :order="index"
          >
            <div
              class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
            >
              <i
                class="pi pi-chevron-right shrink-0 text-body-xs leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                <span class="truncate text-body-sm text-(--text-default)">{{ row.address }}</span>
                <span class="flex flex-wrap gap-x-(--spacing-xs)">
                  <span
                    v-for="pair in meta(row)"
                    :key="pair.label"
                    class="flex gap-(--spacing-xxs)"
                  >
                    <span class="text-body-xs text-(--text-muted)">{{ pair.label }}</span>
                    <span class="text-label-sm text-(--text-default)">{{ pair.value }}</span>
                  </span>
                </span>
              </span>
              <IconButton
                icon="pi pi-trash"
                kind="outlined"
                size="small"
                ariaLabel="Remove address"
              />
            </div>
          </ShellMockupPart>
        </div>

        <Transition
          enter-active-class="animate-slide-down motion-reduce:animate-none"
          leave-active-class="animate-slide-down [animation-direction:reverse] motion-reduce:animate-none"
        >
          <div
            v-if="frame.added"
            class="overflow-hidden [interpolate-size:allow-keywords]"
          >
            <div class="pt-(--spacing-xs)">
              <div
                class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <i
                  class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                  <span class="truncate text-body-sm text-(--text-default)">
                    {{ ADDED.address }}
                  </span>
                  <span class="flex flex-wrap gap-x-(--spacing-xs)">
                    <span
                      v-for="pair in meta(ADDED)"
                      :key="pair.label"
                      class="flex gap-(--spacing-xxs)"
                    >
                      <span class="text-body-xs text-(--text-muted)">{{ pair.label }}</span>
                      <span class="text-label-sm text-(--text-default)">{{ pair.value }}</span>
                    </span>
                  </span>
                </span>
                <IconButton
                  icon="pi pi-trash"
                  kind="outlined"
                  size="small"
                  ariaLabel="Remove address"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <ShellMockupPart :order="2">
        <span class="flex">
          <span
            :data-pressed="pressed || null"
            class="inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-pressed:ring-2 data-pressed:ring-offset-2 motion-reduce:transition-none"
          >
            <Button
              label="Add Address"
              kind="outlined"
              size="small"
              icon="pi pi-plus-circle"
            />
          </span>
        </span>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>
